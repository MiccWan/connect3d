import React, { useState } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
// import newLogger from 'knect-common/src/Logger.js';
import { ClientRequests } from 'knect-common/src/SocketEvents';
// import './App.css';
import LoginPage from './container/LoginPage.js';
import LobbyPage from './container/LobbyPage.js';
import RoomPage from './container/RoomPage.js';
import ClientSocketWrapper from './socket/index.js';

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
    }
  },
});

function App() {
  let socket;
  const [userName, setUserName] = useState('');
  const [isNotLogin, setIsNotLogin] = useState(true);
  const [isNotEnterRoom, setNotIsEnterRoom] = useState(true);
  const [roomId, setRoomId] = useState(0);
  const [messages, setMessages] = useState([]);
  // const [playerList, setPlayerList] = useState([]);

  const initSocket = async () => {
    if (!socket) {
      const funcs = { setMessages };
      socket = new ClientSocketWrapper(funcs);
      setUserName(await socket.request(ClientRequests.GetPlayerName));
    }
  };

  const login = (name) => {
    initSocket();
    setUserName(name);
    setIsNotLogin(false);
  };

  const enterRoom = (id) => {
    setRoomId(id);
    setNotIsEnterRoom(false);
  };

  const leaveRoom = () => {
    setRoomId(0);
    setNotIsEnterRoom(true);
  };

  const returnPage = () => {
    if (isNotLogin) {
      return (<LoginPage login={login} />);
    }
    if (isNotEnterRoom) {
      return (
        <LobbyPage
          messages={messages}
          userName={userName}
          roomId={roomId}
          enterRoom={enterRoom}
        />
      );
    }
    return (<RoomPage userName={userName} roomId={roomId} leaveRoom={leaveRoom} />);
  };

  return (
    <ThemeProvider theme={theme}>
      {returnPage()}
    </ThemeProvider>
  );
}

export default App;
