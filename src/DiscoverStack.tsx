import { createStackNavigator } from 'react-navigation-stack';
import { DiscoverChallenge } from './discover/DiscoverChallenge';
import { DiscoverChallenges } from './discover/DiscoverChallenges';
import { DiscoverTopics } from './discover/DiscoverTopics';

export const DiscoverStack = createStackNavigator(
  {
    Topics: {
      screen: DiscoverTopics,
      navigationOptions: {
        title: 'Catégories',
      },
    },
    Challenges: {
      screen: DiscoverChallenges,
      navigationOptions: ({ navigation }) => ({
        title: `${navigation.state.params.topic} : défis`,
      }),
    },
    Challenge: {
      screen: DiscoverChallenge,
    },
  },
  {
    initialRouteName: 'Topics',
  },
);
