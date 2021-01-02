import React, { useState } from 'react';
import io from 'socket.io-client';
import newLogger from 'knect-common/src/Logger.js';
import './App.css';
import LoginPage from './container/LoginPage.js';
import LobbyPage from './container/LobbyPage.js';

const log = newLogger('App');

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
    isNotLogin ? (
      <LoginPage initSocket={initSocket} login={login} />
    )
      : (
        <LobbyPage userName={userName} />
      )
  );
}

export default App;
