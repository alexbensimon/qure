import * as Font from 'expo-font';
import React, { Component } from 'react';
import './firebase.config.js';
import Root from './src/Root';
import { YellowBox } from 'react-native';

type State = {
  fontLoaded: boolean;
};

export default class App extends Component<{}, State> {
  state: State = {
    fontLoaded: false,
  };

  async componentDidMount() {
    YellowBox.ignoreWarnings(['Setting a timer']);
    // eslint-disable-next-line no-console
    console.ignoredYellowBox = ['Setting a timer'];
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
