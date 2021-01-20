import React, { useEffect, useRef } from 'react';
import { PropTypes } from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    height: '100%',
    overflow: 'auto',
    padding: '5px 12px',
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

function ShowChat({ chatContent }) {
  const classes = useStyles();
  const chatContentRef = useRef(<></>);

  useEffect(() => {
    chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
  }, [chatContent]);

  return (
    <div className={classes.root} ref={chatContentRef}>
      { chatContent.map(({ name, msg }, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index} className={classes.body}>
          <Typography variant="body2" align="left">
            {name}: {msg}
          </Typography>
        </div>
      ))}
    </div>
  );
}

ShowChat.propTypes = {
  chatContent: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default ShowChat;
