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

function ShowChat({ roomId }) {
  const classes = useStyles();
  const [chatContent, setChatContent] = useState([]);

  useEffect(() => {
    setChatContent([roomId]);
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
  roomId: PropTypes.number.isRequired,
};

export default ShowChat;
