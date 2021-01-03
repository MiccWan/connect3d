import React from 'react';
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

function ShowRoomList({ roomList, selectRoom }) {
  const classes = useStyles();
  return (
    <List className={classes.root}>
      { roomList.map((room) => (
        <ListItem
          button
          onClick={() => selectRoom(room.id)}
          key={room}
        >
          <ListItemText key="0">
            {room}
          </ListItemText>
        </ListItem>
      ))}
    </List>
  );
}

ShowRoomList.propTypes = {
  roomList: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectRoom: PropTypes.func.isRequired
};

export default ShowRoomList;
