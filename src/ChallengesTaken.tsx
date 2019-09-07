import firebase from 'firebase';
import { FireSQL } from 'firesql';
import React, { Component } from 'react';
import { UserContext } from './UserContext';
import { Challenge } from './globalTypes';
import { ScrollView } from 'react-native';
import { Card } from 'react-native-elements';

type State = {
  challenges: Array<Challenge>;
};

export class ChallengesTaken extends Component<{}, State> {
  static contextType = UserContext;

  state: State = {
    challenges: [],
  };

  async componentDidMount() {
    const fireSQL = new FireSQL(firebase.firestore());
    const challengeIdsObjects = await fireSQL.query(`
      SELECT challengeId
      FROM challengesTakenByUsers
      WHERE userId = '${this.context.uid}'
    `);
    const challengeIds = challengeIdsObjects
      .map(obj => `'${obj.challengeId}'`)
      .join(', ');
    const challenges = (await fireSQL.query(`
      SELECT *
      FROM challenges
      WHERE __name__ IN ( ${challengeIds} )
    `)) as Array<Challenge>;
    this.setState({ challenges });
  }

  render() {
    const { challenges } = this.state;
    return (
      <ScrollView>
        {challenges.map(challenge => (
          <Card title={challenge.title} key={challenge.title}></Card>
        ))}
      </ScrollView>
    );
  }
}
