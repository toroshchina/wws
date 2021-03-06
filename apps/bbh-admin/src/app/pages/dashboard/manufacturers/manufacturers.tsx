/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Avatar,
  Button,
  createStyles,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import SearchIcon from '@material-ui/icons/Search';
import CancelIcon from '@material-ui/icons/Cancel';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import moment from 'moment';
import React, { useState, useEffect, ReactText } from 'react';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import { useAuth } from '../../../context/auth';
import Detail from './detail/detail';

import styles from './manufacturers.module.scss';
import Create from './create/create';

/* eslint-disable-next-line */
export interface ManufacturerProps {}

export interface Filter {
  search: string;
  sortby: string;
  order: 'asc' | 'desc';
  offset: number;
  limit: number;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
  })
);

export function Manufacturers(props) {
  const classes = useStyles();
  const { path } = useRouteMatch();
  const { authTokens } = useAuth();
  const [users, setManufacturers] = useState([]);
  const [filter, setFilter] = useState({
    search: '',
    sortby: 'date',
    order: 'desc',
    offset: 0,
    limit: 25,
  } as Filter);
  const [search, setSearch] = useState('');
  const [sortby, setSortBy] = useState('date');
  const [order, setOrder] = useState('desc' as 'asc' | 'desc');
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(25);
  const [pages, setPages] = useState(0);
  const user = jwt_decode(authTokens.accessToken) as any;
  interface HeadCell {
    id: string;
    label: string;
    sortable: boolean;
  }

  const headCells: HeadCell[] = [
    { id: 'logo', label: '??????????????', sortable: false },
    { id: 'name', label: '????????????????', sortable: true },
    { id: 'dateCreate', label: '???????? ????????????????????', sortable: true },
    { id: 'dateUpdate', label: '???????? ??????????????????', sortable: true },
    { id: 'usernameCreate', label: '?????? ????????????????', sortable: true },
    { id: 'usernameUpdate', label: '?????? ??????????????', sortable: true },
    { id: 'link', label: '????????????', sortable: false },
  ];

  function changeSearch() {
    const obj = Object.assign({}, filter);
    obj.search = search;
    setFilter(obj);
  }

  function clearSearch() {
    const obj = Object.assign({}, filter);
    obj.search = '';
    setSearch('');
    setFilter(obj);
  }

  function changePage(e, page) {
    const obj = Object.assign({}, filter);
    obj.offset = page;
    setOffset(page);
    setFilter(obj);
  }

  async function changeRowsPerPage(e) {
    const obj = Object.assign({}, filter);
    obj.limit = e.target.value;
    obj.offset = 0;
    setLimit(e.target.value);
    setOffset(0);
    setFilter(obj);
  }

  function createSortHandler(id) {
    const obj = Object.assign({}, filter);
    if (id === filter.sortby) {
      obj.order = filter.order === 'asc' ? 'desc' : 'asc';
      setOrder(obj.order);
    } else {
      obj.sortby = id;
      setSortBy(id);
    }
    obj.offset = 0;
    setOffset(0);
    setFilter(obj);
  }

  function keyPress(e) {
    if (e.keyCode === 13) {
      changeSearch();
    }
  }

  useEffect(() => {
    if (props.location.pathname === '/dashboard/manufacturers') {
      const obj = Object.assign({}, filter) as any;
      obj.order = filter.order === 'desc' ? -1 : 1;
      axios
        .post(
          'api/manufacturer',
          { ...obj },
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
                logo: item.logo,
                id: item._id,
                usernameCreate: item.usernameCreate,
                usernameUpdate: item.usernameUpdate,
                name: item.name,
                dateCreate: new Date(item.dateCreate),
                dateUpdate: new Date(item.dateUpdate),
                link: item._id,
              };
            });
            setManufacturers(data);
            setPages(result.data.count);
          }
        })
        .catch((e) => {
          if (e.response.status !== 401) {
            alert(e);
          }
        });
    }
  }, [filter, authTokens, props]);

  if (user.role !== 'MODERATOR') {
    return (
      <MuiAlert
        onClose={() => props.history.push('/dashboard')}
        severity="warning"
      >
        ????.. ???????????? ????????????????
      </MuiAlert>
    );
  }

  return (
    <div className={styles.userBlock}>
      <Route exact path={path}>
        <Grid container className={styles.headerBlock}>
          <Grid item xs={1} className={styles.createButtonBlock}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/dashboard"
            >
              ??????????
            </Button>
          </Grid>
          <Grid item className={styles.titleBlock}>
            <Typography variant="h4">????????????????</Typography>
          </Grid>
          <Grid item className={styles.searchBlock}>
            <TextField
              onKeyDown={(e) => {
                keyPress(e);
              }}
              type="text"
              label="??????????"
              placeholder="???????????????? ?????? ID ??????????????????"
              fullWidth
              name="search"
              variant="outlined"
              value={search}
              autoComplete="search"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      aria-label="search"
                      onClick={() => changeSearch()}
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                endAdornment: search !== '' && (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="search"
                      onClick={() => clearSearch()}
                    >
                      <CancelIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item className={styles.createButtonBlock}>
            <Button
              component={Link}
              to={`${path}/create`}
              color="primary"
              variant="contained"
            >
              ??????????????
            </Button>
          </Grid>
        </Grid>
        <Paper className={styles.paperBlock}>
          <TablePagination
            className={styles.tablePaginationBlock}
            rowsPerPageOptions={[1, 10, 25, 100]}
            component="div"
            count={pages}
            rowsPerPage={limit}
            page={offset}
            onPageChange={changePage}
            onRowsPerPageChange={changeRowsPerPage}
          />
          <TableContainer className={styles.tableBlock}>
            <Table stickyHeader aria-label="simple table">
              <TableHead>
                <TableRow>
                  {headCells.map((headCell) => (
                    <TableCell
                      key={headCell.id as ReactText}
                      sortDirection={sortby === headCell.id ? order : false}
                    >
                      {headCell.sortable && (
                        <TableSortLabel
                          active={sortby === headCell.id}
                          direction={sortby === headCell.id ? order : 'asc'}
                          onClick={() => createSortHandler(headCell.id)}
                        >
                          {headCell.label}
                          {sortby === headCell.id ? (
                            <span className={classes.visuallyHidden}>
                              {order === 'desc'
                                ? 'sorted descending'
                                : 'sorted ascending'}
                            </span>
                          ) : null}
                        </TableSortLabel>
                      )}
                      {!headCell.sortable && headCell.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody className={styles.tableBodyBlock}>
                {users.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Avatar
                        variant="square"
                        src={row.logo}
                        component={Link}
                        to={`${path}/detail/${row.link}`}
                        className={styles.rowLogo}
                      />
                    </TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>
                      {moment(row.dateCreate).format('D/MM/YYYY')}
                    </TableCell>
                    <TableCell>
                      {moment(row.dateUpdate).format('D/MM/YYYY')}
                    </TableCell>
                    <TableCell>{row.usernameCreate}</TableCell>
                    <TableCell>{row.usernameUpdate}</TableCell>
                    <TableCell>
                      <Button
                        component={Link}
                        to={`${path}/detail/${row.link}`}
                        color="primary"
                        variant="contained"
                      >
                        ??????????????
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Route>
      <Switch>
        <Route path={`${path}/create`} component={Create} />
        <Route path={`${path}/detail/:manufacturerId`} component={Detail} />
      </Switch>
    </div>
  );
}

export default Manufacturers;
