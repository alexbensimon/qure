import firebase from 'firebase';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, Overlay } from 'react-native-elements';
import { NavigationScreenProps, ScrollView } from 'react-navigation';
import { Challenge } from '../globalTypes';
import { Coach } from '../Coach';
import { colors } from '../colors';

type Props = NavigationScreenProps;

type State = {
  challengeTaken: boolean | null;
  showWarning: boolean;
};

export class DiscoverChallenge extends Component<Props, State> {
  state: State = {
    challengeTaken: null,
    showWarning: false,
  };

  async componentDidMount() {
    const querySnapshot = await firebase
      .firestore()
      .collection(`users/${firebase.auth().currentUser.uid}/challengesTaken`)
      .where(
        'challengeId',
        '==',
        this.props.navigation.getParam('challenge').id,
      )
      .where('succeed', '==', null)
      .limit(1)
      .get();
    const sameChallengeTaken = [];
    querySnapshot.forEach(doc => {
      sameChallengeTaken.push(doc.id);
    });
    this.setState({ challengeTaken: sameChallengeTaken.length > 0 });
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
    const challenge: Challenge = this.props.navigation.getParam('challenge');
    this.setState({ challengeTaken: true });
    firebase
      .firestore()
      .collection(`users/${firebase.auth().currentUser.uid}/challengesTaken`)
      .add({
        challengeId: challenge.id,
        timestamp: Date.now(),
        succeed: null,
        level: challenge.level,
        title: challenge.title,
        duration: challenge.duration,
        subTitle: challenge.subTitle,
      });
  };

  render() {
    const { navigation } = this.props;
    const {
      title,
      subTitle,
      description,
      rules,
      duration,
    }: Challenge = navigation.getParam('challenge');
    const { challengeTaken, showWarning } = this.state;
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
  title: {},
  subTitle: {},
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
