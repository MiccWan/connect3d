import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import ShowRoomList from '../component/ShowRoomList.js';
import ShowPlayerList from '../component/ShowPlayerList.js';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  listPaper: {
    background: theme.palette.background.paper,
  },
  chooseBar: {
    height: theme.spacing(5),
    margin: theme.spacing(2, 0, 0)
  },

}));

function LobbyPage({ userName }) {
  const classes = useStyles();
  const [roomList, setRoomList] = useState([]);
  const [playerList, setPlayerList] = useState([]);
  const [tempRoomId, setTempRoomId] = useState('');

  useEffect(() => {
    setRoomList(['ss', 'tt']);
    setPlayerList(['ss', 'tt']);
  }, []);

  const selectRoom = (roomId) => {
    const a = roomId;
    return a;
  };

  const createRoomClick = (e) => {
    const a = e;
    return a;
  };

  const tempRoomIdChange = (event) => {
    setTempRoomId(event.target.value);
  };

  return (
    <Container className={classes.paper} margins="100px">
      <Grid container spacing={5} justify="center">
        <Grid item xs={2} justify="center">
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.chooseBar}
            onClick={createRoomClick}
          >
            create Room
          </Button>
        </Grid>
        <Grid item xs={2} justify="center">
          <TextField
            variant="outlined"
            margin="none"
            size="small"
            fullWidth
            id="tempRoomId"
            label="Join room"
            name="Join room"
            className={classes.chooseBar}
            value={tempRoomId}
            onChange={tempRoomIdChange}
          />
        </Grid>
        <Grid item xs={7}>
          {null}
        </Grid>
        <Grid item xs={1} alignItems="center">
          <Avatar className={classes.chooseBar}>
            {userName}
          </Avatar>
        </Grid>
        <Grid item xs={12} sm={8}>
          <div className={classes.listPaper}>
            <ShowRoomList roomList={roomList} selectRoom={selectRoom} />
          </div>
        </Grid>
        <Grid item xs={0} sm={4}>
          <div className={classes.listPaper}>
            <ShowPlayerList playerList={playerList} />
          </div>
        </Grid>
      </Grid>
    </Container>
  );
}

LobbyPage.propTypes = {
  userName: PropTypes.string.isRequired
};

export default LobbyPage;
