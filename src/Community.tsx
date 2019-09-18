import firebase from 'firebase';
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Avatar } from 'react-native-elements';
import { Friend, User } from './globalTypes';

type State = {
  currentUser: User;
  friends: Array<Friend>;
};

export class Community extends Component<{}, State> {
  state: State = {
    currentUser: null,
    friends: [],
  };

  async componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    // fetch current user
    const userQuerySnapshot = await firebase
      .firestore()
      .collection('/users')
      .doc(firebase.auth().currentUser.uid)
      .get();
    let currentUser = null;
    if (userQuerySnapshot.exists) {
      currentUser = { ...userQuerySnapshot.data(), id: userQuerySnapshot.id };
    }

    // Fetch friends
    const querySnapshot = await firebase
      .firestore()
      .collection(`/users/${firebase.auth().currentUser.uid}/friends`)
      .get();
    const friends = [];
    querySnapshot.forEach(doc => {
      friends.push({ ...doc.data(), id: doc.id });
    });

    this.setState({ currentUser, friends });
  };

  render() {
    const { currentUser, friends } = this.state;
    const people = [...friends, { ...currentUser, isCurrentUser: true }];
    const peopleSorted = people.sort((a, b) => b.points || 0 - a.points || 0);
    if (currentUser === null && friends.length === 0) return null;
    return (
      <ScrollView contentContainerStyle={styles.pageContainer}>
        <Text h3 style={styles.title}>
          Classement
        </Text>
        {peopleSorted.map((person, i) => (
          <View style={styles.line} key={person.id}>
            <View style={styles.nameContainer}>
              <Text h4 style={styles.item}>
                {i + 1}.
              </Text>
              <Avatar
                rounded
                source={{
                  uri: person.photoUrl,
                }}
                containerStyle={styles.item}
              />
              <Text h4>{person.name}</Text>
            </View>
            <Text h4>{person.points || 0}</Text>
          </View>
        ))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 50,
  },
  title: {
    marginBottom: 30,
    textAlign: 'center',
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  nameContainer: {
    flexDirection: 'row',
  },
  item: {
    marginRight: 10,
  },
});
