import firebase from 'firebase';
import React, { FC, useEffect, useRef, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-elements';
import {
  NavigationEventSubscription,
  NavigationInjectedProps,
  withNavigation,
} from 'react-navigation';
import { colors } from '../colors';
import { ChallengeTakenType } from '../globalTypes';
import { ChallengeTaken } from './ChallengeTaken';

type Props = NavigationInjectedProps;

export const RawChallengesTaken: FC<Props> = ({ navigation }) => {
  const [challengesTaken, setChallengesTaken] = useState<
    Array<ChallengeTakenType>
  >(null);
  const [refreshing, setRefreshing] = useState(false);

  const focusListener = useRef<NavigationEventSubscription>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    focusListener.current = navigation.addListener('willFocus', () => {
      fetchData();
    });
    return () => {
      focusListener.current.remove();
    };
  }, [navigation]);

  const fetchData = async () => {
    const querySnapshot = await firebase
      .firestore()
      .collection(`/users/${firebase.auth().currentUser.uid}/challengesTaken`)
      .where('succeed', '==', null)
      .get();
    const challengesTaken = [];
    querySnapshot.forEach(doc => {
      challengesTaken.push({ ...doc.data(), id: doc.id });
    });
    setChallengesTaken(challengesTaken);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const failChallenge = async (id: string) => {
    await firebase
      .firestore()
      .collection(`/users/${firebase.auth().currentUser.uid}/challengesTaken`)
      .doc(id)
      .set({ succeed: false }, { merge: true });
    fetchData();
  };

  return challengesTaken === null ? null : (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <Text h1 style={styles.title}>
        Défis en cours
      </Text>
      {challengesTaken.length > 0 ? (
        challengesTaken.map(challengeTaken => (
          <ChallengeTaken
            key={challengeTaken.id}
            challengeTaken={challengeTaken}
            failChallenge={() => failChallenge(challengeTaken.id)}
            reload={fetchData}
          />
        ))
      ) : (
        <>
          <Button
            title="Je veux relever un défi !"
            onPress={() => navigation.navigate('Découvrir')}
            buttonStyle={styles.button}
            titleStyle={styles.buttonTitle}
            containerStyle={styles.buttonContainer}
          ></Button>
        </>
      )}
    </ScrollView>
  );
};

export const ChallengesTaken = withNavigation(RawChallengesTaken);

const styles = StyleSheet.create({
  title: {
    marginBottom: 30,
    textAlign: 'center',
    color: colors.dark,
    fontFamily: 'concert-one-regular',
  },
  button: {
    backgroundColor: colors.dark,
    borderRadius: 10,
  },
  buttonContainer: {
    marginHorizontal: 10,
  },
  buttonTitle: {
    fontFamily: 'concert-one-regular',
    color: colors.primary,
    fontSize: 32,
  },
});
