import firebase from 'firebase';
import { FireSQL } from 'firesql';
import React, { Component } from 'react';
import { UserContext } from './UserContext';
import { Challenge } from './globalTypes';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Card, Button } from 'react-native-elements';

type State = {
  challenges: Array<Challenge>;
};

export class ChallengesTaken extends Component<{}, State> {
  static contextType = UserContext;

  state: State = {
    challenges: [],
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    const fireSQL = new FireSQL(firebase.firestore());
    const challengeIdsObjects = await fireSQL.query(`
      SELECT challengeId
      FROM challengesTakenByUsers
      WHERE userId = '${this.context.uid}'
    `);
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
      this.setState({ challenges });
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
    const { challenges } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView>
          {challenges.map(challenge => (
            <Card title={challenge.title} key={challenge.title}>
              <Button
                title="🔴"
                onPress={() => this.removeChallenge(challenge.id)}
              ></Button>
            </Card>
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
