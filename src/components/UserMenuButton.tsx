import { Button, ClickAwayListener, Grow, MenuList, Popper } from '@material-ui/core';
import { FC, useRef, useState, MouseEvent, useEffect, KeyboardEvent } from 'react';
import { useUserContext } from 'src/contexts/UserContext';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { ArrowDropDown } from '@material-ui/icons';

const UserMenuButton: FC = () => {
  const { user, setUserContext } = useUserContext();

  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const prevOpen = useRef(open);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  }

  const handleClose = (ev: MouseEvent<EventTarget>) => {
    if (anchorRef.current && anchorRef.current.contains(ev.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  }

  const handleListKeyDown = (ev: KeyboardEvent) => {
    if (ev.key === 'Tab') {
      ev.preventDefault();
      setOpen(false);
    }
  }

  const handleLogout = () => {
    setUserContext(undefined);
  }

  useEffect(() => {
    if (anchorRef.current && prevOpen.current && !open) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Button 
        color="inherit" 
        onClick={handleToggle}
        ref={anchorRef}
      >
        {user?.username || 'No User'}
        <ArrowDropDown />
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        placement='bottom-end'
      >
        {({ TransitionProps}) => (
          <Grow { ...TransitionProps }>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList 
                  autoFocusItem={open} 
                  onKeyDown={handleListKeyDown} 
                >
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}

export default UserMenuButton;