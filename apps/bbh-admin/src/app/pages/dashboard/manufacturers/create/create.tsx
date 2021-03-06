/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  Avatar,
  Button,
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
import MuiAlert from '@material-ui/lab/Alert';
import { RESPONSE } from '@bbh-admin/consts';
import { useAuth } from '@bbh-admin/context/auth';
import axios from 'axios';
import React, { ReactText, useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';

import styles from './create.module.scss';

/* eslint-disable-next-line */
export interface CreateProps {}

export function Create(props) {
  const { authTokens } = useAuth();
  const [manufacturer, setManufacturer] = useState({} as any);
  const [logo, setLogo] = useState('');
  const [name, setName] = useState('');
  const [entityName, setEntityName] = useState('');
  const [inn, setInn] = useState('');
  const [producer, setProducer] = useState('');
  const [producers, setProducers] = useState([]);
  const [description, setDescription] = useState('');
  const [country, setCountry] = useState('');
  const user = jwt_decode(authTokens.accessToken) as any;
  const [redirect, setRedirect] = useState(false);

  const [invalid, setInvalid] = useState(false);
  const [serverWarning, setServerWarning] = useState('');
  const [serverWarningCode, setServerWarningCode] = useState('');

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

  function clearForm() {
    setManufacturer({} as any);
    setLogo('');
    setName('');
    setDescription('');
    setCountry('');
  }

  function saveManufacturer(re) {
    axios
      .post(
        `api/manufacturer/create`,
        {
          name,
          entityName,
          inn,
          description,
          logo,
          country,
          usernameCreate: user.username,
          usernameUpdate: user.username,
          dateCreate: new Date().toUTCString(),
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
        if (result.status === 201) {
          clearForm();
          setRedirect(re);
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
              { id: '', name: '???????????????????????? ??????????????????????' },
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
    return () => (isSubscribed = false);
  }, [authTokens]);

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
              ??????????
            </Button>
          </Grid>
          <Grid item xs={11} className={styles.rightBlock}>
            <Typography align="right">
              <Button
                variant="contained"
                color="primary"
                onClick={() => saveManufacturer(true)}
              >
                ?????????????????? ?? ?????????????? ?? ????????????
              </Button>
            </Typography>
          </Grid>
        </Grid>
        <Grid container className={styles.gridBlock}>
          <Grid item xs={12} sm={5} md={3} lg={2} className={styles.leftBlock}>
            <Avatar src={logo} className={styles.logoBlock} />
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
                  label="????????????????"
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
                  label="???????????????????????? ???????????????????????? ????????"
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
                  label="??????"
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
                  label="????????????????"
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
                  label="????????????"
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
                  label="???????????? ???? ??????????????"
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
                    ????????????????????????
                  </InputLabel>
                  <Select
                    fullWidth
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={producer}
                    onChange={(e) => {
                      changeProducer(e.target.value);
                    }}
                    label="????????????????????????"
                  >
                    {producers.map((item) => (
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
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      <Snackbar
        open={invalid}
        onClose={closeWarning}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert
          onClose={closeWarning}
          severity={serverWarningCode[0] === '5' ? 'error' : 'warning'}
        >{`????.. ${serverWarning || '???????????????? ??????????.'}`}</MuiAlert>
      </Snackbar>
    </div>
  );
}

export default Create;
