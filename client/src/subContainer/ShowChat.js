import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
}));

function ShowChat({ roomID }) {
  const classes = useStyles();
  const [chatContent, setChatContent] = useState([]);

  useEffect(() => {
    setChatContent([roomID]);
  }, []);

  return (
    <List className={classes.root}>
      { chatContent.map((player) => (
        <ListItem
          key={player}
        >
          <ListItemText>
            {player}
          </ListItemText>
        </ListItem>
      ))}
    </List>
  );
}

ShowChat.propTypes = {
  roomID: PropTypes.number.isRequired,
};

export default ShowChat;
