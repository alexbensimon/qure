import firebase from 'firebase';
import React, { FC, useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-elements';
import {
  NavigationInjectedProps,
  ScrollView,
  withNavigation,
} from 'react-navigation';
import { Coach } from './Coach';
import { colors } from './colors';
import { Challenge } from './globalTypes';

type Props = {
  challengeId: Challenge['id'];
} & NavigationInjectedProps;

const RawChallengeDetails: FC<Props> = ({ challengeId, navigation }) => {
  const [challenge, setChallenge] = useState<Challenge>(null);
  const [challengeTaken, setChallengeTaken] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      // Fetch challenge details
      const challengePromise = firebase
        .firestore()
        .collection('challenges')
        .doc(challengeId)
        .get();

      // Fetch challenges taken
      const challengeTakenPromise = firebase
        .firestore()
        .collection(`users/${firebase.auth().currentUser.uid}/challengesTaken`)
        .where('challengeId', '==', challengeId)
        .where('succeed', '==', null)
        .limit(1)
        .get();

      const [challengeDoc, challengeTakenQuerySnapshot] = await Promise.all([
        challengePromise,
        challengeTakenPromise,
      ]);

      const sameChallengeTaken = [];
      challengeTakenQuerySnapshot.forEach(doc => {
        sameChallengeTaken.push(doc.id);
      });

      setChallenge(challengeDoc.data() as Challenge);
      setChallengeTaken(sameChallengeTaken.length > 0);
    })();
  }, [challengeId]);

  const tryTakeChallenge = async () => {
    const querySnapshot = await firebase
      .firestore()
      .collection(`users/${firebase.auth().currentUser.uid}/challengesTaken`)
      .where('succeed', '==', null)
      .get();
    const currentChallengesTaken = [];
    querySnapshot.forEach(doc => {
      currentChallengesTaken.push(doc.id);
    });
    if (currentChallengesTaken.length >= 3) {
      showWarning();
    } else {
      takeChallenge();
    }
  };

  const showWarning = () => {
    Alert.alert(
      '🙅‍',
      'Tu ne peux pas relever plus de 3 challenges en même temps. Fais nous confiance, tu auras de meilleurs résultats.',
      [
        {
          text: 'Ok',
        },
      ],
    );
  };

  const takeChallenge = () => {
    setChallengeTaken(true);
    firebase
      .firestore()
      .collection(`users/${firebase.auth().currentUser.uid}/challengesTaken`)
      .add({
        challengeId,
        timestamp: Date.now(),
        succeed: null,
        level: challenge.level,
        title: challenge.title,
        duration: challenge.duration,
        subTitle: challenge.subTitle,
      });
    navigation.navigate('Home');
  };

  if (!challenge) return null;

  return (
    <>
      <View style={styles.viewContainer}>
        <ScrollView>
          <View style={styles.card}>
            <Text h4 style={styles.indicator}>
              Défi
            </Text>
            <Text h1 style={styles.item}>
              {challenge.title}
            </Text>
            <Text h4 style={styles.indicator}>
              Objectif
            </Text>
            <Text h2 style={styles.item}>
              {challenge.subTitle}
            </Text>
            <Text h4 style={styles.indicator}>
              Pourquoi ?
            </Text>
            <Text h4 style={styles.description}>
              {challenge.description}
            </Text>
            <Text h4 style={styles.indicator}>
              Règles
            </Text>
            {challenge.rules.map(
              rule =>
                !!rule && (
                  <Text h4 key={rule} style={styles.rule}>
                    👉 {rule}
                  </Text>
                ),
            )}
            <Text style={styles.item}></Text>
            <Text h4 style={styles.indicator}>
              Difficulté
            </Text>
            <Text h2 style={styles.item}>
              {challenge.level} point{challenge.level > 1 && 's'}
            </Text>
            <Text h4 style={styles.indicator}>
              Durée
            </Text>
            <Text h2 style={styles.item}>
              {challenge.duration} jour{challenge.duration > 1 && 's'}
            </Text>
          </View>
          <View style={styles.challengeTakenContainer}>
            {challengeTaken === false && (
              <Button
                title="Je relève le défi !"
                onPress={tryTakeChallenge}
                buttonStyle={styles.button}
                titleStyle={styles.takeChallengeButtonTitle}
              ></Button>
            )}
            {challengeTaken === true && (
              <Button
                title="Défi en cours..."
                onPress={() => navigation.navigate('Home')}
                buttonStyle={styles.button}
                titleStyle={styles.currentChallengeButtonTitle}
              ></Button>
            )}
          </View>
        </ScrollView>
      </View>
      <Coach sentences={[`J'adore le challenge ${challenge.title}`]} />
    </>
  );
};

export const ChallengeDetails = withNavigation(RawChallengeDetails);

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  card: {
    backgroundColor: colors.dark,
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  indicator: {
    fontFamily: 'concert-one-regular',
    alignSelf: 'flex-start',
    color: colors.alert,
  },
  item: {
    fontFamily: 'concert-one-regular',
    color: colors.primary,
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'concert-one-regular',
    color: colors.primary,
    marginBottom: 15,
    textAlign: 'left',
    alignSelf: 'flex-start',
    paddingLeft: 10,
  },
  rule: {
    fontFamily: 'concert-one-regular',
    color: colors.primary,
    alignSelf: 'flex-start',
    paddingLeft: 10,
  },
  challengeTakenContainer: {
    alignSelf: 'stretch',
  },
  button: {
    backgroundColor: colors.light,
  },
  takeChallengeButtonTitle: {
    color: colors.primary,
    fontFamily: 'concert-one-regular',
    fontSize: 40,
  },
  currentChallengeButtonTitle: {
    fontFamily: 'concert-one-regular',
    fontSize: 40,
    color: colors.alert,
  },
});
