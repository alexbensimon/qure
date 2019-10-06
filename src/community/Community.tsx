import firebase from 'firebase';
import React, { Component } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import { colors } from '../colors';
import { User } from '../globalTypes';
import { CommunityCoachContainer } from './CommunityCoachContainer';

type State = {
  users: Array<User>;
  refreshing: boolean;
};

export class Community extends Component<{}, State> {
  state: State = {
    users: [],
    refreshing: false,
  };

  async componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    const querySnapshot = await firebase
      .firestore()
      .collection('users')
      .get();
    const users = [];
    querySnapshot.forEach(doc => {
      users.push({ ...doc.data(), id: doc.id });
    });

    const usersSorted = users.sort((a, b) => (b.points || 0) - (a.points || 0));

    this.setState({ users: usersSorted });
  };

  handleRefresh = async () => {
    this.setState({ refreshing: true });
    await this.fetchData();
    this.setState({ refreshing: false });
  };

  render() {
    const { users, refreshing } = this.state;
    const currentUserId = firebase.auth().currentUser.uid;

    if (users.length === 0) return null;
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
            {users.map((person, i) => (
              <View style={styles.line} key={person.id}>
                <View style={styles.nameContainer}>
                  <Text
                    h4
                    style={[
                      styles.item,
                      person.id === currentUserId
                        ? styles.textSelf
                        : styles.text,
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
                    style={
                      person.id === currentUserId
                        ? styles.textSelf
                        : styles.text
                    }
                  >
                    {person.name}
                  </Text>
                </View>
                <Text
                  h4
                  style={
                    person.id === currentUserId ? styles.textSelf : styles.text
                  }
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
