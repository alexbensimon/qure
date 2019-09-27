import { createStackNavigator } from 'react-navigation-stack';
import { DiscoverChallenge } from './DiscoverChallenge';
import { DiscoverChallenges } from './DiscoverChallenges';
import { DiscoverTopics } from './DiscoverTopics';
import { colors } from '../colors';

export const DiscoverStack = createStackNavigator(
  {
    Topics: {
      screen: DiscoverTopics,
      navigationOptions: {
        title: 'Catégories',
      },
    },
    DiscoverChallenges: {
      screen: DiscoverChallenges,
      navigationOptions: ({ navigation }) => ({
        title: navigation.state.params.topic,
      }),
    },
    DiscoverChallenge: {
      screen: DiscoverChallenge,
    },
  },
  {
    initialRouteName: 'Topics',
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
