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
  const [isNotLogin, setIsNotLogin] = useState(true);
  const [isNotEnterRoom, setNotIsEnterRoom] = useState(true);
  const [roomId, setRoomId] = useState(0);

  const [chatContent, setChatContent] = useState([]);
  const [playerList, setPlayerList] = useState([]);
  const [roomList, setRoomList] = useState({});
  const [gamers, setGamers] = useState({});
  const [gameState, setGameState] = useState({});

  const [roomInfo, setRoomInfo] = useState({});

  const initSocket = async () => {
    if (!socket) {
      const funcs = { setChatContent, setPlayerList, setRoomList, setRoomInfo, setGamers, setGameState };
      const _socket = new ClientSocketWrapper(funcs);
      setSocket(_socket);
      setUserName(await _socket.request(ClientRequests.GetPlayerName));
      setPlayerList(await _socket.request(ClientRequests.GetPlayerList));
      setRoomList(await _socket.request(ClientRequests.GetRoomList));
    }
  };

  const login = async () => {
    await initSocket();
    setIsNotLogin(false);
  };

  const createRoom = asyncWrapper(async (roomName) => {
    const tempRoomInfo = await socket.request(ClientRequests.CreateRoom, { name: roomName });
    setRoomInfo(tempRoomInfo);
    setRoomId(tempRoomInfo.id);
    setNotIsEnterRoom(false);
    setPlayerList(tempRoomInfo.allPlayers);
    setRoomList([]);
    setChatContent([]);
  });

  const joinRoom = asyncWrapper(async (id) => {
    const tempRoomInfo = await socket.request(ClientRequests.JoinRoom, { roomId: id });
    setRoomInfo(tempRoomInfo);
    setRoomId(id);
    setNotIsEnterRoom(false);
    setPlayerList(tempRoomInfo.allPlayers);
    setGamers(tempRoomInfo.gamers);
    setGameState(tempRoomInfo.game);
    setRoomList([]);
    setChatContent([]);
  });

  const leaveRoom = asyncWrapper(async () => {
    const tempRoomInfo = await socket.request(ClientRequests.LeaveRoom);
    setRoomInfo(tempRoomInfo);
    setRoomId(tempRoomInfo.roomId);
    setNotIsEnterRoom(true);
    setPlayerList(tempRoomInfo.players);
    setRoomList(tempRoomInfo.rooms);
    setChatContent([]);
    setGameState({});
  });

  const returnPage = () => {
    if (isNotLogin) {
      return (<LoginPage login={login} />);
    }
    if (isNotEnterRoom) {
      return (
        <LobbyPage
          userName={userName}
          roomId={roomId}
          chatContent={chatContent}
          playerList={playerList}
          roomList={roomList}
          createRoom={createRoom}
          joinRoom={joinRoom}
        />
      );
    }
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
