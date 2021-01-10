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

function ShowPlayerList({ playerList }) {
  const classes = useStyles();
  return (
    <List className={classes.root}>
      { playerList.map((player) => (
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

ShowPlayerList.propTypes = {
  playerList: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default ShowPlayerList;
