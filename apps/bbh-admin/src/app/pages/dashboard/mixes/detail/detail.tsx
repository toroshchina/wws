import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Paper, Select, Snackbar, TextField, Typography } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import MuiAlert from '@material-ui/lab/Alert';
import { RESPONSE } from 'apps/bbh-admin/src/app/consts';
import { useAuth } from 'apps/bbh-admin/src/app/context/auth';
import axios from 'axios';
import React, { ReactText, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './detail.module.scss';

/* eslint-disable-next-line */
export interface DetailProps { }


export function Detail(props) {
  const { authTokens } = useAuth();
  const [ user, setUser ] = useState({} as any);
  const [ currentUser, setCurrentUser ] = useState({} as any);
  const [ avatar, setAvatar ] = useState('');
  const [ name, setName ] = useState('');
  const [ username, setUsername ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ role, setRole ] = useState('');
  const [ disabled, setDisabled ] = useState(true);

  const [ openChangePass, setOpenChangePass ] = useState(false);
  const [ password, setPassword ] = useState('');
  const [ confirmPass, setConfirmPass ] = useState('');
  const [ showPassword, setShowPassword ] = useState(false);

  const [invalid, setInvalid] = useState(false);
  const [serverWarning, setServerWarning] = useState("");
  const [serverWarningCode, setServerWarningCode] = useState("");

  const roles = [
    {value: 'DEFAULT', label: 'Пользователь' },
    {value: 'MODERATOR', label: 'Модератор' },
    {value: 'ADMIN', label: 'Администратор' }
  ];

  function closeWarning() {
    setInvalid(false)
  }

  function handleClickOpen() {
    setOpenChangePass(true);
  }

  function handleClose() {
    setOpenChangePass(false);
  }

  function changeAvatar(val) {
    const obj = Object.assign({}, user);
    obj.avatar = val;
    setAvatar(val);
    setUser(obj)
  }

  function changeName(val) {
    const obj = Object.assign({}, user);
    obj.name = val;
    setName(val);
    setUser(obj)
  }

  function changeEmail(val) {
    const obj = Object.assign({}, user);
    obj.email = val;
    setEmail(val);
    setUser(obj)
  }

  function changeRole(val) {
    const obj = Object.assign({}, user);
    obj.roles = [val];
    setRole(val);
    setUser(obj)
  }

  function getUser() {
    axios.get(`api/user/${props.match.params.userId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authTokens.accessToken}`
        }
      }
    ).then(result => {
      if (result.status === 200) {
        setCurrentUser(result.data);
        setUser(result.data);
        setAvatar(result.data.avatar);
        setName(result.data.name);
        setUsername(result.data.username);
        setEmail(result.data.email);
        setRole(result.data.roles[0]);
      }
    }).catch(e => {
      setInvalid(true);
      setServerWarningCode(`${e.response.status}`);
      setServerWarning(RESPONSE[`${e.response.status}`]);
    });
  }

  function saveUser() {
    axios.patch(`api/user/${username}`, { email, username, name, avatar, roles: [role] },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authTokens.accessToken}`
        }
      }
    ).then(result => {
      if (result.status === 200) {
        const obj = Object.assign({}, user);
        setCurrentUser(obj);
        setDisabled(true);
      }
    }).catch(e => {
      setInvalid(true);
      setServerWarningCode(`${e.response.status}`);
      setServerWarning(RESPONSE[`${e.response.status}`]);
    });
  }

  function changePass() {
    if(password.length >= 8 && password === confirmPass) {
      axios.patch(`api/user/${username}/password`, { username, password },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens.accessToken}`
          }
        }
      ).then(result => {
        if (result.status === 200) {
          handleClose();
          setPassword('');
          setConfirmPass('');
        }
      }).catch(e => {
        setInvalid(true);
        setServerWarningCode(`${e.response.status}`);
        setServerWarning(RESPONSE.password[`${e.response.status}`]);
      });
    } else {
      return;
    }
  }

  function isDisable() {
    const current = JSON.stringify(currentUser);
    const val = JSON.stringify(user);
    setDisabled(current === val);
  }
  
  useEffect(() => {
    getUser()
  }, [])
  
  useEffect(() => {
    isDisable()
  }, [user])

  return (
    <div>
      <Paper className={styles.paperBlock}>
        <Grid container className={styles.gridBlock}>
          <Grid item xs={1} className={styles.leftBlock}>
            <Button variant="contained" color="primary" component={Link} to="/dashboard/users">Назад</Button>
          </Grid>
          <Grid item xs={11} className={styles.rightBlock}>
            <Typography align="right">
            <Button variant="contained" color="primary" onClick={handleClickOpen} className={styles.rightButton}>Изменить пароль</Button>
              <Button variant="contained" color="primary" onClick={saveUser} disabled={disabled}>Сохранить</Button>
            </Typography>
          </Grid>
        </Grid>
        <Grid container className={styles.gridBlock}>
          <Grid item xs={12} sm={5} md={3} lg={2} className={styles.leftBlock}>
            <Avatar src={avatar} className={styles.avatarBlock} />
          </Grid>
          <Grid item xs={12} sm={7} md={9} lg={10} className={styles.rightBlock}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <TextField
                  type="text"
                  label="Имя пользователя"
                  fullWidth
                  name="name"
                  variant="outlined"
                  value={name}
                  onChange={e => {
                    changeName(e.target.value);
                  }}
                />
              </Grid>
              <Grid item>
                <TextField
                  type="text"
                  label="Email"
                  fullWidth
                  name="email"
                  variant="outlined"
                  value={email}
                  onChange={e => {
                    changeEmail(e.target.value);
                  }}
                />
              </Grid>
              <Grid item>
                <TextField
                  type="text"
                  label="Ссылка на аватар"
                  fullWidth
                  name="avatar"
                  variant="outlined"
                  value={avatar}
                  onChange={e => {
                    changeAvatar(e.target.value);
                  }}
                />
              </Grid>
              <Grid item>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="demo-simple-select-outlined-label">Роль</InputLabel>
                  <Select
                    fullWidth
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={role}
                    onChange={e => {
                      changeRole(e.target.value);
                    }}
                    label="Age"
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.value as ReactText} value={role.value}>{role.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      <Dialog open={openChangePass} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Изменение пароля</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Длина пароля должна быть не менее 8 символов
          </DialogContentText>
          <Grid container direction="column" spacing={2}>
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
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose} color="primary">
            Закрыть
          </Button>
          <Button variant="contained" onClick={changePass} color="primary">
            Изменить
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={invalid} onClose={closeWarning} anchorOrigin={{ vertical: "top", horizontal: "right" }} >
        <MuiAlert onClose={closeWarning} severity={serverWarningCode[0] === '5' ? "error" : "warning"}>{`Ой.. ${serverWarning || 'Ошибочка вышла.'}`}</MuiAlert>
      </Snackbar>
    </div>
  );
}

export default Detail;
