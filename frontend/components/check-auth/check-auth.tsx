import React, {useEffect} from 'react';
import {useAppDispatch} from '@/store/hooks';
import {UserApi} from '@/services/api';
import {setUserData} from '@/store/slices/user';
import {useRouter} from 'next/navigation';

const CheckAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  useEffect(() => {
    const checkAuth = async (refToken: string) => {
      try {
        const data = await UserApi.checkAuth(refToken);

        localStorage.setItem('authToken', data.tokens.accessToken);
        localStorage.setItem('refToken', data.tokens.refreshToken);
        dispatch(setUserData(data));

        await router.push('/myAccount');
      } catch (e) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refToken');

        await router.push('/signIn');
      }
    };

    if (localStorage.getItem('refToken')) {
      const refToken = localStorage.getItem('refToken')!;
      checkAuth(refToken);
    }
  }, []);
  return (
    <></>
  );
};

export default CheckAuth;