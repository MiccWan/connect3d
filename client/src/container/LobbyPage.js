import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import ForwardIcon from '@material-ui/icons/Forward';

import ShowRoomList from '../component/ShowRoomList.js';
import ShowPlayerList from '../component/ShowPlayerList.js';
import ShowChat from '../subContainer/ShowChat.js';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    alignItems: 'center',
    padding: theme.spacing(0, 4),
  },
  roomList: {
    background: theme.palette.background.paper,
    height: theme.spacing(55),
  },
  playerList: {
    background: theme.palette.background.paper,
    height: theme.spacing(27),
  },

  chatRoom: {
    background: theme.palette.background.paper,
    height: theme.spacing(22),
    width: '100%',
  },
  chatInput: {
    background: theme.palette.background.paper,
    height: theme.spacing(4),
    width: '100%',
    padding: theme.spacing(0, 1),
  },
  chooseBar: {
    height: theme.spacing(5),
    margin: theme.spacing(2, 0, 2),
  },

}));

function LobbyPage({ userName, enterRoom, roomID }) {
  const classes = useStyles();
  const [roomList, setRoomList] = useState([]);
  const [playerList, setPlayerList] = useState([]);
  const [tempRoomId, setTempRoomId] = useState('');
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    setRoomList([{ id: 123, timeRule: '15 min', status: 'ing', players: 'dd' }, { id: 124, timeRule: '15 min', status: 'ing', players: 'dd' }, { id: 125, timeRule: '15 min', status: 'ing', players: 'dd' }]);
    setPlayerList(['ss', 'tt']);
  }, []);

  const selectRoomClick = (roomId) => {
    enterRoom(roomId);
  };

  const joinRoomClick = () => {
    enterRoom(tempRoomId);
  };

  const createRoomClick = () => {
    const roomId = 1212;
    enterRoom(roomId);
  };

  const tempRoomIdChange = (event) => {
    setTempRoomId(event.target.value);
  };

  const chatInputChange = (event) => {
    setChatInput(event.target.value);
  };

  const chatInputEnter = () => {
    setChatInput('');
  };

  return (
    <Container className={classes.paper}>
      <Grid container spacing={2} justify="center" direction="row">
        <Grid item xs={2}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.chooseBar}
            onClick={createRoomClick}
          >
            create Room
          </Button>
        </Grid>
        <Grid item xs={2}>
          <TextField
            variant="outlined"
            margin="none"
            size="small"
            fullWidth
            id="tempRoomId"
            label="Join room"
            name="Join room"
            placeholder="room ID"
            className={classes.chooseBar}
            value={tempRoomId}
            onChange={tempRoomIdChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" size="small" onClick={joinRoomClick}>
                    <ForwardIcon color="primary" />
                  </IconButton>
                </InputAdornment>),
            }}
          />
        </Grid>
        <Grid item xs={7}>
          {null}
        </Grid>
        <Grid item xs={1} container justify="flex-end">
          <Avatar className={classes.chooseBar}>
            {userName}
          </Avatar>
        </Grid>
        <Grid item xs={8} sm={8}>
          <div className={classes.roomList}>
            <ShowRoomList roomList={roomList} selectRoom={selectRoomClick} />
          </div>
        </Grid>
        <Grid item xs={4} sm={4}>
          <Grid container spacing={2} justify="space-between" direction="column">
            <Grid item xs={12}>
              <div className={classes.playerList}>
                <ShowPlayerList playerList={playerList} />
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className={classes.chatRoom}>
                <ShowChat roomID={roomID} />
              </div>
              <div className={classes.chatInput}>
                <TextField
                  variant="standard"
                  margin="none"
                  size="small"
                  fullWidth
                  id="chatInput"
                  name="Join room"
                  placeholder="say something"
                  value={chatInput}
                  onChange={chatInputChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton edge="end" size="small" onClick={chatInputEnter}>
                          <SendIcon color="primary" />
                        </IconButton>
                      </InputAdornment>),
                  }}
                />
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

LobbyPage.propTypes = {
  userName: PropTypes.string.isRequired,
  enterRoom: PropTypes.func.isRequired,
  roomID: PropTypes.number.isRequired,
};

export default LobbyPage;
