'use client';
import React, {ChangeEvent, FC, useState} from 'react';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from './listItem.module.scss';
import {GoodActionApi} from '@/services/api';
import {useAppSelector} from '@/store/hooks';
import {selectUserData, setGoodActions} from '@/store/slices/user';
import {useDispatch} from 'react-redux';

interface ListItemProps {
  index: number;
  id: string;
  creationTime: string;
  nameOfAction: string;
  descriptionOfAction: string;
  addBy: string;
}

const ListItem: FC<ListItemProps> = ({index, id, creationTime, nameOfAction, descriptionOfAction, addBy}) => {
  const [editedName, setEditedName] = useState(nameOfAction);
  const [editedDescription, setEditedDescription] = useState(descriptionOfAction);
  const [isEditing, setIsEditing] = useState(false);

  const userData = useAppSelector(selectUserData).userReducer;
  const dispatch = useDispatch();

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const authToken = localStorage.getItem('authToken') || '';
      const data = await GoodActionApi.update({
        id: id,
        newNameOfAction: editedName,
        newDescriptionOfAction: editedDescription
      }, authToken);

      setIsEditing(false);
    } catch (e) {
      console.log(e);
      setEditedName(nameOfAction);
      setEditedDescription(descriptionOfAction);
      setIsEditing(false);
    }
  };

  const handleCancelClick = () => {
    setEditedName(nameOfAction);
    setEditedDescription(descriptionOfAction);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      const authToken = localStorage.getItem('authToken') || '';
      const data = await GoodActionApi.delete(id, authToken);

      const updatedGoodActions = userData.goodActions?.filter((action) => action.id !== id)!;
      dispatch(setGoodActions(updatedGoodActions));

    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div>
      <div className={styles.item}>
        <h3>ID: {index}</h3>
        {isEditing ? (
          <>
            <button onClick={handleSaveClick} className={styles.buttonState}><CheckIcon className={styles.icon}/></button>
            <button onClick={handleCancelClick} className={styles.buttonState}><ClearIcon className={styles.icon}/></button>
          </>
        ) : (
          <EditIcon className={`${styles.icon} ${styles.iconMargin}`} onClick={handleEditClick}/>
        )}
        <DeleteIcon className={`${styles.icon} ${styles.iconMargin}`} onClick={handleDelete}/>
      </div>
      <div className={styles.item}>
        <p className={styles.text}>Creation Time: {creationTime}</p>
      </div>
      <div className={styles.item}>
        {isEditing ? (
          <>
            Name Of Action:
            <input type="text" value={editedName} className={styles.inputList}
                   onChange={(event: ChangeEvent<HTMLInputElement>) => setEditedName(event.target.value)}/>
          </>
        ) : (
          <p className={styles.text}>Name Of Action: {editedName}</p>
        )}
      </div>
      <div className={styles.item}>
        {isEditing ? (
          <>
            Description Of Action:
            <input type="text" value={editedDescription} className={`${styles.inputList} ${styles.text}`}
                   onChange={(event: ChangeEvent<HTMLInputElement>) => setEditedDescription(event.target.value)}/>
          </>
        ) : (
          <p className={styles.text}>Description Of Action: {editedDescription}</p>
        )}
      </div>
      <div className={styles.item}>
        <p className={styles.text}>Added By: {addBy}</p>
      </div>
    </div>
  );
};

export default ListItem;