import React, { useState } from "react";
import { Button, TextField, Grid, InputAdornment, IconButton, Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import axios from 'axios';
import { useAuth } from "../../../context/auth";
import styles from './register.module.scss'
import { Redirect } from "react-router-dom";
import { RESPONSE } from '../../../consts';

export function Register(props) {
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [serverWarning, setServerWarning] = useState("");
  const [serverWarningCode, setServerWarningCode] = useState("");
  const { setAuthTokens, authTokens } = useAuth();

  if (authTokens) {
    return <Redirect to='/dashboard' />;
  }

  function postRegister() {
    if(valid()){
      axios.post("api/auth/register", {
        email,
        username,
        name,
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
    } else {
      setInvalid(true);
      setServerWarning('Заполните корректно все поля');
      setServerWarningCode('');
    }
  }

  function valid() {
    return !!email && !!username && !!name && !!password && !!confirmPass && 
      validateEmail(email) && validateUsername(username) && validateName(name) && password.length >= 8 && password === confirmPass
  }

  function validateEmail(val) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(val);
  }

  function validateUsername(val) {
    const re = /^[a-zA-Z0-9]*$/;
    return re.test(val);
  }

  function validateName(val) {
    const re = /^[a-zA-Zа-яA-ЯёЁ ]+$/;
    return re.test(val);
  }

  function closeWarning() {
    setInvalid(false)
  }

  return (
    <div className={styles.registerBlock}>
      <Grid item>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <TextField
              error={!!email && !validateEmail(email)}
              type="email"
              label="Email"
              fullWidth
              name="email"
              placeholder="your@email.com"
              variant="outlined"
              value={email}
              required
              autoFocus
              autoComplete="email"
              helperText={!!email && !validateEmail(email) ? "Некорректный email":""}
              onChange={e => {
                setEmail(e.target.value);
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              error={!!username && !validateUsername(username)}
              type="text"
              label="ID пользователя"
              fullWidth
              name="username"
              placeholder="coo1Username"
              variant="outlined"
              value={username}
              required
              autoComplete="username"
              helperText={!!username && !validateUsername(username) ? "ID пользователя может состоять только из латиницы или цифр":""}
              onChange={e => {
                setUserName(e.target.value);
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              error={!!name && !validateName(name)}
              type="text"
              label="Имя пользователя"
              fullWidth
              placeholder="Иванов Иван"
              name="name"
              variant="outlined"
              value={name}
              required
              autoComplete="name"
              onChange={e => {
                setName(e.target.value);
              }}
              helperText={!!name && !validateName(name) ? "Имя пользователя может состоять только из букв":""}
            />
          </Grid>
          <Grid item>
            <TextField
              error={!!password && password.length < 8}
              type={showPassword ? "text" : "password"}
              placeholder="Введите пароль"
              label="Пароль"
              fullWidth
              name="password"
              variant="outlined"
              value={password}
              helperText={!!password && password.length < 8 ? "Длина пароля меньше 8 символов":""}
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
            <TextField
              error={!!confirmPass && password !== confirmPass}
              type={showPassword ? "text" : "password"}
              placeholder="Подтвердите пароль"
              label="Подтверждение пароля"
              fullWidth
              name="password"
              variant="outlined"
              value={confirmPass}
              onChange={e => {
                setConfirmPass(e.target.value);
              }}
              helperText={!!confirmPass && password !== confirmPass ? "Пароли не совпадают":""}
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
              onClick={postRegister}
            >
              Зарегистрироваться
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Snackbar open={invalid} onClose={closeWarning} anchorOrigin={{ vertical: "top", horizontal: "right" }} >
        <MuiAlert onClose={closeWarning} severity={serverWarningCode[0] === '5' ? "error" : "warning"}>{`Ой.. ${serverWarning || 'Ошибочка вышла.'}`}</MuiAlert>
      </Snackbar>
    </div>
  );
}
export default Register;