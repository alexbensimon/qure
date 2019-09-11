import firebase from 'firebase';
import { FireSQL } from 'firesql';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Button, Card, Text } from 'react-native-elements';
import { Challenge } from '../globalTypes';
import { UserContext } from '../UserContext';
import { NavigationScreenProps } from 'react-navigation';

type Props = NavigationScreenProps;

type State = {
  challengeTaken: boolean | null;
};

export class DiscoverChallenge extends Component<Props, State> {
  static contextType = UserContext;

  state: State = {
    challengeTaken: null,
  };

  async componentDidMount() {
    const challenge: Challenge = this.props.navigation.getParam('challenge');
    const fireSQL = new FireSQL(firebase.firestore());
    const res = await fireSQL.query(`
      SELECT *
      FROM challengesTakenByUsers
      WHERE userId = '${this.context.uid}' AND challengeId = '${challenge.id}'
    `);
    this.setState({ challengeTaken: res.length > 0 });
  }

  takeChallenge = () => {
    const challenge: Challenge = this.props.navigation.getParam('challenge');
    this.setState({ challengeTaken: true });
    firebase
      .firestore()
      .collection('challengesTakenByUsers')
      .add({
        challengeId: challenge.id,
        userId: this.context.uid,
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
    const { challengeTaken } = this.state;
    return (
      <Card title={title} key={title}>
        <View>
          <Text>{subTitle}</Text>
          <Text>{description}</Text>
          <Text>{rules}</Text>
          <Text>{duration}</Text>
          {challengeTaken === false && (
            <Button title="💪" onPress={this.takeChallenge}></Button>
          )}
          {challengeTaken === true && <Text>✅</Text>}
        </View>
      </Card>
    );
  }
}
