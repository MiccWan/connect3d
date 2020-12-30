import React from 'react';
import io from 'socket.io-client';
import newLogger from 'knect-common/src/Logger.js';
import './App.css';
import LoginPage from './container/LoginPage.js';

const log = newLogger('App');

function App() {
  let socket;

  const initSocket = () => {
    socket = io();

    socket.on('msg', ({ msg }) => log.info(msg));
  };

  return (
    <div className="App">
      <header className="App-header">
        <LoginPage />
        <div><input type="button" value="connect" onClick={initSocket} /></div>
      </header>
    </div>
  );
}

export default App;
