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
  const [manufacturer, setManufacturer] = useState({} as any);
  const [currentManufacturer, setCurrentManufacturer] = useState({} as any);
  const [logo, setLogo] = useState('');
  const [name, setName] = useState('');
  const [entityName, setEntityName] = useState('');
  const [inn, setInn] = useState('');
  const [producer, setProducer] = useState('');
  const [producers, setProducers] = useState([]);
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
    const obj = Object.assign({}, manufacturer);
    obj.logo = val;
    setLogo(val);
    setManufacturer(obj);
  }

  function changeProducer(val) {
    const obj = Object.assign({}, manufacturer);
    obj.producer = val;
    setProducer(val);
    setManufacturer(obj);
  }

  function changeName(val) {
    const obj = Object.assign({}, manufacturer);
    obj.name = val;
    setName(val);
    setManufacturer(obj);
  }

  function changeEntityName(val) {
    const obj = Object.assign({}, manufacturer);
    obj.entityName = val;
    setEntityName(val);
    setManufacturer(obj);
  }

  function changeInn(val) {
    const obj = Object.assign({}, manufacturer);
    obj.inn = val;
    setInn(val);
    setManufacturer(obj);
  }

  function changeDescription(val) {
    const obj = Object.assign({}, manufacturer);
    obj.description = val;
    setDescription(val);
    setManufacturer(obj);
  }

  function changeCountry(val) {
    const obj = Object.assign({}, manufacturer);
    obj.country = val;
    setCountry(val);
    setManufacturer(obj);
  }

  function saveManufacturer(re) {
    axios
      .patch(
        `api/manufacturer/${props.match.params.manufacturerId}`,
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
          const obj = Object.assign({}, manufacturer);
          setCurrentManufacturer(obj);
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
      .delete(`api/manufacturer/${props.match.params.manufacturerId}`, {
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
      .post(
        'api/producer',
        {
          search: '',
          sortby: 'date',
          order: 'desc',
          offset: 0,
          limit: 9999,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authTokens.accessToken}`,
          },
        }
      )
      .then((result) => {
        if (result.status === 201) {
          console.log(result.data);
          const data = result.data.producers.map((item) => {
            return {
              id: item._id,
              name: item.name,
            };
          });
          if (isSubscribed) {
            setProducers([
              { id: '', name: 'Изготовитель отсутствует' },
              ...data,
            ]);
          }
        }
      })
      .catch((e) => {
        if (e.response.status !== 401) {
          alert(e);
        }
      });
    axios
      .get(`api/manufacturer/${props.match.params.manufacturerId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens.accessToken}`,
        },
      })
      .then((result) => {
        if (isSubscribed && result.status === 200) {
          setCurrentManufacturer(result.data);
          setManufacturer(result.data);
          setLogo(result.data.logo);
          setName(result.data.name);
          setEntityName(result.data.entityName);
          setInn(result.data.inn);
          setDescription(result.data.description);
          setCountry(result.data.country);
        }
      })
      .catch((e) => {
        if (isSubscribed) {
          setInvalid(true);
          setServerWarningCode(`${e.response.status}`);
          setServerWarning(RESPONSE[`${e.response.status}`]);
        }
      });
    return () => (isSubscribed = false);
  }, [authTokens, props]);

  useEffect(() => {
    let isSubscribed = true;
    const current = JSON.stringify(currentManufacturer);
    const val = JSON.stringify(manufacturer);
    if (isSubscribed) {
      setDisabled(current === val);
    }
    return () => (isSubscribed = false);
  }, [manufacturer, currentManufacturer]);

  if (redirect) {
    return <Redirect to="/dashboard/manufacturers" />;
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
              to="/dashboard/manufacturers"
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
                onClick={() => saveManufacturer(false)}
                disabled={disabled}
              >
                Сохранить
              </Button>
              <Button
                variant="contained"
                color="primary"
                className={styles.rightButton}
                onClick={() => saveManufacturer(true)}
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
              <Grid item>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="demo-simple-select-outlined-label">
                    Изготовитель
                  </InputLabel>
                  <Select
                    fullWidth
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={producer}
                    onChange={(e) => {
                      changeProducer(e.target.value);
                    }}
                    label="Изготовитель"
                  >
                    {producers.map((item) => (
                      <MenuItem
                        key={(item.id || 'undef') as ReactText}
                        value={item.id}
                      >
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
            Вы действительно хотите удалить компанию {name}?
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
