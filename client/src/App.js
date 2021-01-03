import React, { useState } from 'react';
import io from 'socket.io-client';
import newLogger from 'knect-common/src/Logger.js';
// import './App.css';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import LoginPage from './container/LoginPage.js';
import LobbyPage from './container/LobbyPage.js';

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

  const login = (name) => {
    setUserName(name);
    setIsNotLogin(false);
  };

  return (
    <ThemeProvider theme={theme}>
      {isNotLogin ? (
        <LoginPage initSocket={initSocket} login={login} />
      )
        : (
          <LobbyPage userName={userName} />
        )}
    </ThemeProvider>
  );
}

export default App;
