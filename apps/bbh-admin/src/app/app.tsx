import React, { useState } from 'react';
import Auth from './pages/auth/auth';
import {
  unstable_createMuiStrictModeTheme as createMuiTheme,
  Theme,
  ThemeProvider,
} from '@material-ui/core/styles';
import { BrowserRouter, Redirect, Route } from 'react-router-dom';
import PrivateRoute from './pages/private-router/private-router';
import Dashboard from './pages/dashboard/dashboard';
import { AuthContext } from './context/auth';
import styles from './app.module.scss';

const outerTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

export function App() {
  const existingTokens = JSON.parse(localStorage.getItem('tokens'));
  const [authTokens, setAuthTokens] = useState(existingTokens);

  const setTokens = (data) => {
    localStorage.setItem('tokens', JSON.stringify(data));
    setAuthTokens(data);
  };

  return (
    <div className={styles.app}>
      <ThemeProvider theme={outerTheme}>
        <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
          <BrowserRouter>
            <Route
              exact
              path="/"
              render={() => {
                return <Redirect to="/dashboard" />;
              }}
            />
            <Route path="/auth" component={Auth} />
            <PrivateRoute path="/dashboard" component={Dashboard} />
          </BrowserRouter>
        </AuthContext.Provider>
      </ThemeProvider>
    </div>
  );
}

export default App;
