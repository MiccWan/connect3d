import React, { useState } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import newLogger from 'knect-common/src/Logger.js';
import { ClientRequests } from 'knect-common/src/SocketEvents.js';

import LoginPage from './container/LoginPage.js';
import LobbyPage from './container/LobbyPage.js';
import RoomPage from './container/RoomPage.js';
import ClientSocketWrapper from './socket/index.js';

import SocketContext from './socket/SocketContext.js';
import showToast from './helper/Toast.js';
import PhaseType from './PhaseType.js';

const log = newLogger('App');

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#40798C',
    },
    text: {
      primary: '#56494E',
    },
    background: {
      paper: '#EFDBBD',
      default: '#EAD2AC',
    },
    player: {
      one: '#F4997B',
      two: '#A4C77F',
    },
  },
});

function asyncWrapper(cb) {
  return async (...args) => {
    try {
      return await cb(...args);
    }
    catch (err) {
      log.error('Promise rejected: ', cb.name?.trim() || '(anonymous callback)', '-', err);
      return err;
    }
  };
}

function App() {
  const [socket, setSocket] = useState();
  const [userName, setUserName] = useState('');
  const [phase, setPhase] = useState(PhaseType.Login);
  const [roomId, setRoomId] = useState(0);

  const [chatContent, setChatContent] = useState([]);
  const [playerList, setPlayerList] = useState([]);
  const [roomList, setRoomList] = useState({});
  const [gamers, setGamers] = useState({});
  const [gameState, setGameState] = useState({});

  const [roomInfo, setRoomInfo] = useState({});

  const initSocket = async ({ name } = {}) => {
    if (!socket) {
      const funcs = { setChatContent, setPlayerList, setRoomList, setRoomInfo, setGamers, setGameState };
      const _socket = new ClientSocketWrapper(funcs);
      setSocket(_socket);
      try {
        const loginResponse = await _socket.request(ClientRequests.Login, { name });
        setUserName(loginResponse.name);
        setPlayerList(loginResponse.players);
        setRoomList(loginResponse.rooms);
        showToast(`Logged in as ${loginResponse.name}`);
        setPhase(PhaseType.Lobby);
      }
      catch (err) {
        showToast('Login failed');
        log.error(err);
      }
    }
  };

  const login = async (name) => {
    await initSocket({ name });
  };

  const loginAsGuest = async () => {
    await initSocket();
  };

  const logout = async () => {
    showToast('Logged out');
    setIsNotLogin(true);
  };

  const createRoom = asyncWrapper(async (roomName) => {
    const tempRoomInfo = await socket.request(ClientRequests.CreateRoom, { name: roomName });
    setRoomInfo(tempRoomInfo);
    setRoomId(tempRoomInfo.id);
    setPlayerList(tempRoomInfo.allPlayers);
    setRoomList([]);
    setChatContent([]);
    setPhase(PhaseType.Room);
  });

  const joinRoom = asyncWrapper(async (id) => {
    const tempRoomInfo = await socket.request(ClientRequests.JoinRoom, { roomId: id });
    setRoomInfo(tempRoomInfo);
    setRoomId(id);
    setPlayerList(tempRoomInfo.allPlayers);
    setGamers(tempRoomInfo.gamers);
    setGameState(tempRoomInfo.game);
    setRoomList([]);
    setChatContent([]);
    setPhase(PhaseType.Room);
  });

  const leaveRoom = asyncWrapper(async () => {
    const tempRoomInfo = await socket.request(ClientRequests.LeaveRoom);
    setRoomInfo(tempRoomInfo);
    setRoomId(tempRoomInfo.roomId);
    setPlayerList(tempRoomInfo.players);
    setRoomList(tempRoomInfo.rooms);
    setChatContent([]);
    setGameState({});
    setPhase(PhaseType.Lobby);
  });

  const returnPage = () => {
    if (phase === PhaseType.Login) {
      return (<LoginPage login={login} loginAsGuest={loginAsGuest} />);
    }
    if (phase === PhaseType.Lobby) {
      return (
        <LobbyPage
          userName={userName}
          roomId={roomId}
          chatContent={chatContent}
          playerList={playerList}
          roomList={roomList}
          createRoom={createRoom}
          joinRoom={joinRoom}
          logout={logout}
        />
      );
    }
    if (phase === PhaseType.Room) {
      return (
        <RoomPage
          userName={userName}
          roomId={roomId}
          leaveRoom={leaveRoom}
          chatContent={chatContent}
          roomInfo={roomInfo}
          playerList={playerList}
          gamers={gamers}
          gameState={gameState}
        />
      );
    }
    log.error(`Unknown phase ${phase}`);
    return null;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SocketContext.Provider value={socket}>
        {returnPage()}
      </SocketContext.Provider>
    </ThemeProvider>
  );
}

export default App;
