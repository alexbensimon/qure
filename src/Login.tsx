import * as Facebook from 'expo-facebook';
import firebase from 'firebase';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Icon, Text } from 'react-native-elements';
import { colors } from './colors';

export const Login: FC = () => (
  <>
    <View style={styles.containerTop}>
      <Text style={styles.title}>Qure</Text>
    </View>
    <View style={styles.containerBottom}>
      <Button
        buttonStyle={styles.button}
        titleStyle={styles.buttonTitle}
        title="Connexion avec Facebook"
        icon={
          <Icon
            name="facebook-box"
            type="material-community"
            color="white"
            size={32}
            containerStyle={styles.iconContainer}
          />
        }
        onPress={facebookLogIn}
      ></Button>
    </View>
  </>
);

const facebookLogIn = async () => {
  const userCollection = firebase.firestore().collection('users');
  try {
    const { type, token } = await Facebook.logInWithReadPermissionsAsync(
      '2808452099169831',
      {
        permissions: ['public_profile', 'user_friends'],
      },
    );
    if (type === 'success') {
      await firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      const credential = firebase.auth.FacebookAuthProvider.credential(token);
      const userCredential = await firebase
        .auth()
        .signInWithCredential(credential)
        .catch(error => {
          // eslint-disable-next-line no-console
          console.log('Oups! Firebase signInWithCredential error: ', error);
        });
      if (userCredential && userCredential.user) {
        const user = userCredential.user;
        userCollection.doc(user.uid).set(
          {
            name: user.displayName,
            photoUrl: user.photoURL,
            facebookId: user.providerData[0].uid,
            coach: 'basic',
          },
          { merge: true },
        );
        const { data: fbFriends } = await (await fetch(
          `https://graph.facebook.com/${user.providerData[0].uid}/friends?access_token=${token}`,
        )).json();
        const promises = [];
        fbFriends.forEach(friend => {
          promises.push(
            firebase
              .firestore()
              .collection('users')
              .where('facebookId', '==', friend.id)
              .limit(1)
              .get(),
          );
        });
        const querySnapshots = await Promise.all(promises);
        const friends = [];
        querySnapshots.forEach(querySnapshot => {
          querySnapshot.forEach(doc => {
            friends.push(doc);
          });
        });
        friends.forEach(friend => {
          firebase
            .firestore()
            .collection(`users/${user.uid}/friends`)
            .doc(friend.id)
            .set(friend.data());
        });
      }
    } else {
      // eslint-disable-next-line no-console
      console.log('Oups! Type not success, type: ', type);
    }
  } catch ({ message }) {
    // eslint-disable-next-line no-console
    console.log('Oups! Facebook Login Error: ', message);
  }
};

const styles = StyleSheet.create({
  containerTop: {
    flex: 0.5,
    backgroundColor: colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerBottom: {
    flex: 0.5,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'concert-one-regular',
    fontSize: 100,
    color: colors.primary,
  },
  button: {
    backgroundColor: '#4267B2',
  },
  buttonTitle: {
    fontFamily: 'concert-one-regular',
  },
  iconContainer: {
    marginRight: 8,
  },
});
