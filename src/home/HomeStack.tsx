import { createStackNavigator } from 'react-navigation-stack';
import { Home } from './Home';
import { HomeChallenge } from './HomeChallenge';
import { colors } from '../colors';

export const HomeStack = createStackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        header: null,
        headerBackTitle: 'Home',
      },
    },
    Challenge: {
      screen: HomeChallenge,
    },
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      headerBackTitleStyle: {
        fontFamily: 'concert-one-regular',
        color: colors.primary,
      },
      headerTintColor: colors.primary,
      headerStyle: {
        backgroundColor: colors.white,
      },
    },
  },
);
