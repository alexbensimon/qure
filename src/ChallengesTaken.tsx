import firebase from 'firebase';
import { FireSQL } from 'firesql';
import React, { Component } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import { ChallengeTaken } from './ChallengeTaken';
import { Challenge, ChallengeTakenType } from './globalTypes';
import { UserContext } from './UserContext';

type State = {
  challenges: Array<Challenge>;
  challengesTaken: Array<ChallengeTakenType>;
};

export class ChallengesTaken extends Component<{}, State> {
  static contextType = UserContext;

  state: State = {
    challenges: [],
    challengesTaken: [],
  };

  async componentDidMount() {
    await this.fetchData();
  }

  fetchData = async () => {
    const fireSQL = new FireSQL(firebase.firestore());
    const challengeIdsObjects = (await fireSQL.query(
      `
      SELECT *
      FROM challengesTakenByUsers
      WHERE userId = '${this.context.uid}' AND done = false
    `,
      { includeId: 'id' },
    )) as State['challengesTaken'];
    if (challengeIdsObjects.length > 0) {
      const challengeIds = challengeIdsObjects
        .map(obj => `'${obj.challengeId}'`)
        .join(', ');
      const challenges = (await fireSQL.query(
        `
        SELECT *
        FROM challenges
        WHERE __name__ IN ( ${challengeIds} )
      `,
        { includeId: 'id' },
      )) as Array<Challenge>;
      this.setState({ challenges, challengesTaken: challengeIdsObjects });
    } else {
      this.setState({ challenges: [] });
    }
  };

  removeChallenge = async (challengeId: string) => {
    const fireSQL = new FireSQL(firebase.firestore());
    const res = await fireSQL.query(
      `
      SELECT *
      FROM challengesTakenByUsers
      WHERE userId = '${this.context.uid}' AND challengeId = '${challengeId}'
    `,
      { includeId: 'id' },
    );
    const { id } = res[0];
    await firebase
      .firestore()
      .collection('challengesTakenByUsers')
      .doc(id)
      .delete();
    this.fetchData();
  };

  render() {
    const { challenges, challengesTaken } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView>
          {challenges.map(challenge => (
            <ChallengeTaken
              key={challenge.id}
              challenge={challenge}
              challengeTaken={challengesTaken.find(
                challengeTaken => challengeTaken.challengeId === challenge.id,
              )}
              removeChallenge={this.removeChallenge}
            />
          ))}
        </ScrollView>
        <Button title="🙏" onPress={this.fetchData}></Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
  },
});
