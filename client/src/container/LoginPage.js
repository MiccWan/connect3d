import React, { useState } from 'react';
import { PropTypes } from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
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
import iconing from '../img/loginIcon.png';

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
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  submit: {
    margin: theme.spacing(2, 0, 2),
  },
}));

function LoginPage({ login, loginAsGuest }) {
  const classes = useStyles();

  const [tempUserName, setTempUserName] = useState('');
  const [userNameIsEmpty, setUserNameIsEmpty] = useState(false);
  const tempUserNameChange = (event) => {
    setTempUserName(event.target.value);
    setUserNameIsEmpty(false);
  };

  const loginClick = () => {
    if (tempUserName === '') {
      setUserNameIsEmpty(true);
    }
    else {
      login(tempUserName);
    }
  };

  const loginGuestClick = async () => {
    await loginAsGuest();
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar} src={iconing} />
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
          autoComplete="off"
          autoFocus
          value={tempUserName}
          onChange={tempUserNameChange}
          error={userNameIsEmpty}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              loginClick();
            }
          }}
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
  login: PropTypes.func.isRequired,
  loginAsGuest: PropTypes.func.isRequired,
};

export default LoginPage;
