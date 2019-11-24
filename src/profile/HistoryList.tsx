import { isBefore, toDate } from 'date-fns';
import firebase from 'firebase';
import React, { FC, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { Coach } from '../Coach';
import { colors } from '../colors';
import { ChallengeTakenType } from '../globalTypes';
import { HistoryChallenge } from './HistoryChallenge';

export const HistoryList: FC = () => {
  const [challengesTakenHistory, setChallengesTakenHistory] = useState<
    Array<ChallengeTakenType>
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await fetchData();
      setIsLoading(false);
    })();
  }, []);

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
};

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
