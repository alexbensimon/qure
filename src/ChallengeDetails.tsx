import firebase from 'firebase';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Overlay, Text } from 'react-native-elements';
import {
  ScrollView,
  withNavigation,
  NavigationScreenProps,
} from 'react-navigation';
import { Coach } from './Coach';
import { colors } from './colors';
import { Challenge } from './globalTypes';

type Props = {
  challengeId: Challenge['id'];
} & NavigationScreenProps;

type State = {
  challenge: Challenge;
  challengeTaken: boolean | null;
  showWarning: boolean;
};

class RawChallengeDetails extends Component<Props, State> {
  state: State = {
    challenge: null,
    challengeTaken: null,
    showWarning: false,
  };

  async componentDidMount() {
    const { challengeId } = this.props;

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

    this.setState({
      challenge: challengeDoc.data() as Challenge,
      challengeTaken: sameChallengeTaken.length > 0,
    });
  }

  tryTakeChallenge = async () => {
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
      this.setState({ showWarning: true });
    } else {
      this.takeChallenge();
    }
  };

  takeChallenge = () => {
    const { challengeId } = this.props;
    const {
      challenge: { level, title, duration, subTitle },
    } = this.state;
    this.setState({ challengeTaken: true });
    firebase
      .firestore()
      .collection(`users/${firebase.auth().currentUser.uid}/challengesTaken`)
      .add({
        challengeId,
        timestamp: Date.now(),
        succeed: null,
        level: level,
        title: title,
        duration: duration,
        subTitle: subTitle,
      });
  };

  render() {
    if (!this.state.challenge) return null;

    const { navigation } = this.props;
    const {
      challenge: { title, subTitle, description, rules, duration },
      challengeTaken,
      showWarning,
    } = this.state;
    return (
      <>
        <View style={styles.viewContainer}>
          <ScrollView>
            <View style={styles.card}>
              <Text h4 style={styles.indicator}>
                Défi
              </Text>
              <Text h1 style={commonStyles.item}>
                {title}
              </Text>
              <Text h4 style={styles.indicator}>
                Objectif
              </Text>
              <Text h2 style={commonStyles.item}>
                {subTitle}
              </Text>
              <Text h4 style={styles.indicator}>
                Pourquoi ?
              </Text>
              <Text h4 style={styles.description}>
                {description}
              </Text>
              <Text h4 style={styles.indicator}>
                Règles
              </Text>
              {rules.map((rule, i) => (
                <Text h4 key={i} style={styles.rule}>
                  👉 {rule}
                </Text>
              ))}
              <Text style={commonStyles.item}></Text>
              <Text h4 style={styles.indicator}>
                Durée
              </Text>
              <Text h2 style={commonStyles.item}>
                {duration} jour{duration > 1 && 's'}
              </Text>
            </View>
            <View style={styles.challengeTakenContainer}>
              {challengeTaken === false && (
                <Button
                  title="Je relève le défi !"
                  onPress={this.tryTakeChallenge}
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
            <Overlay
              isVisible={showWarning}
              onBackdropPress={() => this.setState({ showWarning: false })}
            >
              <View style={styles.overlay}>
                <Text h4>🙅‍</Text>
                <Text h4>Pas plus de 3 challenges en même temps</Text>
              </View>
            </Overlay>
          </ScrollView>
        </View>
        <Coach sentences={[`J'adore le challenge ${title}`]} />
      </>
    );
  }
}

export const ChallengeDetails = withNavigation(RawChallengeDetails);

const commonStyles = StyleSheet.create({
  item: {
    fontFamily: 'concert-one-regular',
    color: colors.primary,
    marginBottom: 15,
    textAlign: 'center',
  },
});

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
  description: {
    ...commonStyles.item,
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
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});