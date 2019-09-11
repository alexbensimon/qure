import firebase from 'firebase';
import { FireSQL } from 'firesql';
import React, { Component } from 'react';
import { Button, Card } from 'react-native-elements';
import { Challenge } from '../globalTypes';
import { NavigationScreenProps } from 'react-navigation';

type State = {
  topics: Array<Challenge['topic']>;
  currentTopic: Challenge['topic'];
};

type Props = NavigationScreenProps;

export class DiscoverTopics extends Component<Props, State> {
  state: State = {
    topics: [],
    currentTopic: '',
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
    const { topics, currentTopic } = this.state;
    return (
      <>
        {!currentTopic && (
          <>
            {topics.map(topic => (
              <Card title={topic} key={topic}>
                <Button
                  title="+"
                  onPress={() => navigation.push('Challenges', { topic })}
                ></Button>
              </Card>
            ))}
          </>
        )}
      </>
    );
  }
}
