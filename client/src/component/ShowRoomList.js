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

import PlayerSideType from 'knect-common/src/PlayerSideType.js';

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
    padding: theme.spacing(1, 2),
  },
  cellPlayers: {
    borderBlockColor: theme.palette.primary.main,
    borderWidth: '1px',
    width: '44%',
    padding: theme.spacing(1, 2),
  },
  player1: {
    color: theme.palette.player.one,
  },
  player2: {
    color: theme.palette.player.two,
  },
}));

function ShowRoomList({ roomList, selectRoom, roomFilter }) {
  const classes = useStyles();
  const filteredRoomList = roomList.filter(room => room.name.includes(roomFilter));
  return (
    <TableContainer className={classes.root}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="left" className={classes.head}>Room Name</TableCell>
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
                <div>
                  <Typography variant="inherit">
                    <span className={classes.player1}>●&nbsp;&nbsp;</span>
                    {room.gamers[PlayerSideType.A]?.name}
                    {!(room.gamers[PlayerSideType.A]?.name) && "-"}
                  </Typography>
                </div>
                <div>
                  <Typography variant="inherit">
                    <span className={classes.player2}>●&nbsp;&nbsp;</span>
                    {room.gamers[PlayerSideType.B]?.name}
                    {!(room.gamers[PlayerSideType.B]?.name) && "-"}
                  </Typography>
                </div>
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
