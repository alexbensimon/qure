import firebase from 'firebase';
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { ChallengeTakenType } from '../globalTypes';
import { ChallengeTaken } from './ChallengeTaken';

type State = {
  challengesTaken: Array<ChallengeTakenType>;
};

export class ChallengesTaken extends Component<{}, State> {
  state: State = {
    challengesTaken: [],
  };

  async componentDidMount() {
    await this.fetchData();
  }

  fetchData = async () => {
    const querySnapshot = await firebase
      .firestore()
      .collection(`/users/${firebase.auth().currentUser.uid}/challengesTaken`)
      .where('succeed', '==', null)
      .get();
    const challengesTaken = [];
    querySnapshot.forEach(doc => {
      challengesTaken.push({ ...doc.data(), id: doc.id });
    });
    this.setState({ challengesTaken });
  };

  failChallenge = async (id: string) => {
    await firebase
      .firestore()
      .collection(`/users/${firebase.auth().currentUser.uid}/challengesTaken`)
      .doc(id)
      .set({ succeed: false }, { merge: true });
    this.fetchData();
  };

  render() {
    const { challengesTaken } = this.state;
    return (
      <>
        {challengesTaken.map(challengeTaken => (
          <ChallengeTaken
            key={challengeTaken.id}
            challengeTaken={challengeTaken}
            failChallenge={() => this.failChallenge(challengeTaken.id)}
          />
        ))}
        <Button
          containerStyle={styles.refreshButton}
          title="🙏"
          onPress={this.fetchData}
        ></Button>
      </>
    );
  }
}

const styles = StyleSheet.create({
  refreshButton: {
    marginTop: 20,
  },
});
