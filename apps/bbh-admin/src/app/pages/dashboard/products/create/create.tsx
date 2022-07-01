/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Avatar,
  Box,
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
  Tab,
  Tabs,
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
import React, { ReactText, useEffect, useState, useRef } from 'react';
import { Link, Redirect } from 'react-router-dom';

import styles from './create.module.scss';
import Dropzone from '../../../../components/dropzone/dropzone';

/* eslint-disable-next-line */
export interface CreateProps {}

export function Create(props) {
  const dropzoneRef = useRef();
  const { authTokens } = useAuth();
  const [product, setProduct] = useState({} as any);
  const [logo, setLogo] = useState('');
  const [logos, setLogos] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tastes, setTastes] = useState([]);
  const [strength, setStrength] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [brand, setBrand] = useState('');
  const [brands, setBrands] = useState([]);
  const [line, setLine] = useState('');
  const [lines, setLines] = useState([]);
  const user = jwt_decode(authTokens.accessToken) as any;
  const [openChangeLogo, setOpenChangeLogo] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [validUpload, setValidUpload] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState('');

  const [invalid, setInvalid] = useState(false);
  const [serverWarning, setServerWarning] = useState('');
  const [serverWarningCode, setServerWarningCode] = useState('');

  const defaultTastes = ['Малина', 'Манго', 'Фисташка'];

  function closeWarning() {
    setInvalid(false);
  }

  function validateUpload(val) {
    setValidUpload(val);
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  function handleClickOpen() {
    setOpenChangeLogo(true);
  }

  function handleChangeTab(event, val) {
    setActiveTab(val);
  }

  function handleClose() {
    setOpenChangeLogo(false);
  }

  function changeLogo() {
    const obj = Object.assign({}, product);
    obj.logo = selectedLogo;
    setLogo(selectedLogo);
    setProduct(obj);
    handleClose();
  }

  function selectLogo(val) {
    if (val === selectedLogo) {
      setSelectedLogo('');
    } else {
      setSelectedLogo(val);
    }
  }

  function uploadLogo(val) {
    (dropzoneRef as any).current.upload();
    setValidUpload(false);
  }

  function clearForm() {
    setProduct({} as any);
    setLogo('');
    setName('');
    setDescription('');
    setTastes([]);
    setStrength('');
  }

  function changeStrength(val) {
    const obj = Object.assign({}, product);
    obj.strength = val;
    setStrength(val);
    setProduct(obj);
  }

  function changeTastes(e, val) {
    const obj = Object.assign({}, product);
    obj.tastes = val;
    setTastes(val);
    setProduct(obj);
  }

  function changeName(val) {
    const obj = Object.assign({}, product);
    obj.name = val;
    setName(val);
    setProduct(obj);
  }

  function changeDescription(val) {
    const obj = Object.assign({}, product);
    obj.email = val;
    setDescription(val);
    setProduct(obj);
  }

  function changeBrand(val) {
    const obj = Object.assign({}, product);
    obj.brand = val;
    setBrand(val);
    setProduct(obj);
  }

  function changeLine(val) {
    const obj = Object.assign({}, product);
    obj.brand = val;
    setLine(val);
    setProduct(obj);
  }

  function saveProduct(re) {
    axios
      .post(
        `api/product/create`,
        {
          name,
          description,
          logo,
          tastes,
          strength,
          brand,
          line,
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
      .post(
        'api/line',
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
          const data = result.data.lines.map((item) => {
            return {
              id: item._id,
              name: item.name,
            };
          });
          if (isSubscribed) {
            setLines(data);
          }
        }
      })
      .catch((e) => {
        if (e.response.status !== 401) {
          alert(e);
        }
      });
    axios
      .post(
        'api/upload',
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
          const data = result.data.uploads.map((item) => {
            return {
              id: item._id,
              name: item.name,
            };
          });
          if (isSubscribed) {
            setLogos(data);
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

  useEffect(() => {
    let isSubscribed = true;
    return () => (isSubscribed = false);
  }, [brands, lines, logos]);

  if (redirect) {
    return <Redirect to="/dashboard/products" />;
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
              to="/dashboard/products"
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
                onClick={() => saveProduct(false)}
              >
                Сохранить
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => saveProduct(true)}
              >
                Сохранить и перейти к списку
              </Button>
            </Typography>
          </Grid>
        </Grid>
        <Grid container className={styles.gridBlock}>
          <Grid item xs={12} sm={5} md={3} lg={2} className={styles.leftBlock}>
            <Avatar src={'/upload/images/' + logo} className={styles.logoBlock}>
              <ImageIcon fontSize="large" />
            </Avatar>
            <Button
              variant="contained"
              color="primary"
              onClick={handleClickOpen}
            >
              Добавить логотип
            </Button>
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
                      <MenuItem key={item.id as ReactText} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="demo-simple-select-outlined-label">
                    Линейка
                  </InputLabel>
                  <Select
                    fullWidth
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={line}
                    onChange={(e) => {
                      changeLine(e.target.value);
                    }}
                    label="Линейка"
                  >
                    {lines.map((item) => (
                      <MenuItem key={item.id as ReactText} value={item.id}>
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
        open={openChangeLogo}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={activeTab}
              onChange={handleChangeTab}
              aria-label="basic tabs example"
            >
              <Tab label="Список изображений" {...a11yProps(0)} />
              <Tab label="Загрузить изображения" {...a11yProps(1)} />
            </Tabs>
          </Box>
        </DialogTitle>
        <DialogContent>
          <div
            role="tabpanel"
            hidden={activeTab !== 0}
            id={`simple-tabpanel-0`}
            aria-labelledby={`simple-tab-0`}
          >
            {activeTab === 0 && (
              <Box
                style={{
                  maxHeight: '400px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexWrap: 'wrap',
                }}
              >
                {logos.map((logo, i) => {
                  return (
                    <div
                      key={'image_' + i}
                      style={{
                        background: `url(/upload/images/${logo.name}) no-repeat`,
                        backgroundSize: 'cover',
                        width: '100px',
                        height: '200px',
                        flex: '1 1 160px',
                        margin: '10px',
                        borderRadius: '5px',
                        border:
                          logo.name === selectedLogo
                            ? '3px solid #3f51b5'
                            : '3px solid transparent',
                        cursor: 'pointer',
                      }}
                      onClick={() => selectLogo(logo.name)}
                    ></div>
                  );
                })}
              </Box>
            )}
          </div>
          <div
            role="tabpanel"
            hidden={activeTab !== 1}
            id={`simple-tabpanel-1`}
            aria-labelledby={`simple-tab-1`}
          >
            {activeTab === 1 && (
              <Box style={{ maxHeight: '400px' }}>
                <Dropzone
                  validate={(val) => validateUpload(val)}
                  ref={dropzoneRef}
                />
              </Box>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose} color="primary">
            Закрыть
          </Button>
          <Button
            variant="contained"
            className={activeTab === 0 ? '' : 'hidden'}
            onClick={changeLogo}
            color="primary"
          >
            Выбрать
          </Button>
          <Button
            variant="contained"
            className={activeTab === 1 ? '' : 'hidden'}
            onClick={uploadLogo}
            color="primary"
            disabled={!validUpload}
          >
            Загрузить
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

export default Create;
