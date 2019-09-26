import { createStackNavigator } from 'react-navigation-stack';
import { Home } from './Home';
import { HomeChallenge } from './HomeChallenge';

export const HomeStack = createStackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        title: 'Home',
      },
    },
    Challenge: {
      screen: HomeChallenge,
    },
  },
  {
    initialRouteName: 'Home',
  },
);
