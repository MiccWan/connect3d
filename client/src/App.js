import React from 'react';
import io from 'socket.io-client';
import newLogger from 'knect-common/src/Logger';
import logo from './logo.svg';
import './App.css';

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
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>client/src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div><input type="button" value="connect" onClick={initSocket} /></div>
      </header>
    </div>
  );
}

export default App;
