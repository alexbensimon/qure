import firebase from 'firebase';
import React, { FC, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import { colors } from '../colors';
import { PageLoader } from '../components/PageLoader';
import { useLoader } from '../custom-hooks/useLoader';
import { User } from '../globalTypes';
import { CommunityCoachContainer } from './CommunityCoachContainer';

export const Community: FC = () => {
  const currentUserId = firebase.auth().currentUser.uid;
  const [users, setUsers] = useState<Array<User>>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    const querySnapshot = await firebase
      .firestore()
      .collection('users')
      .get();
    const users = [];
    querySnapshot.forEach(doc => {
      users.push({ ...doc.data(), id: doc.id });
    });

    const usersSorted = users.sort((a, b) => (b.points || 0) - (a.points || 0));

    setUsers(usersSorted);
  };

  const isLoading = useLoader(fetchData);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  return isLoading ? (
    <PageLoader />
  ) : (
    <>
      <View style={styles.viewContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
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
                    person.id === currentUserId ? styles.textSelf : styles.text,
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
                    person.id === currentUserId ? styles.textSelf : styles.text
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
};

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
