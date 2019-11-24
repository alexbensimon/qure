import { ScreenOrientation } from 'expo';
import * as Font from 'expo-font';
import { OrientationLock } from 'expo/build/ScreenOrientation/ScreenOrientation';
import React, { FC, useEffect, useState } from 'react';
import { Dimensions, YellowBox } from 'react-native';
import './firebase.config.js';
import Root from './src/Root';

const App: FC = () => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    (async () => {
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
      setFontLoaded(true);
    })();
  }, []);

  return fontLoaded && <Root />;
};

export default App;
