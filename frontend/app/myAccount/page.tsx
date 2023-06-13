'use client';
import React, {FC, useState} from 'react';
import styles from './myAccount.module.scss';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {selectUserData, setUserData} from '@/store/slices/user';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import {UserApi} from '@/services/api';

const Page: FC = () => {
  const userData = useAppSelector(selectUserData).userReducer;
  const dispatch = useAppDispatch();

  const [editing, setEditing] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>('');

  const handleEditClick = () => {
    const username: string = userData.username!;
    setEditing(true);
    setNewUsername(username);
  };

  const handleSaveClick = async () => {
    try {
      const authToken = localStorage.getItem('authToken') || '';
      const data = await UserApi.changeUsername(newUsername, authToken);
      dispatch(setUserData(data));
      handleCancelClick();
    } catch (e: any) {
      console.log(`Error while Saving new username ${e}`);
      setEditing(false);
    }
  };

  const handleCancelClick = () => {
    const username: string = userData.username!;

    setEditing(false);
    setNewUsername(username);
  };

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        Your email: {userData.email}
      </div>
      <div className={styles.item}>
        {editing ? (
          <>
            Your username:
            <input
              type="text"
              value={newUsername}
              className={`${styles.inputFont} ${styles.inputName}`}
              onChange={(e) => setNewUsername(e.target.value)}
            />
          </>
        ) : (
          `Your username: ${userData.username}`
        )}
        {editing ? (
          <div>
            <button className={styles.buttonState} onClick={handleSaveClick}><CheckIcon className={styles.icon}/></button>
            <button className={styles.buttonState} onClick={handleCancelClick}><ClearIcon className={styles.icon}/></button>
          </div>
        ) : (
          <EditIcon className={`${styles.icon} ${styles.iconMargin}`} onClick={handleEditClick}/>
        )}
      </div>
      <div className={styles.item}>
        Your uniqueId (give it to your friend): {userData.uniqueId}
      </div>
    </div>
  );
};

export default Page;