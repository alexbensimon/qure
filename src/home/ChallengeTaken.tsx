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
import { Button, Card, Text } from 'react-native-elements';
import { ChallengeTakenType } from '../globalTypes';

type Props = {
  challengeTaken: ChallengeTakenType;
  failChallenge: () => void;
};

type State = {
  timeRemaining: string;
  succeed: boolean;
};

export class ChallengeTaken extends Component<Props, State> {
  state: State = {
    timeRemaining: '',
    succeed: false,
  };

  succeedChallenge = () => {
    this.setState({ succeed: true });
    firebase
      .firestore()
      .collection(`/users/${firebase.auth().currentUser.uid}/challengesTaken`)
      .doc(this.props.challengeTaken.id)
      .set({ succeed: true }, { merge: true });
    firebase
      .firestore()
      .collection('/users')
      .doc(firebase.auth().currentUser.uid)
      .update({
        points: firebase.firestore.FieldValue.increment(
          this.props.challengeTaken.level,
        ),
      });
  };

  async componentDidMount() {
    const startDate = toDate(this.props.challengeTaken.timestamp);
    const endDate = addDays(startDate, this.props.challengeTaken.duration);
    const interval = setInterval(() => {
      const now = toDate(Date.now());

      if (isAfter(now, endDate)) {
        this.succeedChallenge();
        clearInterval(interval);
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
        timeRemaining: `Temps restant : 
          ${daysRemaining} jours 
          ${hoursRemaining} heures 
          ${minutesRemaining} minutes
          ${secondsRemaining} secondes
        `,
      });
    }, 1000);
  }

  render() {
    const { challengeTaken, failChallenge } = this.props;
    const { timeRemaining, succeed: done } = this.state;
    return (
      <Card title={challengeTaken.title}>
        {done ? (
          <Text>✅</Text>
        ) : (
          <>
            <Text>{timeRemaining}</Text>
            <Button title="❌ Fail" onPress={failChallenge}></Button>
          </>
        )}
      </Card>
    );
  }
}
