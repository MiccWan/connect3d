import React from 'react';
import { PropTypes } from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(() => ({
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
  }
}));

function ShowPlayerList({ playerList }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      { playerList.map((name) => (
        <div key={name} className={classes.body}>
          <Typography variant="body1" align="left">
            {name}
          </Typography>
        </div>
      ))}
    </div>
  );
}

ShowPlayerList.propTypes = {
  playerList: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default ShowPlayerList;
