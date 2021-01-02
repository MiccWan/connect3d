import React, { useState } from 'react';
import { PropTypes } from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
// import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
// import Box from '@material-ui/core/Box';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: 'inherit'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  submit: {
    margin: theme.spacing(2, 0, 2),
  },
}));

function LoginPage({ login }) {
  const classes = useStyles();

  const [password, setPassword] = useState('');
  const [tempUserName, setTempUserName] = useState('');

  const passwordChange = (event) => {
    setPassword(event.target.value);
  };

  const tempUserNameChange = (event) => {
    setTempUserName(event.target.value);
  };

  const loginClick = () => {
    const msg = [tempUserName, password];
    return msg;
  };

  const loginGuestClick = () => {
    const msg = [tempUserName, password];
    login(tempUserName);
    return msg;
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <p>knect</p>
        </Avatar>
        <Typography component="h1" variant="h5">
          Log in
        </Typography>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="tempUserName"
          label="User Name"
          name="tempUserName"
          autoComplete="tempUserName"
          autoFocus
          value={tempUserName}
          onChange={tempUserNameChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={passwordChange}
        />

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={loginClick}
              disabled
            >
              Login
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={loginGuestClick}
            >
              Login as Guest
            </Button>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
}

LoginPage.propTypes = {
  login: PropTypes.func.isRequired
};

export default LoginPage;
