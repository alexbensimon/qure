import React, { FC, createContext, ReactNode } from 'react';
import { User } from './globalTypes';

type Props = {
  user: User;
  children: ReactNode;
};

export const UserProvider: FC<Props> = ({ user, children }) => (
  <UserContext.Provider value={user}>{children}</UserContext.Provider>
);

export const UserContext = createContext<User | null>(null);
