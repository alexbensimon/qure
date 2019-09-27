import {
  addDays,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  isAfter,
  subDays,
  subHours,
  subMinutes,
  toDate,
} from 'date-fns';
import firebase from 'firebase';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { NavigationScreenProps, withNavigation } from 'react-navigation';
import { colors } from '../colors';
import { ChallengeTakenType } from '../globalTypes';

type Props = {
  challengeTaken: ChallengeTakenType;
  failChallenge: () => void;
  reload: () => void;
} & NavigationScreenProps;

type State = {
  timeRemaining: string;
  succeed: boolean;
};

class RawChallengeTaken extends Component<Props, State> {
  state: State = {
    timeRemaining: '',
    succeed: false,
  };

  interval: NodeJS.Timeout = null;

  async componentDidMount() {
    const startDate = toDate(this.props.challengeTaken.timestamp);
    const endDate = addDays(startDate, this.props.challengeTaken.duration);
    this.interval = setInterval(() => {
      const now = toDate(Date.now());

      if (isAfter(now, endDate)) {
        this.succeedChallenge();
        clearInterval(this.interval);
      }

      const daysRemaining = differenceInDays(endDate, now);
      const endDateMinusDays = subDays(endDate, daysRemaining);
      const hoursRemaining = differenceInHours(endDateMinusDays, now);
      const endDateMinusDaysHours = subHours(endDateMinusDays, hoursRemaining);
      const minutesRemaining = differenceInMinutes(endDateMinusDaysHours, now);
      const endDateMinusDaysHoursMinutes = subMinutes(
        endDateMinusDaysHours,
        minutesRemaining,
      );
      const secondsRemaining = differenceInSeconds(
        endDateMinusDaysHoursMinutes,
        now,
      );
      this.setState({
        timeRemaining: `${daysRemaining}:${hoursRemaining}:${minutesRemaining}:${secondsRemaining}`,
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  succeedChallenge = async () => {
    this.setState({ succeed: true });
    // Update challenge
    firebase
      .firestore()
      .collection(`/users/${firebase.auth().currentUser.uid}/challengesTaken`)
      .doc(this.props.challengeTaken.id)
      .set({ succeed: true }, { merge: true });
    // Increase my points
    firebase
      .firestore()
      .collection('/users')
      .doc(firebase.auth().currentUser.uid)
      .update({
        points: firebase.firestore.FieldValue.increment(
          this.props.challengeTaken.level,
        ),
      });
    // Increase my points for my friends
    const querySnapshot = await firebase
      .firestore()
      .collection(`/users/${firebase.auth().currentUser.uid}/friends`)
      .get();
    querySnapshot.forEach(doc => {
      firebase
        .firestore()
        .collection(`/users/${doc.id}/friends`)
        .doc(firebase.auth().currentUser.uid)
        .update({
          points: firebase.firestore.FieldValue.increment(
            this.props.challengeTaken.level,
          ),
        });
    });
  };

  tryFailChallenge = () => {
    Alert.alert(
      'Challenge raté 😔',
      "As-tu vraiment raté ce challenge ? Tu ne gagneras donc pas de points mais rien ne t'empêche de recommencer ! Merci pour ton honnêteté.",
      [
        {
          text: "Oui j'ai raté",
          onPress: this.props.failChallenge,
        },
        {
          text: "Non promis je n'ai pas raté",
          style: 'cancel',
        },
      ],
    );
  };

  render() {
    const { challengeTaken, reload, navigation } = this.props;
    const { timeRemaining, succeed } = this.state;
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.push('Challenge', {
            challengeId: challengeTaken.challengeId,
          });
        }}
      >
        <View style={styles.card}>
          {!succeed && <Text style={styles.time}>{timeRemaining}</Text>}
          <Text style={styles.title}>{challengeTaken.title}</Text>
          <Text style={styles.subTitle}>{challengeTaken.subTitle}</Text>
          {!succeed ? (
            <Button
              title="J'ai raté"
              onPress={this.tryFailChallenge}
              containerStyle={styles.buttonContainer}
              buttonStyle={styles.button}
              titleStyle={styles.failButtonTitle}
            ></Button>
          ) : (
            <Button
              title="Bravo !"
              onPress={reload}
              containerStyle={styles.buttonContainer}
              buttonStyle={styles.button}
              titleStyle={styles.succeedButtonTitle}
            ></Button>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

export const ChallengeTaken = withNavigation(RawChallengeTaken);

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 10,
    marginBottom: 30,
    backgroundColor: colors.dark,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    paddingTop: 3,
  },
  title: {
    fontFamily: 'concert-one-regular',
    color: colors.primary,
    marginBottom: 5,
    textAlign: 'center',
    fontSize: 20,
  },
  subTitle: {
    fontFamily: 'concert-one-regular',
    color: colors.light,
    marginBottom: 10,
    marginHorizontal: 8,
    textAlign: 'center',
    fontSize: 15,
  },
  time: {
    fontFamily: 'concert-one-regular',
    color: colors.alert,
    alignSelf: 'flex-end',
    marginRight: 5,
  },
  buttonContainer: {
    alignSelf: 'stretch',
  },
  button: {
    backgroundColor: colors.light,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  failButtonTitle: {
    color: colors.alert,
    fontFamily: 'concert-one-regular',
  },
  succeedButtonTitle: {
    color: colors.primary,
    fontFamily: 'concert-one-regular',
  },
});
