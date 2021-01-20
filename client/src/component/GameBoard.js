import React, { useState, useRef, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { PropTypes } from 'prop-types';
import newLogger from 'knect-common/src/Logger.js';
import SocketContext from '../socket/SocketContext.js';
import Bingo from '../game/Bingo.js';

const log = newLogger('GameBoard');

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    height: '100%',
  },
}));

function GameBoard({ gameState }) {
  const socket = useContext(SocketContext);
  const classes = useStyles();
  const elRef = useRef();
  const [bingo, setBingo] = useState();
  log.info('bingo =', bingo);

  useEffect(() => {
    bingo?.setState(gameState);
  }, [bingo, gameState]);

  useEffect(() => {
    let _bingo = bingo;
    if (!_bingo) {
      _bingo = new Bingo(socket, elRef);
      _bingo.onDidMount();
      setBingo(_bingo);
    }

    return () => {
      _bingo.onWillUnmount();
    };
  }, []);

  return (
    <div ref={elRef} className={classes.root} />
  );
}

GameBoard.propTypes = {
  gameState: PropTypes.object.isRequired
};

export default GameBoard;
