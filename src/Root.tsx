import firebase from 'firebase';
import React, { Component } from 'react';
import { User } from './globalTypes';
import { Login } from './Login';
import TabNavigator from './TabNavigator';
import { UserProvider } from './UserContext';

type State = {
  loggedIn: boolean | null;
  user: User | null;
};

export default class Root extends Component<{}, State> {
  state: State = {
    loggedIn: null,
    user: null,
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ user, loggedIn: Boolean(user) });
      console.log('TCL: Root -> componentDidMount -> user', user);
    });
  }

  render() {
    const { loggedIn, user } = this.state;
    if (loggedIn === null && user === null) return null;
    return loggedIn === false ? (
      <Login />
    ) : (
      <UserProvider user={user}>
        <TabNavigator />
      </UserProvider>
    );
  }
}
