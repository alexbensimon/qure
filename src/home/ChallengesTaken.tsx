import firebase from 'firebase';
import React, { Component } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import { colors } from '../colors';
import { ChallengeTakenType } from '../globalTypes';
import { ChallengeTaken } from './ChallengeTaken';

type State = {
  challengesTaken: Array<ChallengeTakenType>;
  refreshing: boolean;
};

export class ChallengesTaken extends Component<{}, State> {
  state: State = {
    refreshing: false,
    challengesTaken: [],
  };

  async componentDidMount() {
    await this.fetchData();
  }

  fetchData = async () => {
    const querySnapshot = await firebase
      .firestore()
      .collection(`/users/${firebase.auth().currentUser.uid}/challengesTaken`)
      .where('succeed', '==', null)
      .get();
    const challengesTaken = [];
    querySnapshot.forEach(doc => {
      challengesTaken.push({ ...doc.data(), id: doc.id });
    });
    this.setState({ challengesTaken });
  };

  handleRefresh = async () => {
    this.setState({ refreshing: true });
    await this.fetchData();
    this.setState({ refreshing: false });
  };

  failChallenge = async (id: string) => {
    await firebase
      .firestore()
      .collection(`/users/${firebase.auth().currentUser.uid}/challengesTaken`)
      .doc(id)
      .set({ succeed: false }, { merge: true });
    this.fetchData();
  };

  render() {
    const { challengesTaken, refreshing } = this.state;
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={this.handleRefresh}
          />
        }
      >
        <Text h1 style={styles.title}>
          Défis en cours
        </Text>
        {challengesTaken.map(challengeTaken => (
          <ChallengeTaken
            key={challengeTaken.id}
            challengeTaken={challengeTaken}
            failChallenge={() => this.failChallenge(challengeTaken.id)}
            reload={this.fetchData}
          />
        ))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 30,
    textAlign: 'center',
    color: colors.dark,
    fontFamily: 'concert-one-regular',
  },
});
