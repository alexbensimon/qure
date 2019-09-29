import firebase from 'firebase';
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { Text, Avatar } from 'react-native-elements';
import { Friend, User } from '../globalTypes';
import { CommunityCoachContainer } from './CommunityCoachContainer';
import { colors } from '../colors';

type State = {
  currentUser: User;
  friends: Array<Friend>;
  refreshing: boolean;
};

export class Community extends Component<{}, State> {
  state: State = {
    currentUser: null,
    friends: [],
    refreshing: false,
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

  handleRefresh = async () => {
    this.setState({ refreshing: true });
    await this.fetchData();
    this.setState({ refreshing: false });
  };

  render() {
    const { currentUser, friends, refreshing } = this.state;
    const people: Array<(Friend | User) & { isCurrentUser?: boolean }> = [
      ...friends,
      { ...currentUser, isCurrentUser: true },
    ];
    const peopleSorted = people.sort(
      (a, b) => (b.points || 0) - (a.points || 0),
    );
    if (currentUser === null && friends.length === 0) return null;
    return (
      <>
        <View style={styles.viewContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollViewContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={this.handleRefresh}
              />
            }
          >
            <Text h1 style={styles.title}>
              Classement
            </Text>
            {peopleSorted.map((person, i) => (
              <View style={styles.line} key={person.id}>
                <View style={styles.nameContainer}>
                  <Text
                    h4
                    style={[
                      styles.item,
                      person.isCurrentUser ? styles.textSelf : styles.text,
                    ]}
                  >
                    {i + 1}.
                  </Text>
                  <Avatar
                    rounded
                    source={{
                      uri: person.photoUrl,
                    }}
                    containerStyle={styles.item}
                  />
                  <Text
                    h4
                    style={person.isCurrentUser ? styles.textSelf : styles.text}
                  >
                    {person.name}
                  </Text>
                </View>
                <Text
                  h4
                  style={person.isCurrentUser ? styles.textSelf : styles.text}
                >
                  {person.points || 0}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
        <CommunityCoachContainer />
      </>
    );
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: 40,
  },
  scrollViewContainer: {
    backgroundColor: colors.white,
  },
  title: {
    marginBottom: 30,
    textAlign: 'center',
    color: colors.dark,
    fontFamily: 'concert-one-regular',
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
    maxWidth: '70%',
  },
  item: {
    marginRight: 10,
  },
  text: {
    color: colors.dark,
    fontFamily: 'concert-one-regular',
  },
  textSelf: {
    fontFamily: 'concert-one-regular',
    color: colors.primary,
  },
});
