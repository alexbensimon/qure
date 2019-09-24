import * as Font from 'expo-font';
import React, { Component } from 'react';
import './firebase.config.js';
import Root from './src/Root';

export default class App extends Component {
  componentDidMount() {
    Font.loadAsync({
      'concert-one-regular': require('./assets/fonts/ConcertOne-Regular.ttf'),
    });
  }

  render() {
    return <Root />;
  }
}
