import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import ShowChat from './ShowChat.js';

function TabPanel({ children, value, index }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  bar: {
    height: theme.spacing(4.5),
    minHeight: 'auto',
    minWidth: 'auto',
    padding: theme.spacing(0, 0, 0, 0),
  }
}));

function ChatAndRecord({ setIsChatMode, roomID }) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

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
        <ShowChat roomID={roomID} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item three
      </TabPanel>
    </div>
  );
}

ChatAndRecord.propTypes = {
  setIsChatMode: PropTypes.func.isRequired,
  roomID: PropTypes.number.isRequired,
};

export default ChatAndRecord;
