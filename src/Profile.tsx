import firebase from 'firebase';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Button, Text } from 'react-native-elements';
import { User } from './globalTypes';

type State = {
  currentUser: User | null;
};

export class Profile extends Component<{}, State> {
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

  logOut = async () => {
    await firebase.auth().signOut();
  };

  render() {
    const { currentUser } = this.state;
    if (currentUser === null) return null;
    return (
      <View style={styles.container}>
        <>
          <Avatar
            rounded
            source={{
              uri: currentUser.photoUrl,
            }}
            size="medium"
            containerStyle={styles.item}
          />
          <Text h4 style={styles.item}>
            {currentUser.name}
          </Text>
        </>

        <Button title="Déconnexion" onPress={this.logOut}></Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    marginBottom: 30,
  },
});
