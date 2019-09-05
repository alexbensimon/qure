import React, { FC, createContext, ReactNode } from 'react';

type Props = {
  userName: string;
  children: ReactNode;
};

export const UserProvider: FC<Props> = ({ userName, children }) => (
  <UserContext.Provider value={{ userName }}>{children}</UserContext.Provider>
);

export const UserContext = createContext<{
  userName?: string;
}>({});
