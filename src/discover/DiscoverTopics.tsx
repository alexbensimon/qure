import firebase from 'firebase';
import { FireSQL } from 'firesql';
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { NavigationScreenProps, ScrollView } from 'react-navigation';
import { Challenge } from '../globalTypes';

type State = {
  topics: Array<Challenge['topic']>;
};

type Props = NavigationScreenProps;

export class DiscoverTopics extends Component<Props, State> {
  state: State = {
    topics: [],
  };

  async componentDidMount() {
    const fireSQL = new FireSQL(firebase.firestore());
    const challenges = (await fireSQL.query(`
      SELECT topic
      FROM challenges
    `)) as Array<Challenge>;
    const topics = Array.from(
      new Set(challenges.map(challenge => challenge.topic)),
    );
    this.setState({ topics });
  }

  render() {
    const { navigation } = this.props;
    const { topics } = this.state;
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {topics.map(topic => (
          <Button
            title={topic}
            key={topic}
            onPress={() => navigation.push('Challenges', { topic })}
            buttonStyle={styles.topic}
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
  topic: {
    marginTop: 40,
    height: 100,
    marginRight: 10,
    marginLeft: 10,
  },
});
