import { AppBar, Button, Toolbar as MatToolbar } from '@material-ui/core';
import { FC, useRef, useState, MouseEvent } from 'react';
import { useHistory } from 'react-router';
import { useUserContext } from 'src/contexts/UserContext';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

const Toolbar: FC = (props) => {
  const { user, setUserContext } = useUserContext();
  const history = useHistory();
  const [ anchorEl, setAnchorEl ] = useState<HTMLElement>();

  const handleLoginNavigation = () => history.push('/login');

  const handleOpen = (ev: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(ev.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(undefined);
  }

  const handleLogout = () => {
    setUserContext(undefined);
    handleClose();
  }

  return (
    <AppBar position="sticky">
      <MatToolbar>
        {!user && <Button color="inherit" onClick={handleLoginNavigation}>Login</Button>}
        {user && (
          <>
            <Button color="inherit" onClick={handleOpen}>{user.username}</Button>
            <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleClose}>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        )}
      </MatToolbar>
    </AppBar>
  );
}

export default Toolbar;