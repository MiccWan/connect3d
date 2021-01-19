import React, { useState } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
// import newLogger from 'knect-common/src/Logger.js';
import { ClientRequests } from 'knect-common/src/SocketEvents';

import LoginPage from './container/LoginPage.js';
import LobbyPage from './container/LobbyPage.js';
import RoomPage from './container/RoomPage.js';
import ClientSocketWrapper from './socket/index.js';
import SocketContext from './socket/SocketContext.js';

// const log = newLogger('App');

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

function App() {
  const [socket, setSocket] = useState();
  const [userName, setUserName] = useState('');
  const [isNotLogin, setIsNotLogin] = useState(true);
  const [isNotEnterRoom, setNotIsEnterRoom] = useState(true);
  const [roomId, setRoomId] = useState(0);

  const [chatContent, setChatContent] = useState([]);
  const [playerList, setPlayerList] = useState([]);
  const [roomList, setRoomList] = useState({});

  const [roomInfo, setRoomInfo] = useState({});

  const initSocket = async () => {
    if (!socket) {
      const funcs = { setChatContent, setPlayerList, setRoomList, setRoomInfo };
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

  const createRoom = async (roomName) => {
    const tempRoomInfo = await socket.request(ClientRequests.CreateRoom, { name: roomName });
    setRoomInfo(tempRoomInfo);
    setRoomId(tempRoomInfo.id);
    setNotIsEnterRoom(false);
    setPlayerList(tempRoomInfo.allPlayers);
    setRoomList([]);
    setChatContent([]);
  };

  const joinRoom = async (id) => {
    const tempRoomInfo = await socket.request(ClientRequests.JoinRoom, { roomId: id });
    setRoomInfo(tempRoomInfo);
    setRoomId(id);
    setNotIsEnterRoom(false);
    setPlayerList(tempRoomInfo.allPlayers);
    setRoomList([]);
    setChatContent([]);
  };

  const leaveRoom = async () => {
    const tempRoomInfo = await socket.request(ClientRequests.LeaveRoom);
    setRoomInfo(tempRoomInfo);
    setRoomId(0);
    setNotIsEnterRoom(true);
    setPlayerList(tempRoomInfo.player);
    setRoomList(tempRoomInfo.room);
    setChatContent([]);
  };

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
      />
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <SocketContext.Provider value={socket}>
        {returnPage()}
      </SocketContext.Provider>
    </ThemeProvider>
  );
}

export default App;
