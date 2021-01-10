import React from 'react';
import { PropTypes } from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
}));

function ShowChat({ chatContent }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      { chatContent.map(({ name, msg }, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Typography variant="body1" align="left" noWrap key={index}>
          {name}: {msg}
        </Typography>
      ))}
    </div>
  );
}

ShowChat.propTypes = {
  chatContent: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default ShowChat;
