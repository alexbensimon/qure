import firebase from 'firebase';
import React, { FC, useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { Login } from './Login';
import TabNavigator from './TabNavigator';

const Root: FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      setLoggedIn(Boolean(user));
    });
  }, []);

  if (loggedIn === null) return null;
  return (
    <>
      <StatusBar barStyle="dark-content" />
      {loggedIn === false ? <Login /> : <TabNavigator />}
    </>
  );
};

export default Root;
