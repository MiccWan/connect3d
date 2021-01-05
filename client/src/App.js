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
  const [roomID, setRoomID] = useState(0);

  const login = (name) => {
    setUserName(name);
    setIsNotLogin(false);
  };

  const enterRoom = (_roomID) => {
    setRoomID(_roomID);
    setNotIsEnterRoom(false);
  };

  const leaveRoom = () => {
    setRoomID(0);
    setNotIsEnterRoom(true);
  };

  const returnPage = () => {
    if (isNotLogin) {
      return (<LoginPage initSocket={initSocket} login={login} />);
    }
    if (isNotEnterRoom) {
      return (<LobbyPage userName={userName} enterRoom={enterRoom} roomID={roomID} />);
    }
    return (<RoomPage userName={userName} roomID={roomID} leaveRoom={leaveRoom} />);
  };

  return (
    <ThemeProvider theme={theme}>
      {returnPage()}
    </ThemeProvider>
  );
}

export default App;
