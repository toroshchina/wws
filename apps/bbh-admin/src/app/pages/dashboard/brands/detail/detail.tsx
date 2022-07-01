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
  const [brand, setBrand] = useState({} as any);
  const [currentBrand, setCurrentBrand] = useState({} as any);
  const [logo, setLogo] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [strength, setStrength] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [manufacturers, setManufacturers] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [openChangePass, setOpenChangePass] = useState(false);
  const user = jwt_decode(authTokens.accessToken) as any;

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
    const obj = Object.assign({}, brand);
    obj.logo = val;
    setLogo(val);
    setBrand(obj);
  }

  function changeStrength(val) {
    const obj = Object.assign({}, brand);
    obj.strength = val;
    setStrength(val);
    setBrand(obj);
  }

  function changeManufacturer(val) {
    const obj = Object.assign({}, brand);
    obj.manufacturer = val;
    setManufacturer(val);
    setBrand(obj);
  }

  function changeName(val) {
    const obj = Object.assign({}, brand);
    obj.name = val;
    setName(val);
    setBrand(obj);
  }

  function changeDescription(val) {
    const obj = Object.assign({}, brand);
    obj.email = val;
    setDescription(val);
    setBrand(obj);
  }

  function saveBrand(re) {
    axios
      .patch(
        `api/brand/${props.match.params.brandId}`,
        {
          name,
          description,
          logo,
          strength,
          manufacturer,
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
          const obj = Object.assign({}, brand);
          setCurrentBrand(obj);
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

  function isDisable() {
    const current = JSON.stringify(currentBrand);
    const val = JSON.stringify(brand);
    setDisabled(current === val);
  }

  function deleteItem() {
    axios
      .delete(`api/brand/${props.match.params.brandId}`, {
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
        'api/manufacturer',
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
          const data = result.data.manufacturers.map((item) => {
            return {
              id: item._id,
              name: item.name,
            };
          });
          if (isSubscribed) {
            setManufacturers([
              { id: '', name: 'Компания отсутствует' },
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
      .get(`api/brand/${props.match.params.brandId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens.accessToken}`,
        },
      })
      .then((result) => {
        if (isSubscribed && result.status === 200) {
          setCurrentBrand(result.data);
          setBrand(result.data);
          setLogo(result.data.logo);
          setName(result.data.name);
          setDescription(result.data.description);
          setStrength(result.data.strength);
          setManufacturer(result.data.manufacturer);
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
    const current = JSON.stringify(currentBrand);
    const val = JSON.stringify(brand);
    if (isSubscribed) {
      setDisabled(current === val);
    }
    return () => (isSubscribed = false);
  }, [brand, currentBrand]);

  if (redirect) {
    return <Redirect to="/dashboard/brands" />;
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
              to="/dashboard/brands"
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
                onClick={() => saveBrand(false)}
                disabled={disabled}
              >
                Сохранить
              </Button>
              <Button
                variant="contained"
                color="primary"
                className={styles.rightButton}
                onClick={() => saveBrand(true)}
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
                  label="Ссылка на логотип"
                  fullWidth
                  name="logo"
                  variant="outlined"
                  value={logo || ''}
                  onChange={(e) => {
                    changeLogo(e.target.value);
                  }}
                />
              </Grid>
              {(() => {
                if (manufacturers.length) {
                  return (
                    <Grid item>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel id="demo-simple-select-outlined-label">
                          Производитель
                        </InputLabel>
                        <Select
                          fullWidth
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={manufacturer || ''}
                          onChange={(e) => {
                            changeManufacturer(e.target.value);
                          }}
                          label="Производитель"
                        >
                          {manufacturers.map((item) => (
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
                  );
                }
              })()}
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
            Вы действительно хотите удалить бренд {name}?
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
