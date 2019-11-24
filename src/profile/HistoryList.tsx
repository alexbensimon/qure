import { isBefore, toDate } from 'date-fns';
import firebase from 'firebase';
import React, { FC, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Coach } from '../Coach';
import { colors } from '../colors';
import { PageLoader } from '../components/PageLoader';
import { useLoader } from '../custom-hooks/useLoader';
import { ChallengeTakenType } from '../globalTypes';
import { HistoryChallenge } from './HistoryChallenge';

export const HistoryList: FC = () => {
  const [challengesTakenHistory, setChallengesTakenHistory] = useState<
    Array<ChallengeTakenType>
  >(null);

  const fetchData = async () => {
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
    setChallengesTakenHistory(challengesTakenHistorySorted);
  };

  const isLoading = useLoader(fetchData);

  return isLoading ? (
    <PageLoader />
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
};

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
