/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Avatar,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import jwt_decode from 'jwt-decode';
import ImageIcon from '@material-ui/icons/Image';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MuiAlert from '@material-ui/lab/Alert';
import { RESPONSE } from '../../../../consts';
import { useAuth } from '../../../../context/auth';
import axios from 'axios';
import React, { ReactText, useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';

import styles from './detail.module.scss';

/* eslint-disable-next-line */
export interface DeatilProps {}

export function Detail(props) {
  const { authTokens } = useAuth();
  const [producer, setProducer] = useState({} as any);
  const [currentProducer, setCurrentProducer] = useState({} as any);
  const [logo, setLogo] = useState('');
  const [name, setName] = useState('');
  const [entityName, setEntityName] = useState('');
  const [inn, setInn] = useState('');
  const [description, setDescription] = useState('');
  const [country, setCountry] = useState('');
  const [openChangePass, setOpenChangePass] = useState(false);
  const user = jwt_decode(authTokens.accessToken) as any;
  const [redirect, setRedirect] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const [invalid, setInvalid] = useState(false);
  const [serverWarning, setServerWarning] = useState('');
  const [serverWarningCode, setServerWarningCode] = useState('');

  function handleClickOpen() {
    setOpenChangePass(true);
  }

  function handleClose() {
    setOpenChangePass(false);
  }

  function closeWarning() {
    setInvalid(false);
  }

  function changeLogo(val) {
    const obj = Object.assign({}, producer);
    obj.logo = val;
    setLogo(val);
    setProducer(obj);
  }

  function changeName(val) {
    const obj = Object.assign({}, producer);
    obj.name = val;
    setName(val);
    setProducer(obj);
  }

  function changeEntityName(val) {
    const obj = Object.assign({}, producer);
    obj.entityName = val;
    setEntityName(val);
    setProducer(obj);
  }

  function changeInn(val) {
    const obj = Object.assign({}, producer);
    obj.inn = val;
    setInn(val);
    setProducer(obj);
  }

  function changeDescription(val) {
    const obj = Object.assign({}, producer);
    obj.description = val;
    setDescription(val);
    setProducer(obj);
  }

  function changeCountry(val) {
    const obj = Object.assign({}, producer);
    obj.country = val;
    setCountry(val);
    setProducer(obj);
  }

  function saveProducer(re) {
    axios
      .patch(
        `api/producer/${props.match.params.producerId}`,
        {
          name,
          entityName,
          inn,
          description,
          logo,
          country,
          usernameUpdate: user.username,
          dateUpdate: new Date().toUTCString(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authTokens.accessToken}`,
          },
        }
      )
      .then((result) => {
        if (result.status === 200) {
          const obj = Object.assign({}, producer);
          setCurrentProducer(obj);
          setDisabled(true);
          setRedirect(re);
        }
      })
      .catch((e) => {
        setInvalid(true);
        setServerWarningCode(`${e.response.status}`);
        setServerWarning(RESPONSE[`${e.response.status}`]);
      });
  }

  function deleteItem() {
    axios
      .delete(`api/producer/${props.match.params.producerId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens.accessToken}`,
        },
      })
      .then((result) => {
        if (result.status === 200) {
          handleClose();
          setRedirect(true);
        }
      })
      .catch((e) => {
        setInvalid(true);
        setServerWarningCode(`${e.response.status}`);
        setServerWarning(RESPONSE[`${e.response.status}`]);
      });
  }

  useEffect(() => {
    let isSubscribed = true;
    axios
      .get(`api/producer/${props.match.params.producerId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens.accessToken}`,
        },
      })
      .then((result) => {
        if (result.status === 200) {
          setCurrentProducer(result.data);
          setProducer(result.data);
          setLogo(result.data.logo);
          setName(result.data.name);
          setEntityName(result.data.entityName);
          setInn(result.data.inn);
          setDescription(result.data.description);
          setCountry(result.data.country);
        }
      })
      .catch((e) => {
        setInvalid(true);
        setServerWarningCode(`${e.response.status}`);
        setServerWarning(RESPONSE[`${e.response.status}`]);
      });
    return () => (isSubscribed = false);
  }, [authTokens, props]);

  useEffect(() => {
    let isSubscribed = true;
    const current = JSON.stringify(currentProducer);
    const val = JSON.stringify(producer);
    setDisabled(current === val);
    return () => (isSubscribed = false);
  }, [producer, currentProducer]);

  if (redirect) {
    return <Redirect to="/dashboard/producers" />;
  }

  return (
    <div>
      <Paper className={styles.paperBlock}>
        <Grid container className={styles.gridBlock}>
          <Grid item xs={1} className={styles.leftBlock}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/dashboard/producers"
            >
              Назад
            </Button>
          </Grid>
          <Grid item xs={11} className={styles.rightBlock}>
            <Typography align="right">
              <Button
                variant="contained"
                color="primary"
                className={styles.rightButton}
                onClick={() => saveProducer(false)}
                disabled={disabled}
              >
                Сохранить
              </Button>
              <Button
                variant="contained"
                color="primary"
                className={styles.rightButton}
                onClick={() => saveProducer(true)}
                disabled={disabled}
              >
                Сохранить и перейти к списку
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClickOpen}
              >
                Удалить
              </Button>
            </Typography>
          </Grid>
        </Grid>
        <Grid container className={styles.gridBlock}>
          <Grid item xs={12} sm={5} md={3} lg={2} className={styles.leftBlock}>
            <Avatar src={logo} className={styles.logoBlock}>
              <ImageIcon fontSize="large" />
            </Avatar>
          </Grid>
          <Grid
            item
            xs={12}
            sm={7}
            md={9}
            lg={10}
            className={styles.rightBlock}
          >
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <TextField
                  type="text"
                  label="Название"
                  fullWidth
                  name="name"
                  variant="outlined"
                  value={name}
                  onChange={(e) => {
                    changeName(e.target.value);
                  }}
                />
              </Grid>
              <Grid item>
                <TextField
                  type="text"
                  label="Наименование юридического лица"
                  fullWidth
                  name="entityName"
                  variant="outlined"
                  value={entityName}
                  onChange={(e) => {
                    changeEntityName(e.target.value);
                  }}
                />
              </Grid>
              <Grid item>
                <TextField
                  type="text"
                  label="ИНН"
                  fullWidth
                  name="inn"
                  variant="outlined"
                  value={inn}
                  onChange={(e) => {
                    changeInn(e.target.value);
                  }}
                />
              </Grid>
              <Grid item>
                <TextField
                  type="text"
                  label="Описание"
                  fullWidth
                  multiline
                  name="description"
                  variant="outlined"
                  value={description}
                  onChange={(e) => {
                    changeDescription(e.target.value);
                  }}
                />
              </Grid>
              <Grid item>
                <TextField
                  type="text"
                  label="Страна"
                  fullWidth
                  multiline
                  name="country"
                  variant="outlined"
                  value={country}
                  onChange={(e) => {
                    changeCountry(e.target.value);
                  }}
                />
              </Grid>
              <Grid item>
                <TextField
                  type="text"
                  label="Ссылка на логотип"
                  fullWidth
                  name="logo"
                  variant="outlined"
                  value={logo}
                  onChange={(e) => {
                    changeLogo(e.target.value);
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      <Dialog
        open={openChangePass}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Подтверждение удаления</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы действительно хотите удалить изготовителя {name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose} color="primary">
            Отмена
          </Button>
          <Button variant="contained" onClick={deleteItem} color="secondary">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={invalid}
        onClose={closeWarning}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert
          onClose={closeWarning}
          severity={serverWarningCode[0] === '5' ? 'error' : 'warning'}
        >{`Ой.. ${serverWarning || 'Ошибочка вышла.'}`}</MuiAlert>
      </Snackbar>
    </div>
  );
}

export default Detail;
