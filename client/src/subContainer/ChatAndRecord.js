/* eslint-disable react/forbid-prop-types */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import ShowChat from './ShowChat.js';
import PlayerListInRoom from '../component/PlayerListInRoom.js';
import Record from '../component/Record.js';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    padding: '0',
  },
  bar: {
    height: theme.spacing(4.5),
    minHeight: 'auto',
    minWidth: 'auto',
    padding: theme.spacing(0, 0, 0, 0),
  },
  fullheight: {
    height: '100%',
  },
  chatPanel: {
    height: theme.spacing(23.5),
  }
}));

function TabPanel({ children, value, index }) {
  const classes = useStyles();
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      className={classes.fullheight}
    >
      {(value === index)
        && (children)}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function ChatAndRecord({ setIsChatMode, roomId, chatContent, playerList, gameState }) {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (value === 0) {
      setIsChatMode(true);
    }
    else {
      setIsChatMode(false);
    }
  }, [value]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="transparent">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          variant="fullWidth"
          className={classes.bar}
        >
          <Tab
            label="chatroom"
            id="full-width-tab-0"
            aria-controls="full-width-tabpanel-0"
            className={classes.bar}
            size="small"
          />
          <Tab
            label="Record"
            id="full-width-tab-1"
            aria-controls="full-width-tabpanel-1"
            className={classes.bar}
          />
          <Tab
            label="Players"
            id="full-width-tab-2"
            aria-controls="full-width-tabpanel-2"
            className={classes.bar}
          />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <div className={classes.chatPanel}>
          <ShowChat roomId={roomId} chatContent={chatContent} />
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Record recordContent={gameState.record || []} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <PlayerListInRoom playerList={playerList} />
      </TabPanel>
    </div>
  );
}

ChatAndRecord.propTypes = {
  setIsChatMode: PropTypes.func.isRequired,
  roomId: PropTypes.string.isRequired,
  chatContent: PropTypes.arrayOf(PropTypes.object).isRequired,
  playerList: PropTypes.arrayOf(PropTypes.object).isRequired,
  gameState: PropTypes.object.isRequired,
};

export default ChatAndRecord;
