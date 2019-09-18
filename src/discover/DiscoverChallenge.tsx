import firebase from 'firebase';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { NavigationScreenProps, ScrollView } from 'react-navigation';
import { Challenge } from '../globalTypes';

type Props = NavigationScreenProps;

type State = {
  challengeTaken: boolean | null;
};

export class DiscoverChallenge extends Component<Props, State> {
  state: State = {
    challengeTaken: null,
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
        {rules.map((rule, i) => (
          <Text h4 key={i}>
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
