import firebase from 'firebase';
import React, { Component } from 'react';
import { User } from './globalTypes';
import { Login } from './Login';
import TabNavigator from './TabNavigator';
import { UserProvider } from './UserContext';

type State = {
  loggedIn: boolean;
  user: User | null;
};

export default class Root extends Component<{}, State> {
  state: State = {
    loggedIn: false,
    user: null,
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ user, loggedIn: Boolean(user) });
    });
  }

  render() {
    const { loggedIn, user } = this.state;
    return loggedIn ? (
      <UserProvider user={user}>
        <TabNavigator />
      </UserProvider>
    ) : (
      <Login />
    );
  }
}
