import React, { useState } from 'react';
import { PropTypes } from 'prop-types';

import Grid from '@material-ui/core/Grid';

function LobbyPage({ userName }) {
  const [roomList, setRoomList] = useState([]);
  const [playerList, setPlayerList] = useState([]);
  return (
    <p>{userName}</p>
  );
}

LobbyPage.propTypes = {
  userName: PropTypes.string.isRequired
};

export default LobbyPage;
