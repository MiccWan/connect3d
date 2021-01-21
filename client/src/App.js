import React, { useState, useEffect } from 'react';
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

const loginTokenKey = 'login_token';

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
  const [phase, setPhase] = useState(PhaseType.WaitForLogin);
  const [roomId, setRoomId] = useState(0);

  const [chatContent, setChatContent] = useState([]);
  const [playerList, setPlayerList] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [gamers, setGamers] = useState({});
  const [gameState, setGameState] = useState({});

  const [roomInfo, setRoomInfo] = useState({});

  const initSocket = async ({ name: inputName, token: inputToken } = {}) => {
    if (!socket) {
      const funcs = { setChatContent, setPlayerList, setRoomList, setRoomInfo, setGamers, setGameState };
      const _socket = new ClientSocketWrapper(funcs);
      try {
        const { name, players, rooms, token } = await _socket.request(ClientRequests.Login, { name: inputName, token: inputToken });
        setUserName(name);
        setPlayerList(players);
        setRoomList(rooms);
        showToast(`Logged in as ${name}`);
        setPhase(PhaseType.Lobby);

        if (token) {
          localStorage.setItem(loginTokenKey, token);
        }

        setSocket(_socket);
      }
      catch (err) {
        showToast(`Login failed: ${err.message}`);
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

  const loginByToken = asyncWrapper(async (token) => {
    await initSocket({ token });
  });

  useEffect(() => {
    if (phase === PhaseType.WaitForLogin) {
      const token = localStorage.getItem(loginTokenKey);
      if (token) {
        loginByToken(token);
      }
      else {
        setPhase(PhaseType.Login);
      }
    }
  }, []);

  const logout = asyncWrapper(async () => {
    const token = localStorage.getItem(loginTokenKey);
    if (token) {
      await socket.request(ClientRequests.Logout, { token });
      localStorage.removeItem(loginTokenKey);
    }
    socket.disconnect();
    setSocket(null);
    setPhase(PhaseType.Login);
    showToast('Logged out');
  });

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
    if (phase === PhaseType.WaitForLogin) {
      return (<div />);
    }
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
