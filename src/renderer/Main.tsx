import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { Home } from './features/chat/Home';
import { User } from './features/User/User';
import { RootState } from './store/store';

export const Main = (): ReactElement => {
  const user = useSelector((state: RootState) => state.user.username);

  if (!user) {
    return <User />;
  }
  return <Home />;
};
