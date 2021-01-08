import React, { useState } from 'react';
import { PropTypes } from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
  },
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 200,
  },
}));

function ChooseTimeDialog({ openDialog, setOpenDialog, enterRoom }) {
  const classes = useStyles();
  const [SDtime, setSDtimee] = useState(10);

  const cancelClick = () => {
    setOpenDialog(false);
  };
  const continueClick = () => {
    setOpenDialog(false);
    // send SDtime to server
    enterRoom(123);
  };

  const handleMaxWidthChange = (event) => {
    setSDtimee(event.target.value);
  };

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={cancelClick}
        aria-labelledby="dialog"
      >
        <DialogTitle id="dialog">Please Choose the Sudden death Time</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The sudden death time means that each player is assigned a
            fixed amount of time for the whole game.
            If a player&#39;s time expires, they lose the game.
          </DialogContentText>
          <form className={classes.form} noValidate>
            <FormControl className={classes.formControl}>
              <InputLabel>Sudden Death Time</InputLabel>
              <Select
                autoFocus
                value={SDtime}
                onChange={handleMaxWidthChange}
                inputProps={{
                  name: 'Sudden Death Time',
                  id: 'Sudden Death Time',
                }}
              >
                <MenuItem value="5">5 min</MenuItem>
                <MenuItem value="10">10 min</MenuItem>
                <MenuItem value="15">15 min</MenuItem>
                <MenuItem value="20">20 min</MenuItem>
              </Select>
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
  enterRoom: PropTypes.func.isRequired,

};

export default ChooseTimeDialog;
