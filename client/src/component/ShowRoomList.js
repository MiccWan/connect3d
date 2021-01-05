import React from 'react';
import { PropTypes } from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
  },
  head: {
    backgroundColor: theme.palette.background.paper,
    borderBlockColor: theme.palette.primary.main,
    borderWidth: '2px',
  },
  cell: {
    borderBlockColor: theme.palette.primary.main,
    borderWidth: '1px',
  },
}));

function ShowRoomList({ roomList, selectRoom }) {
  const classes = useStyles();
  return (
    <TableContainer className={classes.root}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="justify" className={classes.head}>Room ID</TableCell>
            <TableCell align="justify" className={classes.head}>Time Rule</TableCell>
            <TableCell align="justify" className={classes.head}>Status</TableCell>
            <TableCell align="justify" className={classes.head}>Players</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {roomList.map((room) => (
            <TableRow
              key={room.id}
              onClick={() => selectRoom(room.id)}
              hover
            >
              <TableCell align="justify" className={classes.cell}>{room.id}</TableCell>
              <TableCell align="justify" className={classes.cell}>{room.timeRule}</TableCell>
              <TableCell align="justify" className={classes.cell}>{room.status}</TableCell>
              <TableCell align="justify" className={classes.cell}>{room.players}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

ShowRoomList.propTypes = {
  roomList: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectRoom: PropTypes.func.isRequired
};

export default ShowRoomList;
