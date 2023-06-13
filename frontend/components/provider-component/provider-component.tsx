'use client';
import React, {ReactNode} from 'react';
import {Provider} from 'react-redux';
import {store} from '@/store';
import CheckAuth from '@/components/check-auth/check-auth';

interface ComponentProps {
  children: ReactNode;
}

const ProviderComponent: React.FC<ComponentProps> = ({children}) => {
  return (
    <Provider store={store}>
      <CheckAuth/>
      {children}
    </Provider>
  );
};

export default ProviderComponent;