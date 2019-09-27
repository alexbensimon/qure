import { createStackNavigator } from 'react-navigation-stack';
import { colors } from '../colors';
import { HistoryChallengeDetails } from './HistoryChallengeDetails';
import { HistoryList } from './HistoryList';
import { Profile } from './Profile';

export const ProfileStack = createStackNavigator(
  {
    Profile: {
      screen: Profile,
      navigationOptions: {
        header: null,
        headerBackTitle: 'Profil',
      },
    },
    HistoryList: {
      screen: HistoryList,
      navigationOptions: {
        title: 'Historique',
      },
    },
    HistoryChallengeDetails: {
      screen: HistoryChallengeDetails,
    },
  },
  {
    initialRouteName: 'Profile',
    defaultNavigationOptions: {
      headerBackTitleStyle: {
        fontFamily: 'concert-one-regular',
        color: colors.primary,
      },
      headerTitleStyle: {
        fontFamily: 'concert-one-regular',
        color: colors.dark,
      },
      headerTintColor: colors.primary,
      headerStyle: {
        backgroundColor: colors.white,
      },
    },
  },
);
