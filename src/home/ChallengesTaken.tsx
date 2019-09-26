import firebase from 'firebase';
import React, { Component } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { colors } from '../colors';
import { ChallengeTakenType } from '../globalTypes';
import { ChallengeTaken } from './ChallengeTaken';
import { withNavigation, NavigationScreenProps } from 'react-navigation';

type Props = NavigationScreenProps;

type State = {
  challengesTaken: Array<ChallengeTakenType>;
  refreshing: boolean;
};

class RawChallengesTaken extends Component<Props, State> {
  state: State = {
    refreshing: false,
    challengesTaken: null,
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

  handleRefresh = async () => {
    this.setState({ refreshing: true });
    await this.fetchData();
    this.setState({ refreshing: false });
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
    const { navigation } = this.props;
    const { challengesTaken, refreshing } = this.state;

    return challengesTaken === null ? null : (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={this.handleRefresh}
          />
        }
      >
        <Text h1 style={styles.title}>
          Défis en cours
        </Text>
        {challengesTaken.length > 0 ? (
          challengesTaken.map(challengeTaken => (
            <ChallengeTaken
              key={challengeTaken.id}
              challengeTaken={challengeTaken}
              failChallenge={() => this.failChallenge(challengeTaken.id)}
              reload={this.fetchData}
            />
          ))
        ) : (
          <>
            <Button
              title="Je veux relever un défi !"
              onPress={() => navigation.navigate('Découvrir')}
              buttonStyle={styles.button}
              titleStyle={styles.buttonTitle}
              containerStyle={styles.buttonContainer}
            ></Button>
          </>
        )}
      </ScrollView>
    );
  }
}

export const ChallengesTaken = withNavigation(RawChallengesTaken);

const styles = StyleSheet.create({
  title: {
    marginBottom: 30,
    textAlign: 'center',
    color: colors.dark,
    fontFamily: 'concert-one-regular',
  },
  button: {
    backgroundColor: colors.dark,
    borderRadius: 10,
  },
  buttonContainer: {
    marginHorizontal: 10,
  },
  buttonTitle: {
    fontFamily: 'concert-one-regular',
    color: colors.primary,
    fontSize: 32,
  },
});
