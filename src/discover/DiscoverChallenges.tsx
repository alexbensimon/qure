import firebase from 'firebase';
import { FireSQL } from 'firesql';
import React, { Component } from 'react';
import { Button, Card } from 'react-native-elements';
import { Challenge } from '../globalTypes';
import { ChallengeInfo } from './ChallengeInfo';

type Props = {
  topic: Challenge['topic'];
};

type State = {
  challenges: Array<Challenge>;
  currentChallenge: Challenge | null;
};

export class DiscoverChallenges extends Component<Props, State> {
  state: State = {
    challenges: [],
    currentChallenge: null,
  };

  async componentDidMount() {
    const fireSQL = new FireSQL(firebase.firestore());
    const challenges = (await fireSQL.query(
      `
      SELECT *
      FROM challenges
      WHERE topic = '${this.props.topic}'
    `,
      { includeId: 'id' },
    )) as Array<Challenge>;
    this.setState({ challenges });
  }

  render() {
    const { topic } = this.props;
    const { challenges, currentChallenge } = this.state;
    return (
      <>
        {!currentChallenge && (
          <Card title={`Catégorie : ${topic}`}>
            {challenges.map(challenge => (
              <Card title={challenge.title} key={challenge.title}>
                <Button
                  title="+"
                  onPress={() => this.setState({ currentChallenge: challenge })}
                ></Button>
              </Card>
            ))}
          </Card>
        )}
        {!!currentChallenge && (
          <>
            <Button
              title="Challenges"
              onPress={() => this.setState({ currentChallenge: null })}
            ></Button>
            <ChallengeInfo challenge={currentChallenge} />
          </>
        )}
      </>
    );
  }
}
