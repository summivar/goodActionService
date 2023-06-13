'use client'

import styles from './listId.module.scss';
import ListFriendItem from '@/components/list/listItem/listFriendItem';
import {useEffect, useState} from 'react';
import {FriendGoodActionsWithData} from '@/services/api/types';
import {GoodActionApi, } from '@/services/api';
import {useRouter} from 'next/navigation';

type Props = {
  params: {
    id: string;
  };
};

export default function ListFriend({params: {id}}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<FriendGoodActionsWithData | null>(null);

  const router = useRouter();
  const handleGetActions = async () => {
    try {
      setIsLoading(true);
      const authToken = localStorage.getItem('authToken') || '';
      const data = await GoodActionApi.getActionsFriend(id, authToken);
      setData(data);

      setIsLoading(false);
    } catch (e) {
      console.log(e);
      router.push('/list');
    }
  }

  useEffect(() => {
    handleGetActions();
  }, [])

  return (
    <div className={styles.container}>
      {
        isLoading ? (
          <>
            Loading...
          </>
        ) : (
          <div>
            <div>Email: {data?.email}</div>
            <div>UniqueId: {data?.uniqueId}</div>
            {data?.goodActions?.map((item, index: number) => {
              return (
                <ListFriendItem key={index} index={index} id={item.id} creationTime={item.creationTime}
                                nameOfAction={item.nameOfAction} descriptionOfAction={item.descriptionOfAction}
                                addBy={item.addBy}
                />
              );
            })}
          </div>
        )
      }
    </div>
  );
}