import firebase from 'firebase';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Button, Text } from 'react-native-elements';
import { colors } from '../colors';
import { User } from '../globalTypes';
import { ProfileCoachContainer } from './ProfileCoachContainer';
import { NavigationScreenProps } from 'react-navigation';

type Props = NavigationScreenProps;

type State = {
  currentUser: User | null;
};

export class Profile extends Component<Props, State> {
  state: State = {
    currentUser: null,
  };

  async componentDidMount() {
    const userQuerySnapshot = await firebase
      .firestore()
      .collection('/users')
      .doc(firebase.auth().currentUser.uid)
      .get();
    if (userQuerySnapshot.exists) {
      this.setState({ currentUser: userQuerySnapshot.data() as User });
    }
  }

  showHistory = () => {
    this.props.navigation.push('HistoryList');
  };

  logOut = async () => {
    await firebase.auth().signOut();
  };

  render() {
    const { currentUser } = this.state;
    if (currentUser === null) return null;
    return (
      <>
        <View style={styles.viewContainer}>
          <Avatar
            rounded
            source={{
              uri: currentUser.photoUrl,
            }}
            size="medium"
            containerStyle={styles.item}
          />
          <Text h4 style={[styles.item, styles.name]}>
            {currentUser.name}
          </Text>
          <Button
            title="Historique"
            buttonStyle={styles.button}
            containerStyle={styles.item}
            titleStyle={styles.buttonText}
            onPress={this.showHistory}
          />
          <Button
            title="Déconnexion"
            onPress={this.logOut}
            buttonStyle={styles.button}
            titleStyle={styles.logoutText}
          ></Button>
        </View>
        <ProfileCoachContainer />
      </>
    );
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    marginBottom: 30,
  },
  name: {
    color: colors.dark,
    fontFamily: 'concert-one-regular',
  },
  button: {
    backgroundColor: colors.dark,
  },
  buttonText: {
    color: colors.primary,
    fontFamily: 'concert-one-regular',
  },
  logoutText: {
    fontFamily: 'concert-one-regular',
    color: colors.alert,
  },
});
