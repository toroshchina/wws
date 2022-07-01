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
  const [line, setLine] = useState({} as any);
  const [currentLine, setCurrentLine] = useState({} as any);
  const [logo, setLogo] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tastes, setTastes] = useState([]);
  const [strength, setStrength] = useState('');
  const [brand, setBrand] = useState('');
  const [brands, setBrands] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [openChangePass, setOpenChangePass] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const user = jwt_decode(authTokens.accessToken) as any;

  const [invalid, setInvalid] = useState(false);
  const [serverWarning, setServerWarning] = useState('');
  const [serverWarningCode, setServerWarningCode] = useState('');

  const defaultTastes = ['Малина', 'Манго', 'Фисташка'];

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
    const obj = Object.assign({}, line);
    obj.logo = val;
    setLogo(val);
    setLine(obj);
  }

  function changeStrength(val) {
    const obj = Object.assign({}, line);
    obj.strength = val;
    setStrength(val);
    setLine(obj);
  }

  function changeTastes(e, val) {
    const obj = Object.assign({}, line);
    obj.tastes = val;
    setTastes(val);
    setLine(obj);
  }

  function changeName(val) {
    const obj = Object.assign({}, line);
    obj.name = val;
    setName(val);
    setLine(obj);
  }

  function changeDescription(val) {
    const obj = Object.assign({}, line);
    obj.email = val;
    setDescription(val);
    setLine(obj);
  }

  function changeBrand(val) {
    const obj = Object.assign({}, line);
    obj.brand = val;
    setBrand(val);
    setLine(obj);
  }

  function saveLine(re) {
    axios
      .patch(
        `api/line/${props.match.params.lineId}`,
        {
          name,
          description,
          logo: logo ? logo : undefined,
          tastes,
          brand,
          strength,
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
          const obj = Object.assign({}, line);
          setCurrentLine(obj);
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
      .delete(`api/line/${props.match.params.lineId}`, {
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
        'api/brand',
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
          const data = result.data.brands.map((item) => {
            return {
              id: item._id,
              name: item.name,
            };
          });
          if (isSubscribed) {
            setBrands(data);
          }
        }
      })
      .catch((e) => {
        if (e.response.status !== 401) {
          alert(e);
        }
      });
    axios
      .get(`api/line/${props.match.params.lineId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens.accessToken}`,
        },
      })
      .then((result) => {
        if (isSubscribed && result.status === 200) {
          setCurrentLine(result.data);
          setLine(result.data);
          setLogo(result.data.logo);
          setName(result.data.name);
          setDescription(result.data.description);
          setTastes(result.data.tastes);
          setStrength(result.data.strength);
          setBrand(result.data.brand);
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
    const current = JSON.stringify(currentLine);
    const val = JSON.stringify(line);
    if (isSubscribed) {
      setDisabled(current === val);
    }
    return () => (isSubscribed = false);
  }, [line, currentLine]);

  if (redirect) {
    return <Redirect to="/dashboard/lines" />;
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
              to="/dashboard/lines"
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
                onClick={() => saveLine(false)}
                disabled={disabled}
              >
                Сохранить
              </Button>
              <Button
                variant="contained"
                color="primary"
                className={styles.rightButton}
                onClick={() => saveLine(true)}
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
              <Grid item>
                <TextField
                  type="number"
                  label="Крепость"
                  fullWidth
                  name="strength"
                  variant="outlined"
                  value={strength}
                  onChange={(e) => {
                    changeStrength(e.target.value);
                  }}
                />
              </Grid>
              <Grid item>
                <Autocomplete
                  multiple
                  id="tags-filled"
                  options={defaultTastes}
                  freeSolo
                  renderTags={(value: string[], getTagProps) =>
                    value.map((option: string, index: number) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  value={tastes}
                  onChange={changeTastes}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Вкусы"
                      placeholder="Введите название и нажмите Enter"
                    />
                  )}
                />
              </Grid>
              {(() => {
                if (brands.length) {
                  return (
                    <Grid item>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel id="demo-simple-select-outlined-label">
                          Бренд
                        </InputLabel>
                        <Select
                          fullWidth
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={brand}
                          onChange={(e) => {
                            changeBrand(e.target.value);
                          }}
                          label="Бренд"
                        >
                          {brands.map((item) => (
                            <MenuItem
                              key={item.id || ('undef' as ReactText)}
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
            Вы действительно хотите удалить линейку {name}?
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
