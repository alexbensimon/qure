import React, { Component } from 'react';
import { View } from 'react-native';
import { Button, Card, Text } from 'react-native-elements';
import { Challenge } from '../globalTypes';

type Props = {
  challenge: Challenge;
};

type State = {
  challengeTaken: boolean;
};

export class ChallengeInfo extends Component<Props, State> {
  state: State = {
    challengeTaken: false,
  };

  takeChallenge = () => {
    this.setState({ challengeTaken: true });
  };

  render() {
    const {
      challenge: { title, subTitle, description, rules, duration },
    } = this.props;
    const { challengeTaken } = this.state;
    return (
      <Card title={title} key={title}>
        <View>
          <Text>{subTitle}</Text>
          <Text>{description}</Text>
          <Text>{rules}</Text>
          <Text>{duration}</Text>
          {!challengeTaken && (
            <Button title="💪" onPress={this.takeChallenge}></Button>
          )}
          {challengeTaken && <Text>✅</Text>}
        </View>
      </Card>
    );
  }
}
