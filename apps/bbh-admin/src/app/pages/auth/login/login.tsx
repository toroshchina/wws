import React, { useState } from "react";
import { Button, TextField, Grid, InputAdornment, IconButton, Snackbar} from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { Redirect } from "react-router-dom";
import axios from 'axios';
import { useAuth } from "../../../context/auth";
import styles from './login.module.scss'
import { RESPONSE } from "../../../consts";

export function Login(props) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [serverWarning, setServerWarning] = useState("");
  const [serverWarningCode, setServerWarningCode] = useState("");
  const { setAuthTokens, authTokens } = useAuth();

  const referer = props.location.state?.referer || '/dashboard';

  function postLogin() {
    axios.post("api/auth/login", {
      username,
      password
    }).then(result => {
      if (result.status === 201) {
        setAuthTokens(result.data);
      }
    }).catch(e => {
      setInvalid(true);
      setServerWarningCode(`${e.response.status}`);
      setServerWarning(RESPONSE[`${e.response.status}`])
    });
  }

  if (authTokens) {
    return <Redirect to={referer} />;
  }

  function closeWarning() {
    setInvalid(false)
  }

  return (
    <div className={styles.loginBlock} >
      <Grid item>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <TextField
              type="text"
              label="ID пользователя"
              fullWidth
              name="username"
              variant="outlined"
              value={username}
              required
              autoFocus
              onChange={e => {
                setUserName(e.target.value);
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              type={showPassword ? "text" : "password"}
              label="Пароль"
              fullWidth
              name="password"
              variant="outlined"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
              }}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              className={styles.buttonBlock}
              onClick={postLogin}
            >
              Войти
            </Button>
          </Grid>
        </Grid>
      </Grid>
      {/* <Grid item>
        <Link href="#" variant="body2">
          Forgot Password?
        </Link>
      </Grid> */}
      
      <Snackbar open={invalid} onClose={closeWarning} anchorOrigin={{ vertical: "top", horizontal: "right" }} >
        <MuiAlert onClose={closeWarning} severity={serverWarningCode[0] === '5' ? "error" : "warning"}>{`Ой.. ${serverWarning || 'Ошибочка вышла.'}`}</MuiAlert>
      </Snackbar>
    </div>
  );
}
export default Login;