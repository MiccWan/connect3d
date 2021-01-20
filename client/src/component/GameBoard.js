import React, { useState, useRef } from 'react';
import { PropTypes } from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Bingo from '../game/Bingo.js';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    height: '100%',
  },
}));

function GameBoard({ role, turn, lastPiece, board }) {
  const classes = useStyles();
  const canvas = useRef();
  const [bingo, setBingo] = useState(new Bingo());
  bingo.setState(role, turn, lastPiece, board);
  return (
    <div className={classes.root}>
      <canvas ref={canvas} />
    </div>
  );
}

GameBoard.propTypes = {
  role: PropTypes.number.isRequired,
  turn: PropTypes.number.isRequired,
  lastPiece: PropTypes.number.isRequired,
  board: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default GameBoard;
