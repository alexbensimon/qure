import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { UserContext } from './UserContext';
import { FireSQL } from 'firesql';
import firebase from 'firebase';
import { Challenge } from './globalTypes';
import { Text } from 'react-native-elements';

type State = {
  challengesSucceed: Array<Challenge>;
};

export class Community extends Component<{}, State> {
  static contextType = UserContext;

  state: State = {
    challengesSucceed: [],
  };

  async componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    const fireSQL = new FireSQL(firebase.firestore());
    const challengeIdsObjects = await fireSQL.query(
      `
      SELECT challengeId
      FROM challengesTakenByUsers
      WHERE userId = '${this.context.uid}' AND done = true
    `,
    );
    if (challengeIdsObjects.length > 0) {
      const challengeIds = challengeIdsObjects
        .map(obj => `'${obj.challengeId}'`)
        .join(', ');
      const challengesSucceed = (await fireSQL.query(
        `
        SELECT *
        FROM challenges
        WHERE __name__ IN ( ${challengeIds} )
      `,
        { includeId: 'id' },
      )) as Array<Challenge>;
      this.setState({ challengesSucceed });
    } else {
      this.setState({ challengesSucceed: [] });
    }
  };

  render() {
    const { challengesSucceed } = this.state;
    return (
      <View style={styles.container}>
        {/* <Text h3>
          Points :{' '}
          {challengesSucceed.reduce(
            (previousValue, currentValue) => previousValue + currentValue.level,
            0,
          )}
        </Text> */}
        <Text h3 style={styles.title}>
          Classement des amis
        </Text>
        <Text h4>1. Victoria Launay : 10</Text>
        <Text h4>2. Pierre Lahmi : 7</Text>
        <Text h4>3. Alexandre Bensimon : 4</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: 30,
  },
});
