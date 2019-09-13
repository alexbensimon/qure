import React, { Component } from 'react';
import { Challenge } from './globalTypes';
import {
  toDate,
  addDays,
  differenceInSeconds,
  differenceInDays,
  differenceInHours,
  subDays,
  subHours,
  differenceInMinutes,
  subMinutes,
} from 'date-fns';
import { Card, Text, Button } from 'react-native-elements';

type Props = {
  challenge: Challenge;
  timestamp: number;
  removeChallenge: (challengeId: string) => void;
};

type State = {
  timeRemaining: string;
};

export class ChallengeTaken extends Component<Props, State> {
  state: State = {
    timeRemaining: '',
  };

  async componentDidMount() {
    const startDate = toDate(this.props.timestamp);
    const endDate = addDays(startDate, this.props.challenge.duration);
    setInterval(() => {
      const now = toDate(Date.now());
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
    const { timeRemaining } = this.state;
    return (
      <Card title={challenge.title}>
        <Text>{timeRemaining}</Text>
        <Button
          title="❌ Fail"
          onPress={() => removeChallenge(challenge.id)}
        ></Button>
      </Card>
    );
  }
}
