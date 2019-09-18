import firebase from 'firebase';
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { NavigationScreenProps, ScrollView } from 'react-navigation';
import { Challenge } from '../globalTypes';

type Props = NavigationScreenProps;

type State = {
  challenges: Array<Challenge>;
};

export class DiscoverChallenges extends Component<Props, State> {
  state: State = {
    challenges: [],
  };

  async componentDidMount() {
    const topic: Challenge['topics'][0] = this.props.navigation.getParam(
      'topic',
    );
    const querySnapshot = await firebase
      .firestore()
      .collection('challenges')
      .where('topics', 'array-contains', topic)
      .get();
    const challenges = [];
    querySnapshot.forEach(doc => {
      challenges.push({ ...doc.data(), id: doc.id });
    });

    this.setState({ challenges });
  }

  render() {
    const { navigation } = this.props;
    const { challenges } = this.state;
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {challenges.map(challenge => (
          <Button
            title={challenge.title}
            key={challenge.id}
            onPress={() => navigation.push('Challenge', { challenge })}
            buttonStyle={styles.challenge}
          ></Button>
        ))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
  },
  challenge: {
    marginTop: 40,
    height: 100,
    marginRight: 10,
    marginLeft: 10,
  },
});
