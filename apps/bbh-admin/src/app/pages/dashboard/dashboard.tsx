/* eslint-disable jsx-a11y/accessible-emoji */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import jwt_decode from 'jwt-decode';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  IconButton,
  Typography,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Divider,
  Paper,
  Grid,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { useAuth } from '../../context/auth';
import styles from './dashboard.module.scss';
import { Link, Redirect, Route, useRouteMatch } from 'react-router-dom';
import Users from './users/users';
import Manufacturers from './manufacturers/manufacturers';
import Brands from './brands/brands';
import Lines from './lines/lines';
import Products from './products/products';
import Producers from './producers/producers';
import Dropzone from '../../components/dropzone/dropzone';
import axios from 'axios';

/* eslint-disable-next-line */
export interface DashboardProps {}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

export function Dashboard(props) {
  const { path } = useRouteMatch();
  const classes = useStyles();
  const { authTokens, setAuthTokens } = useAuth();
  const [openSidebar, setOpenSidebar] = useState(false);
  const user = jwt_decode(authTokens.accessToken) as any;

  function logOut() {
    setAuthTokens(null);
  }

  // For GET requests
  axios.interceptors.request.use(
    (req) => {
      return req;
    },
    (err) => {
      if (err.response.status === 401) {
        setAuthTokens(null);
      }
      return Promise.reject(err);
    }
  );

  // For POST requests
  axios.interceptors.response.use(
    (res) => {
      return res;
    },
    (err) => {
      if (err.response.status === 401) {
        setAuthTokens(null);
      }
      return Promise.reject(err);
    }
  );

  return (
    <div className={classes.root}>
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, openSidebar && classes.appBarShift)}
        color="primary"
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpenSidebar(true)}
            className={clsx(
              classes.menuButton,
              openSidebar && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={styles.logo}>
            BBH
          </Typography>
          <Button color="inherit" onClick={logOut}>
            Выйти
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={openSidebar}
        onClose={() => setOpenSidebar(false)}
        variant="permanent"
        classes={{
          paper: clsx(
            classes.drawerPaper,
            !openSidebar && classes.drawerPaperClose
          ),
        }}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={() => setOpenSidebar(false)}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Route exact path={`${path}`}>
            <Paper className={styles.dashPaper}>
              {user.role === 'DEFAULT' && (
                <Typography variant="body1" gutterBottom align="center">
                  Привет! Админка Бэ-Бэ-Ха почти у цели, осталось только
                  получить роль модератора. Спроси админа 😸
                </Typography>
              )}
              {user.role === 'MODERATOR' && (
                <Grid
                  container
                  direction="column"
                  spacing={2}
                  className={styles.gridBlock}
                >
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      component={Link}
                      to={`${path}/producers`}
                    >
                      Изготовители
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      component={Link}
                      to={`${path}/manufacturers`}
                    >
                      Компании
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      component={Link}
                      to={`${path}/brands`}
                    >
                      Бренды
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      component={Link}
                      to={`${path}/lines`}
                    >
                      Линейки
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      component={Link}
                      to={`${path}/products`}
                    >
                      Продукты
                    </Button>
                  </Grid>
                  {/* <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      component={Link}
                      to={`${path}/mixes`}
                    >
                      Миксы
                    </Button>
                  </Grid>
                  <Grid item>
                    <Dropzone />
                  </Grid> */}
                </Grid>
              )}
              {user.role === 'ADMIN' && (
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to={`${path}/users`}
                >
                  Пользователи
                </Button>
              )}
            </Paper>
          </Route>
          <Route path={`${path}/users`} component={Users} />
          <Route path={`${path}/producers`} component={Producers} />
          <Route path={`${path}/manufacturers`} component={Manufacturers} />
          <Route path={`${path}/brands`} component={Brands} />
          <Route path={`${path}/lines`} component={Lines} />
          <Route path={`${path}/products`} component={Products} />
        </Container>
      </main>
    </div>
  );
}

export default Dashboard;
