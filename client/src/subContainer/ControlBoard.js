import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

import PlayerSideType from 'knect-common/src/PlayerSideType.js';
import { ClientEvents } from 'knect-common/src/SocketEvents.js';
import personimg from '../img/person2.png';
import SocketContext from '../socket/SocketContext.js';

const useStyles = makeStyles((theme) => ({
  infoBar: {
    width: '100%',
    height: '15%',
    padding: theme.spacing(1, 1, 1, 3),
  },
  quitButton: {
    minWidth: '0',
    padding: theme.spacing(0.5, 1.5),
  },
  playerBar: {
    width: '100%',
    height: '85%',
    padding: theme.spacing(1),
  },
  player2img: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.player.two,
    backgroundSize: '60% 72%',
    backgroundImage: `url(${personimg})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'bottom center',
    borderRadius: '5%',
    padding: '0',
  },
  player1img: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.player.one,
    backgroundSize: '60% 72%',
    backgroundImage: `url(${personimg})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'bottom center',
    borderRadius: '5%',
    flexDirection: 'column',
  },
  playerButtonOuter: {
    width: '50%',
    height: '100%',
    padding: theme.spacing(2),
  },
  playerButtonInner1: {
    height: theme.spacing(6),
    width: '25%',
    padding: theme.spacing(1, 0, 0, 0),
  },
  playerButtonInner2: {
    height: theme.spacing(11),
    width: '100%',
    color: 'white',
  },
  playerButtonInner3: {
    height: theme.spacing(4),
    width: '100%',
    maxWidth: '100%',
    margin: theme.spacing(0, 2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: '5px 5px 0px 0px',
  },
  playerButtonInner4: {
    height: theme.spacing(5.7),
    width: '25%',
    padding: theme.spacing(1, 0, 0, 0),
  },
  playerName: {
    position: 'relative',
    bottom: '-3px',
  }
}));

function ControlBoard({ userName, roomInfo, leaveRoom, gamers }) {
  const classes = useStyles();
  const socket = useContext(SocketContext);

  const player1Name = gamers[PlayerSideType.A]?.name;
  const player2Name = gamers[PlayerSideType.B]?.name;

  const playerButtonClick = (index) => {
    if (index === 1) {
      socket.emit(ClientEvents.JoinGame, { side: PlayerSideType.A });
    }
    if (index === 2) {
      socket.emit(ClientEvents.JoinGame, { side: PlayerSideType.B });
    }
  };

  const exitClick = (index) => {
    if (index === 1) {
      socket.emit(ClientEvents.LeaveGame);
    }
    else if (index === 2) {
      socket.emit(ClientEvents.LeaveGame);
    }
  };

  const quitButtonClick = () => {
    leaveRoom();
  };

  const playerButton = (index, playerName) => {
    if (playerName === userName) {
      return (
        <div className={classes[`player${index}img`]}>
          <Grid container direction="column" justify="space-between">
            <Grid item container xs={12} justify="flex-end">
              <div className={classes.playerButtonInner4}>
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={() => exitClick(index)}
                >
                  <CloseIcon />
                </IconButton>
              </div>
            </Grid>
            <Grid item container xs={12}>
              <div className={classes.playerButtonInner2} />
            </Grid>
            <Grid item container xs={12} justify="center">
              <div className={classes.playerButtonInner3}>
                <Typography variant="subtitle1" align="center" className={classes.playerName}>
                  {playerName}
                </Typography>
              </div>
            </Grid>
          </Grid>
        </div>
      );
    }
    if (playerName === undefined) {
      return (
        <ButtonBase
          className={classes[`player${index}img`]}
          onClick={() => {
            playerButtonClick(index);
          }}
        >
          <Grid container direction="column" justify="space-between">
            <Grid item container xs={12} justify="flex-end">
              <div className={classes.playerButtonInner1} />
            </Grid>
            <Grid item container xs={12}>
              <Typography variant="h3" align="center" className={classes.playerButtonInner2}>
                ?
              </Typography>
            </Grid>
            <Grid item container xs={12} justify="center">
              <Typography variant="h6" className={classes.playerButtonInner3} align="center">
                waiting...
              </Typography>
            </Grid>
          </Grid>
        </ButtonBase>
      );
    }
    return (
      <div className={classes[`player${index}img`]}>
        <Grid container direction="column" justify="space-between">
          <Grid item container xs={12} justify="flex-end">
            <div className={classes.playerButtonInner4} />
          </Grid>
          <Grid item container xs={12}>
            <div className={classes.playerButtonInner2} />
          </Grid>
          <Grid item container xs={12} justify="center">
            <div className={classes.playerButtonInner3}>
              <Typography variant="subtitle1" align="center" className={classes.playerName}>
                {playerName}
              </Typography>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  };

  return (
    <>
      <Grid container className={classes.infoBar} direction="row" alignItems="center">
        <Grid item container xs={10} justify="flex-start" alignItems="flex-end">
          <Typography variant="body1">
            Room&#39;s Name: {roomInfo.name}
          </Typography>
        </Grid>
        <Grid item container xs={2} justify="flex-end">
          <Button
            variant="contained"
            color="primary"
            size="small"
            className={classes.quitButton}
            onClick={quitButtonClick}
          >
            <ExitToAppIcon />
          </Button>
        </Grid>
      </Grid>
      <Grid
        container
        className={classes.playerBar}
        direction="row"
        alignItems="center"
        justify="space-between"
      >
        <Grid item container xs={6} justify="center" className={classes.playerButtonOuter}>
          {playerButton(1, player1Name)}
        </Grid>
        <Grid item container xs={6} justify="center" className={classes.playerButtonOuter}>
          {playerButton(2, player2Name)}
        </Grid>
      </Grid>
    </>

  );
}

ControlBoard.propTypes = {
  userName: PropTypes.string.isRequired,
  gamers: PropTypes.object.isRequired,
  roomInfo: PropTypes.object.isRequired,
  leaveRoom: PropTypes.func.isRequired,
};

export default ControlBoard;
