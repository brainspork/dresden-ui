import { AppBar, Button, makeStyles, Toolbar as MatToolbar } from '@material-ui/core';
import { FC } from 'react';
import { useHistory } from 'react-router';
import { useUserContext } from 'src/contexts/UserContext';
import UserMenuButton from './UserMenuButton';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'flex-end'
  }
});

const Toolbar: FC = (props) => {
  const classes = useStyles();
  const { user } = useUserContext();
  const history = useHistory();

  const handleLoginNavigation = () => history.push('/login');

  return (
    <AppBar position="sticky" className={classes.root}>
      <MatToolbar>
        {!user && <Button color="inherit" onClick={handleLoginNavigation}>Login</Button>}
        {user && <UserMenuButton />}
      </MatToolbar>
    </AppBar>
  );
}

export default Toolbar;