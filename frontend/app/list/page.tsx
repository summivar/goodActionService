'use client';
import React, {FC} from 'react';
import style from './list.module.scss';
import ListItem from '@/components/list/listItem/listItem';
import {useAppSelector} from '@/store/hooks';
import {selectUserData} from '@/store/slices/user';
import ListAddItem from '@/components/list/listAddItem/listAddItem';
import ListFriends from '@/components/list/listFriends/listFriends';

const Page: FC = () => {
  const userData = useAppSelector(selectUserData).userReducer;

  return (
    <div className={style.container}>
      <div>
        <ListAddItem/>
        {userData.goodActions?.map((action, index) => (
          <ListItem
            key={action.id}
            index={index + 1}
            id={action.id}
            creationTime={action.creationTime}
            nameOfAction={action.nameOfAction}
            descriptionOfAction={action.descriptionOfAction}
            addBy={action.addBy}
          />
        ))}
      </div>
      <div>
        <ListFriends/>
      </div>
    </div>
  );
};

export default Page;