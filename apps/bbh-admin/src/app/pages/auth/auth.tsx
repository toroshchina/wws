import React from 'react';
import { Grid, Paper, Tabs, Tab, Typography } from '@material-ui/core';
import { Redirect, Route, useRouteMatch, Link } from 'react-router-dom';
import styles from './auth.module.scss';
import Login from './login/login';
import Register from './register/register';

export function Auth(props) {
  const { path } = useRouteMatch();

  if (
    props.location.pathname.split('/')[
      props.location.pathname.split('/').length - 1
    ] === 'auth'
  ) {
    return <Redirect to={`${path}/login`} />;
  }

  return (
    <div>
      <Grid container component="main" className={styles.auth}>
        <Grid item xs={false} sm={4} md={7} className={styles.image} />
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
          className={styles.rightBack}
        >
          <Typography
            variant="h4"
            color="primary"
            align="center"
            className={styles.name}
          >
            BBH
          </Typography>
          <Grid container spacing={0} justifyContent="center" direction="row">
            <Grid item>
              <Grid
                container
                direction="column"
                justifyContent="center"
                spacing={2}
                className={styles.loginForm}
              >
                <Paper
                  variant="elevation"
                  elevation={2}
                  className={styles.loginBackground}
                >
                  <Tabs
                    value={
                      props.location.pathname.split('/')[
                        props.location.pathname.split('/').length - 1
                      ]
                    }
                  >
                    <Tab
                      label="Вход"
                      value="login"
                      component={Link}
                      to={'/auth/login'}
                    />
                    <Tab
                      label="Регистрация"
                      value="register"
                      component={Link}
                      to={'/auth/register'}
                    />
                  </Tabs>
                  <Route path={`${path}/login`} component={Login} />
                  <Route path={`${path}/register`} component={Register} />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
export default Auth;
