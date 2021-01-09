import React, { useState } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
// import newLogger from 'knect-common/src/Logger.js';
// import { ClientRequests } from 'knect-common/src/SocketEvents';
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
  const [socket, setSocket] = useState();
  const [userName, setUserName] = useState('');
  const [isNotLogin, setIsNotLogin] = useState(true);
  const [isNotEnterRoom, setNotIsEnterRoom] = useState(true);
  const [roomId, setRoomId] = useState(0);
  const [chatContent, setChatContent] = useState([{ name: 'dd', content: 'dd' }]);
  const [playerList, setPlayerList] = useState([]);
  // const [playerList, setPlayerList] = useState([]);
  const initSocket = async () => {
    if (!socket) {
      const funcs = { setChatContent, setPlayerList };
      setSocket(new ClientSocketWrapper(funcs));
    }
  };

  const login = async () => {
    await initSocket();
    // setUserName(await socket.request(ClientRequests.GetPlayerName));
    // setPlayerList(await socket.request(ClientRequests.GetPlayerList));
    setUserName('');
    setIsNotLogin(false);
  };

  const enterRoom = (id) => {
    setRoomId(id);
    setNotIsEnterRoom(false);
    setChatContent([]);
  };

  const leaveRoom = () => {
    setRoomId(0);
    setNotIsEnterRoom(true);
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
          enterRoom={enterRoom}
          socket={socket}
        />
      );
    }
    return (
      <RoomPage
        userName={userName}
        roomId={roomId}
        leaveRoom={leaveRoom}
        chatContent={chatContent}
      />
    );
  };

  return (
    <ThemeProvider theme={theme}>
      {returnPage()}
    </ThemeProvider>
  );
}

export default App;
