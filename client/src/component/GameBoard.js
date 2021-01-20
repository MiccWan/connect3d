import React, { useState, useRef, useEffect } from 'react';
// import { PropTypes } from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Bingo from '../game/Bingo.js';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    height: '100%',
  },
}));

function GameBoard() {
  const classes = useStyles();
  const elRef = useRef();
  const [bingo, setBingo] = useState(null);

  useEffect(() => {
    if (!bingo) {
      const _bingo = new Bingo(elRef);
      _bingo.onDidMount();
      setBingo(_bingo);
    }

    return () => {
      bingo?.onWillUnmount();
    };
  }, []);

  return (
    <div ref={elRef} className={classes.root} />
  );
}

GameBoard.propTypes = {
  // role: PropTypes.number.isRequired,
  // turn: PropTypes.number.isRequired,
  // lastPiece: PropTypes.number.isRequired,
  // board: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default GameBoard;
