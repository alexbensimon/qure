import firebase from 'firebase';
import { FireSQL } from 'firesql';
import React, { Component } from 'react';
import { Button, Card } from 'react-native-elements';
import { Challenge } from '../globalTypes';
import { NavigationScreenProps } from 'react-navigation';

type Props = NavigationScreenProps;

type State = {
  challenges: Array<Challenge>;
};

export class DiscoverChallenges extends Component<Props, State> {
  state: State = {
    challenges: [],
  };

  async componentDidMount() {
    const topic: Challenge['topic'] = this.props.navigation.getParam('topic');
    const fireSQL = new FireSQL(firebase.firestore());
    const challenges = (await fireSQL.query(
      `
      SELECT *
      FROM challenges
      WHERE topic = '${topic}'
    `,
      { includeId: 'id' },
    )) as Array<Challenge>;
    this.setState({ challenges });
  }

  render() {
    const { navigation } = this.props;
    const { challenges } = this.state;
    return (
      <>
        {challenges.map(challenge => (
          <Card title={challenge.title} key={challenge.title}>
            <Button
              title="+"
              onPress={() => navigation.push('Challenge', { challenge })}
            ></Button>
          </Card>
        ))}
      </>
    );
  }
}
