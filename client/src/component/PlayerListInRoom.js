/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { PropTypes } from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import PlayerSideType from 'knect-common/src/PlayerSideType.js';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    overflow: 'auto',
    padding: '10px 20px',
    '&::-webkit-scrollbar': {
      width: '0.4em'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,0.1)',
    }
  },
  body: {
    margin: '1px 0px',
    width: '100%'
  },
  playerTwo: {
    color: theme.palette.player.two,
  },
  playerOne: {
    color: theme.palette.player.one,
  },
  playerOther: {
    color: theme.palette.text.primary,
  },
}));

function PlayerListInRoom({ playerList, gamers }) {
  const classes = useStyles();
  console.log(gamers);
  const playerSideList = playerList.map(({ name }) => {
    if (name === gamers[PlayerSideType.A]?.name) return [name, classes.playerOne];
    if (name === gamers[PlayerSideType.B]?.name) return [name, classes.playerTwo];
    return [name, classes.playerOther];
  });
  return (
    <div className={classes.root}>
      { playerSideList.map(([name, classesOf]) => (
        <div key={name} className={classes.body}>
          <Typography variant="body1" align="left">
            <span className={classesOf}>●&nbsp;&nbsp;</span> {name}
          </Typography>
        </div>
      ))}
    </div>
  );
}

PlayerListInRoom.propTypes = {
  playerList: PropTypes.arrayOf(PropTypes.object).isRequired,
  gamers: PropTypes.object.isRequired,
};

export default PlayerListInRoom;
