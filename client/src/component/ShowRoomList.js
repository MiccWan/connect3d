import React from 'react';
import { PropTypes } from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
  },
  head: {
    backgroundColor: theme.palette.background.paper,
    borderBlockColor: theme.palette.primary.main,
    borderWidth: '2px',
    width: '28%',
  },
  headPlayers: {
    backgroundColor: theme.palette.background.paper,
    borderBlockColor: theme.palette.primary.main,
    borderWidth: '2px',
    width: '44%',
  },
  cell: {
    borderBlockColor: theme.palette.primary.main,
    borderWidth: '1px',
    width: '28%',
  },
  cellPlayers: {
    borderBlockColor: theme.palette.primary.main,
    borderWidth: '1px',
    width: '44%',
  },
}));

function ShowRoomList({ roomList, selectRoom, roomFilter }) {
  const classes = useStyles();
  console.log(roomList);
  const filteredRoomList = roomList.filter(room => room.name.includes(roomFilter));
  return (
    <TableContainer className={classes.root}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="left" className={classes.head}>Room&#39;s Name</TableCell>
            <TableCell align="left" className={classes.head}>Status</TableCell>
            <TableCell align="left" className={classes.headPlayers}>Players</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredRoomList.map((room) => (
            <TableRow
              key={room.id}
              onClick={() => selectRoom(room.id)}
              hover
            >
              <TableCell align="left" className={classes.cell}>{room.name}</TableCell>
              <TableCell align="left" className={classes.cell}>{room.status}</TableCell>
              <TableCell align="left" className={classes.cellPlayers}>
                <Typography>{room.players[1].name}</Typography>
                <Typography>{room.players[2].name}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

ShowRoomList.propTypes = {
  roomList: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectRoom: PropTypes.func.isRequired,
  roomFilter: PropTypes.string.isRequired,
};

export default ShowRoomList;
