/* eslint-disable react/forbid-prop-types */
import React, { useState, useContext } from 'react';
import { PropTypes } from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import DeleteIcon from '@material-ui/icons/Delete';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Typography from '@material-ui/core/Typography';

import { ClientEvents } from 'knect-common/src/SocketEvents.js';

import ShowRoomList from '../component/ShowRoomList.js';
import ShowPlayerList from '../component/ShowPlayerList.js';
import ShowChat from '../subContainer/ShowChat.js';
import CreateRoomDialog from '../subContainer/CreateRoomDialog.js';
import SocketContext from '../socket/SocketContext.js';

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

function LobbyPage({ userName, createRoom, joinRoom, chatContent, playerList, roomList, logout }) {
  const classes = useStyles();
  const socket = useContext(SocketContext);
  const [roomFilter, setRoomFilter] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const selectRoomClick = async (roomId) => {
    joinRoom(roomId);
  };

  const deleteRoomFilterClick = () => {
    setRoomFilter('');
  };

  const logoutClick = () => {
    logout();
  };

  const createRoomClick = () => {
    setOpenDialog(true);
  };

  const roomFilterChange = (event) => {
    setRoomFilter(event.target.value);
  };

  const chatInputChange = (event) => {
    setChatInput(event.target.value);
  };

  const chatInputEnter = () => {
    if (chatInput !== '') {
      socket.emit(ClientEvents.SendChat, { msg: chatInput });
      setChatInput('');
    }
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
            id="roomfilter"
            label="Find Room"
            placeholder="room's name"
            autoComplete="off"
            className={classes.chooseBar}
            value={roomFilter}
            onChange={roomFilterChange}
            InputProps={{
              endAdornment: (
                (roomFilter !== '')
                && (
                  <InputAdornment position="end">
                    <IconButton edge="end" size="small" onClick={deleteRoomFilterClick} visibility="hidden">
                      <DeleteIcon color="primary" />
                    </IconButton>
                  </InputAdornment>
                )
              ),
            }}
          />
        </Grid>
        <Grid item xs={4}>
          {null}
        </Grid>
        <Grid item xs={4} container justify="flex-end" alignItems="center">
          <Box mx={2}>
            <Typography>{`Hi! ${userName}`}</Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            className={classes.chooseBar}
            onClick={logoutClick}
            endIcon={<ExitToAppIcon />}
          >
            logout
          </Button>
        </Grid>
        <Grid item xs={8} sm={8}>
          <div className={classes.roomList}>
            <ShowRoomList
              roomList={roomList}
              selectRoom={selectRoomClick}
              roomFilter={roomFilter}
            />
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
                <ShowChat chatContent={chatContent} />
              </div>
              <div className={classes.chatInput}>
                <TextField
                  variant="standard"
                  margin="none"
                  size="small"
                  autoComplete="off"
                  fullWidth
                  id="chatInput"
                  name="chatInput"
                  placeholder="say something"
                  value={chatInput}
                  onChange={chatInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      chatInputEnter();
                    }
                  }}
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
      <CreateRoomDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        createRoom={createRoom}
      />
    </Container>
  );
}

LobbyPage.propTypes = {
  playerList: PropTypes.arrayOf(PropTypes.object).isRequired,
  userName: PropTypes.string.isRequired,
  createRoom: PropTypes.func.isRequired,
  joinRoom: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  chatContent: PropTypes.arrayOf(PropTypes.object).isRequired,
  roomList: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default LobbyPage;
