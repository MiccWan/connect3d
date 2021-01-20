import React, { useState } from 'react';
import { PropTypes } from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
  },
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 300,
  },
}));

function ChooseTimeDialog({ openDialog, setOpenDialog, createRoom }) {
  const classes = useStyles();
  const [roomName, setRoomName] = useState('');

  const cancelClick = () => {
    setOpenDialog(false);
  };
  const continueClick = async () => {
    if (roomName === '') {
      return;
    }
    setOpenDialog(false);
    createRoom(roomName);
  };

  const roomNameChange = (event) => {
    setRoomName('');
    setRoomName(event.target.value);
  };

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={cancelClick}
        aria-labelledby="dialog"
      >
        <DialogTitle id="dialog">Please Enter Room Name</DialogTitle>
        <DialogContent>
          <form className={classes.form} noValidate>
            <FormControl className={classes.formControl}>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="room name"
                fullWidth
                required
                autoComplete="off"
                value={roomName}
                onChange={roomNameChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    continueClick();
                  }
                }}
              />
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelClick} color="primary">
            cancel
          </Button>
          <Button onClick={continueClick} color="primary">
            continue
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

ChooseTimeDialog.propTypes = {
  openDialog: PropTypes.bool.isRequired,
  setOpenDialog: PropTypes.func.isRequired,
  createRoom: PropTypes.func.isRequired,

};

export default ChooseTimeDialog;
