import React, { Component } from 'react';
import TabNavigator from './TabNavigator';
import { Login } from './Login';
import { UserProvider } from './UserContext';

type State = {
  loggedIn: boolean;
  userName: string;
};

export default class Root extends Component<{}, State> {
  state: State = {
    loggedIn: false,
    userName: '',
  };

  logIn = (userName: string) => {
    this.setState({ loggedIn: true, userName });
  };

  render() {
    const { loggedIn, userName } = this.state;
    return loggedIn ? (
      <UserProvider userName={userName}>
        <TabNavigator />
      </UserProvider>
    ) : (
      <Login logIn={this.logIn} />
    );
  }
}
