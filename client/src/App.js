import React, { useState } from 'react';
import io from 'socket.io-client';
import newLogger from 'knect-common/src/Logger.js';
// import './App.css';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import LoginPage from './container/LoginPage.js';
import LobbyPage from './container/LobbyPage.js';
import RoomPage from './container/RoomPage.js';

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
    }
  },
});

function App() {
  let socket;

  const initSocket = () => {
    socket = io();

    socket.on('msg', ({ msg }) => log.info(msg));
  };

  const [userName, setUserName] = useState('');
  const [isNotLogin, setIsNotLogin] = useState(true);
  const [isNotEnterRoom, setNotIsEnterRoom] = useState(true);
  const [roomId, setRoomId] = useState(0);

  const login = (name) => {
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
      return (<LoginPage initSocket={initSocket} login={login} />);
    }
    if (isNotEnterRoom) {
      return (<LobbyPage userName={userName} enterRoom={enterRoom} roomId={roomId} />);
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
