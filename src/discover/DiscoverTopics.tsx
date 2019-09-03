import firebase from 'firebase';
import { FireSQL } from 'firesql';
import React, { Component } from 'react';
import { Button, Card } from 'react-native-elements';
import { Challenge } from '../globalTypes';
import { DiscoverTopic } from './DiscoverTopic';

type State = {
  topics: Array<Challenge['topic']>;
  currentTopic: Challenge['topic'];
};

export class DiscoverTopics extends Component<{}, State> {
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
    const { topics, currentTopic } = this.state;
    return (
      <>
        {!currentTopic && (
          <Card title="Catégories">
            {topics.map(topic => (
              <Card title={topic} key={topic}>
                <Button
                  title="+"
                  onPress={() => this.setState({ currentTopic: topic })}
                ></Button>
              </Card>
            ))}
          </Card>
        )}
        {!!currentTopic && (
          <>
            <Button
              title="Catégories"
              onPress={() => this.setState({ currentTopic: '' })}
            ></Button>
            <DiscoverTopic topic={currentTopic} />
          </>
        )}
      </>
    );
  }
}
