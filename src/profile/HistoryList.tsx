import firebase from 'firebase';
import React, { Component } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { colors } from '../colors';
import { ChallengeTakenType } from '../globalTypes';
import { HistoryChallenge } from './HistoryChallenge';
import { Coach } from '../Coach';
import { toDate, isBefore } from 'date-fns';

type State = {
  challengesTakenHistory: Array<ChallengeTakenType>;
};

export class HistoryList extends Component<{}, State> {
  state: State = {
    challengesTakenHistory: null,
  };

  componentDidMount() {
    this.fetchData();
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
    const { challengesTakenHistory } = this.state;
    return challengesTakenHistory === null ? null : (
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
  viewContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollViewContainer: {
    paddingTop: 30,
    alignItems: 'stretch',
  },
});
