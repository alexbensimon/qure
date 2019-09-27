import firebase from 'firebase';
import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native';
import { colors } from '../colors';
import { ChallengeTakenType } from '../globalTypes';
import { HistoryChallenge } from './HistoryChallenge';
import { Coach } from '../Coach';
import { toDate, isBefore } from 'date-fns';

type State = {
  challengesTakenHistory: Array<ChallengeTakenType>;
  isLoading: boolean;
};

export class HistoryList extends Component<{}, State> {
  state: State = {
    challengesTakenHistory: null,
    isLoading: true,
  };

  async componentDidMount() {
    this.setState({ isLoading: true });
    await this.fetchData();
    this.setState({ isLoading: false });
  }

  fetchData = async () => {
    const challengesTakenHistory: Array<ChallengeTakenType> = [];
    const collection = firebase
      .firestore()
      .collection(`/users/${firebase.auth().currentUser.uid}/challengesTaken`);
    const challengesSuccessPromise = collection
      .where('succeed', '==', true)
      .get();
    const challengesFailPromise = collection
      .where('succeed', '==', false)
      .get();
    const [succeedQuerySnapshot, failQuerySnapshot] = await Promise.all([
      challengesSuccessPromise,
      challengesFailPromise,
    ]);
    succeedQuerySnapshot.forEach(doc => {
      challengesTakenHistory.push({
        ...doc.data(),
        id: doc.id,
      } as ChallengeTakenType);
    });
    failQuerySnapshot.forEach(doc => {
      challengesTakenHistory.push({
        ...doc.data(),
        id: doc.id,
      } as ChallengeTakenType);
    });
    const challengesTakenHistorySorted = challengesTakenHistory.sort(
      (challenge1, challenge2) => {
        return isBefore(
          toDate(challenge1.timestamp),
          toDate(challenge2.timestamp),
        )
          ? 1
          : -1;
      },
    );

    this.setState({ challengesTakenHistory: challengesTakenHistorySorted });
  };

  render() {
    const { challengesTakenHistory, isLoading } = this.state;
    return isLoading ? (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    ) : (
      <>
        <View style={styles.viewContainer}>
          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            {challengesTakenHistory.map(challengeTaken => (
              <HistoryChallenge
                key={challengeTaken.id}
                challengeTaken={challengeTaken}
              />
            ))}
          </ScrollView>
        </View>
        <Coach sentences={['Bienvenue dans ton historique !']} />
      </>
    );
  }
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollViewContainer: {
    paddingTop: 30,
    alignItems: 'stretch',
  },
});
