import { ScreenOrientation } from 'expo';
import * as Font from 'expo-font';
import React, { Component } from 'react';
import { YellowBox, Dimensions } from 'react-native';
import './firebase.config.js';
import Root from './src/Root';
import { OrientationLock } from 'expo/build/ScreenOrientation/ScreenOrientation';

type State = {
  fontLoaded: boolean;
};

export default class App extends Component<{}, State> {
  state: State = {
    fontLoaded: false,
  };

  async componentDidMount() {
    YellowBox.ignoreWarnings(['Setting a timer']);

    const deviceWidth = Dimensions.get('window').width;
    if (deviceWidth < 500) {
      ScreenOrientation.lockAsync(OrientationLock.PORTRAIT);
    } else {
      // To allow the landscape view on tablet
      ScreenOrientation.unlockAsync();
    }

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
