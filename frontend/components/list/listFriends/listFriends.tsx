'use client';
import React, {useEffect, useState} from 'react';
import style from './listFriends.module.scss';
import {UserApi} from '@/services/api';
import {Friend} from '@/services/api/types';
import Link from 'next/link';
import CachedIcon from '@mui/icons-material/Cached';

const ListFriends = () => {
  const [loadingText, setLoadingText] = useState<string>('Loading...');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [friends, setFriends] = useState<Friend[]>([]);

  const handleGetFriends = async () => {
    try {
      setIsLoading(true);
      const authToken = localStorage.getItem('authToken') || '';
      const data = await UserApi.getFriends(authToken);
      setFriends(data);

      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setLoadingText('Something went wrong. Failed to get a list of friends. Try again');
    }
  };

  useEffect(() => {
    handleGetFriends();
  }, []);

  return (
    <div className={style.friendContext}>
      <div className={style.headLine}>
        Friends who allowed you access:
        <div>
          <CachedIcon className={style.icon} onClick={handleGetFriends}/>
        </div>
      </div>
      {isLoading ? (
        <>
          {loadingText}
        </>
      ) : (
        <>
          <ul className={style.friendItem}>
            {friends.map((friend: Friend, index: number) => {
              const uniqueId = friend.uniqueId.replace('#', '');
              return (
                <li key={index}>
                  <Link href={`/list/${uniqueId}`}>{friend.email}</Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
};

export default ListFriends;