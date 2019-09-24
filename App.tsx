import * as Font from 'expo-font';
import React, { Component } from 'react';
import './firebase.config.js';
import Root from './src/Root';

type State = {
  fontLoaded: boolean;
};

export default class App extends Component<{}, State> {
  state: State = {
    fontLoaded: false,
  };

  async componentDidMount() {
    await Font.loadAsync({
      'concert-one-regular': require('./assets/fonts/ConcertOne-Regular.ttf'),
    });
    this.setState({ fontLoaded: true });
  }

  render() {
    const { fontLoaded } = this.state;
    return fontLoaded && <Root />;
  }
}
