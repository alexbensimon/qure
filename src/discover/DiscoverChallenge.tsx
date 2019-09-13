import firebase from 'firebase';
import { FireSQL } from 'firesql';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { NavigationScreenProps, ScrollView } from 'react-navigation';
import { Challenge } from '../globalTypes';
import { UserContext } from '../UserContext';

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
        timestamp: Date.now(),
        done: false,
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
      <ScrollView contentContainerStyle={styles.container}>
        <Text h1 style={styles.text}>
          {title}
        </Text>
        <Text h2 style={styles.text}>
          {subTitle}
        </Text>
        <Text h3 style={styles.text}>
          Pourquoi ? {description}
        </Text>
        <Text h4 style={styles.text}>
          Règles :
        </Text>
        {rules.map(rule => (
          <Text h4 key={rule}>
            - {rule}
          </Text>
        ))}
        <Text h4 style={styles.text}>
          Durée : {duration} jours
        </Text>
        <View style={styles.challengeTakenContainer}>
          {challengeTaken === false && (
            <Button title="💪" onPress={this.takeChallenge}></Button>
          )}
          {challengeTaken === true && <Text>✅</Text>}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginRight: 20,
    marginLeft: 20,
  },
  text: {
    marginTop: 30,
  },
  challengeTakenContainer: {
    marginTop: 30,
    marginBottom: 30,
  },
});
