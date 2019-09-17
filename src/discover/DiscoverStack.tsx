import { createStackNavigator } from 'react-navigation-stack';
import { DiscoverChallenge } from './DiscoverChallenge';
import { DiscoverChallenges } from './DiscoverChallenges';
import { DiscoverTopics } from './DiscoverTopics';

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
