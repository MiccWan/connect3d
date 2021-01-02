import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';

import ShowRoomList from '../component/ShowRoomList.js';
import ShowPlayerList from '../component/ShowPlayerList.js';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

}));

function LobbyPage({ userName }) {
  const classes = useStyles();
  const [roomList, setRoomList] = useState([]);
  const [playerList, setPlayerList] = useState([]);
  useEffect(() => {
    setRoomList(['ss', 'tt']);
    setPlayerList(['ss', 'tt']);
  }, []);

  const selectRoom = (roomId) => {
    const a = roomId;
    return a;
  };

  return (
    <Grid container className={classes.paper} spacing={2}>
      <Grid item xs={11} justify="flex-end">
        <Avatar>
          {userName}
        </Avatar>
      </Grid>
      <Grid item xs={1} justify="flex-end">
        <Avatar>
          {userName}
        </Avatar>
      </Grid>
      <Grid item xs={12} sm={8}>
        <ShowRoomList roomList={roomList} selectRoom={selectRoom} />
      </Grid>
      <Grid item xs={false} sm={4}>
        <ShowPlayerList playerList={playerList} />
      </Grid>
    </Grid>
  );
}

LobbyPage.propTypes = {
  userName: PropTypes.string.isRequired
};

export default LobbyPage;
