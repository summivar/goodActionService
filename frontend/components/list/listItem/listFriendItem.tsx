import React, {ChangeEvent, FC} from 'react';
import styles from '@/components/list/listItem/listItem.module.scss';

interface ListItemProps {
  index: number;
  id: string;
  creationTime: string;
  nameOfAction: string;
  descriptionOfAction: string;
  addBy: string;
}

const ListFriendItem: FC<ListItemProps> = ({index, id, creationTime, nameOfAction, descriptionOfAction, addBy}) => {
  return (
    <div>
      <div className={styles.item}>
        <h3>ID: {index}</h3>
      </div>
      <div className={styles.item}>
        <p className={styles.text}>Creation Time: {creationTime}</p>
      </div>
      <div className={styles.item}>
        <p className={styles.text}>Name Of Action: {nameOfAction}</p>
      </div>
      <div className={styles.item}>
        <p className={styles.text}>Description Of Action: {descriptionOfAction}</p>
      </div>
      <div className={styles.item}>
        <p className={styles.text}>Added By: {addBy}</p>
      </div>
    </div>
  );
};

export default ListFriendItem;