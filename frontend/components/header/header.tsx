'use client';
import React, {ChangeEvent, useState} from 'react';
import Link from 'next/link';
import styles from './header.module.scss';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {selectUserData, setFriends, setUserData} from '@/store/slices/user';
import {
  Button,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Menu,
  MenuItem,
  TextField,
  Divider,
  ListItemIcon
} from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Logout from '@mui/icons-material/Logout';
import {UserApi} from '@/services/api';
import {useRouter} from 'next/navigation';

const Header = () => {
  const userData = useAppSelector(selectUserData).userReducer;
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openAddNewFriendDialog, setAddNewFriendOpenDialog] = useState<boolean>(false);
  const [openDeleteFriendDialog, setDeleteFriendOpenDialog] = useState<boolean>(false);
  const [uniqueId, setUniqueId] = useState<string>('');
  const open = Boolean(anchorEl);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUniqueId(event.target.value);
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseDialog = () => {
    setAddNewFriendOpenDialog(false);
    setDeleteFriendOpenDialog(false);
  };

  const handleAddFriendButton = () => {
    setAddNewFriendOpenDialog(true);
  };

  const handleDeleteButton = () => {
    setDeleteFriendOpenDialog(true);
  };

  const handleAddFriendDialog = async () => {
    try {
      const authToken = localStorage.getItem('authToken') || '';
      await UserApi.addFriend(uniqueId, authToken);
      setAddNewFriendOpenDialog(false);
      setUniqueId('');
    } catch (e) {
      console.log(e);
      setAddNewFriendOpenDialog(false);
      setUniqueId('');
    }
  };

  const handleDeleteFriendDialog = async () => {
    try {
      const authToken = localStorage.getItem('authToken') || '';
      await UserApi.deleteFriend(uniqueId, authToken);
      setDeleteFriendOpenDialog(false);
      setUniqueId('');
    } catch (e) {
      console.log(e);
      setDeleteFriendOpenDialog(false);
      setUniqueId('');
    }
  };

  const handleLogoutButton = async () => {
    try {
      setAnchorEl(null);

      dispatch(setUserData({
        tokens: {
          accessToken: '',
          refreshToken: ''
        },
        user: {
          id: '',
          email: '',
          username: '',
          uniqueId: '',
          friends: [],
          goodActions: []
        },
        isAuth: false
      }));

      const refToken = localStorage.getItem('refToken') || '';

      await UserApi.logout(refToken);

      router.push('/signIn');
    } catch (e) {
      console.log(e);
    }
  };


  if (!userData.isAuth) {
    return (
      <header className={styles.container}>
        <div className={styles.content}>
          <div className={styles.logo}>
            <Link href="/">G-D-S</Link>
          </div>
          <div className={styles.links}>
            <Link href="/">Home</Link>
            <Link href="/signUp">Sign Up</Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <Link href="/">G-D-S</Link>
        </div>
        <div className={styles.links}>
          <Link href="/">Home</Link>

          <Box sx={{display: 'flex', alignItems: 'center', textAlign: 'center'}}>
            <Tooltip title="Account">
              <IconButton
                onClick={handleClick}
                size="small"
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                sx={{color: '#ffffff', fontWeight: 'bold'}}
              >
                {userData.username}
              </IconButton>
            </Tooltip>
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{horizontal: 'right', vertical: 'top'}}
            anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
          >
            <MenuItem onClick={handleClose} className={styles.menuItems}>
              <Link href="/myAccount" className={styles.links}>My Account</Link>
            </MenuItem>
            <MenuItem onClick={handleClose} className={styles.menuItems}>
              <Link href="/list" className={styles.links}>List Good Actions</Link>
            </MenuItem>
            <Divider/>
            <MenuItem onClick={handleAddFriendButton}>
              <ListItemIcon>
                <PersonAdd fontSize="small"/>
              </ListItemIcon>
              Add Friend Account
            </MenuItem>
            <MenuItem onClick={handleDeleteButton}>
              <ListItemIcon>
                <PersonRemoveIcon fontSize="small"/>
              </ListItemIcon>
              Delete Friend Account
            </MenuItem>
            <MenuItem onClick={handleLogoutButton}>
              <ListItemIcon>
                <Logout fontSize="small"/>
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
          <Dialog open={openAddNewFriendDialog} onClose={handleClose}>
            <DialogTitle>Add New Friend</DialogTitle>
            <DialogContent>
              <DialogContentText>
                You need to just get uniqueId from your friend and paste here. UniqueId can be found in profile. Format:
                #F1TEST2X
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="uniqueId"
                type="text"
                fullWidth
                variant="standard"
                value={uniqueId}
                onChange={handleInputChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleAddFriendDialog}>Add</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={openDeleteFriendDialog} onClose={handleClose}>
            <DialogTitle>Delete Friend</DialogTitle>
            <DialogContent>
              <DialogContentText>
                  <span>
                    To delete friend - you need write friend uniqueId. Your friends:{' '}
                  </span>
                  {userData?.friends?.map((friend, index: number) => {
                    return (
                      <span key={index}>
                        {`${index + 1}. ${friend}`}
                      </span>
                    );
                  })}
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="uniqueId"
                type="text"
                fullWidth
                variant="standard"
                value={uniqueId}
                onChange={handleInputChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleDeleteFriendDialog}>Delete</Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </header>
  );
};

export {Header};