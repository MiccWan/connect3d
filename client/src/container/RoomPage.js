import React, { useState } from 'react';
import { PropTypes } from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
// import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';

import ChatAndHistory from '../subContainer/ChatAndRecord.js';
import ControlBoard from '../subContainer/ControlBoard.js';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    alignItems: 'center',
    padding: theme.spacing(0, 3),
  },
  gameBoard: {
    background: theme.palette.background.paper,
    height: theme.spacing(65),
  },
  controlBoard: {
    background: theme.palette.background.paper,
    height: theme.spacing(31),
  },

  chatRoom: {
    background: theme.palette.background.paper,
    height: theme.spacing(28),
    width: '100%',
  },
  chatInput: {
    background: theme.palette.background.paper,
    height: theme.spacing(4),
    width: '100%',
    padding: theme.spacing(0, 1),
  },
  chatBoard: {
    background: theme.palette.background.paper,
    height: theme.spacing(32),
    width: '100%',
  }

}));

function roomPage({ userName, roomID, leaveRoom }) {
  const classes = useStyles();

  const [chatInput, setChatInput] = useState('');
  const [isChatMode, setIsChatMode] = useState(true);

  const chatInputChange = (event) => {
    setChatInput(event.target.value);
  };

  const chatInputEnter = () => {
    setChatInput('');
  };

  return (
    <Container className={classes.paper}>
      <Grid container spacing={2} justify="center" direction="row">
        <Grid item xs={9} sm={8}>
          <div className={classes.gameBoard}>
            <canvas>
              {userName}
            </canvas>
          </div>
        </Grid>
        <Grid item container xs={3} sm={4} spacing={2} justify="space-between" direction="row">
          <Grid item xs={12}>
            <div className={classes.controlBoard}>
              <ControlBoard userName={userName} roomID={roomID} leaveRoom={leaveRoom} />
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.chatBoard}>
              <div className={classes.chatRoom}>
                <ChatAndHistory setIsChatMode={setIsChatMode} roomID={roomID} />
              </div>
              <div className={classes.chatInput} hidden={!isChatMode}>
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
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

roomPage.propTypes = {
  userName: PropTypes.string.isRequired,
  roomID: PropTypes.number.isRequired,
  leaveRoom: PropTypes.func.isRequired,
};

export default roomPage;
