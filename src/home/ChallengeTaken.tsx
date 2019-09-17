import {
  addDays,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  subDays,
  subHours,
  subMinutes,
  toDate,
  isAfter,
} from 'date-fns';
import firebase from 'firebase';
import React, { Component } from 'react';
import { Button, Card, Text } from 'react-native-elements';
import { Challenge, ChallengeTakenType } from '../globalTypes';

type Props = {
  challenge: Challenge;
  challengeTaken: ChallengeTakenType;
  removeChallenge: (challengeId: string) => void;
};

type State = {
  timeRemaining: string;
  done: boolean;
};

export class ChallengeTaken extends Component<Props, State> {
  state: State = {
    timeRemaining: '',
    done: false,
  };

  succeedChallenge = () => {
    this.setState({ done: true });
    firebase
      .firestore()
      .collection('challengesTakenByUsers')
      .doc(this.props.challengeTaken.id)
      .set({ done: true }, { merge: true });
  };

  async componentDidMount() {
    const startDate = toDate(this.props.challengeTaken.timestamp);
    const endDate = addDays(startDate, this.props.challenge.duration);
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
    const { challenge, removeChallenge } = this.props;
    const { timeRemaining, done } = this.state;
    return (
      <Card title={challenge.title}>
        {done ? (
          <Text>✅</Text>
        ) : (
          <>
            <Text>{timeRemaining}</Text>
            <Button
              title="❌ Fail"
              onPress={() => removeChallenge(challenge.id)}
            ></Button>
          </>
        )}
      </Card>
    );
  }
}
