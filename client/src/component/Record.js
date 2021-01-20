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

function Record({ recordContent }) {
  const classes = useStyles();
  const contentRef = useRef(<></>);
  useEffect(() => {
    contentRef.current.scrollTop = contentRef.current.scrollHeight;
  }, [recordContent]);

  return (
    <div className={classes.root} ref={contentRef}>
      { recordContent.map(({ x, y, z }, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index} className={classes.body}>
          <Typography variant="body2" align="left">
            {`#${index} (${x}, ${y}, ${z})`}
          </Typography>
        </div>
      ))}
    </div>
  );
}

Record.propTypes = {
  recordContent: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default Record;
