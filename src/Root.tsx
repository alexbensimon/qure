import firebase from 'firebase';
import React, { Component } from 'react';
import { Login } from './Login';
import TabNavigator from './TabNavigator';
import { StatusBar } from 'react-native';

type State = {
  loggedIn: boolean | null;
};

export default class Root extends Component<{}, State> {
  state: State = {
    loggedIn: null,
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ loggedIn: Boolean(user) });
    });
  }

  render() {
    const { loggedIn } = this.state;
    if (loggedIn === null) return null;
    return (
      <>
        <StatusBar barStyle="dark-content" />
        {loggedIn === false ? <Login /> : <TabNavigator />}
      </>
    );
  }
}
