import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
}));

function ShowChat({ roomId }) {
  const classes = useStyles();
  const [chatContent, setChatContent] = useState([]);

  useEffect(() => {
    setChatContent(roomId);
    setChatContent([{ name: 'ddd', content: 'ddd' }]);
  }, []);

  return (
    <div className={classes.root}>
      { chatContent.map(({ name, content }, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Typography variant="body1" align="left" noWrap key={name + index}>
          {name}: {content}
        </Typography>
      ))}
    </div>
  );
}

ShowChat.propTypes = {
  roomId: PropTypes.number.isRequired,
};

export default ShowChat;
