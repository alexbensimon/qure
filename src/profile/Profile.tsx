import firebase from 'firebase';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Button, Text } from 'react-native-elements';
import { NavigationStackProp } from 'react-navigation-stack';
import { colors } from '../colors';
import { User } from '../globalTypes';
import { ProfileCoachContainer } from './ProfileCoachContainer';

type Props = {
  navigation: NavigationStackProp;
};

export const Profile: FC<Props> = ({ navigation }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    fetchData();
  });

  const fetchData = async () => {
    const userQuerySnapshot = await firebase
      .firestore()
      .collection('/users')
      .doc(firebase.auth().currentUser.uid)
      .get();
    if (userQuerySnapshot.exists) {
      setCurrentUser(userQuerySnapshot.data() as User);
    }
  };

  const showHistory = () => {
    navigation.push('HistoryList');
  };

  const logOut = async () => {
    await firebase.auth().signOut();
  };

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
          onPress={showHistory}
        />
        <Button
          title="Déconnexion"
          onPress={logOut}
          buttonStyle={styles.button}
          titleStyle={styles.logoutText}
        ></Button>
      </View>
      <ProfileCoachContainer />
    </>
  );
};

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
