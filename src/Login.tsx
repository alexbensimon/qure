import * as Facebook from 'expo-facebook';
import firebase from 'firebase';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';

export const Login: FC = () => {
  async function facebookLogIn() {
    try {
      const { type, token } = await Facebook.logInWithReadPermissionsAsync(
        '2808452099169831',
        {
          behavior: 'native',
          permissions: ['public_profile'],
        },
      );
      if (type === 'success') {
        await firebase
          .auth()
          .setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        firebase
          .auth()
          .signInWithCredential(credential)
          .catch(error => {
            console.log('Oups! Firebase signInWithCredential error: ', error);
          });
      } else {
        console.log('Oups! Type not success, type: ', type);
      }
    } catch ({ message }) {
      console.log('Oups! Facebook Login Error: ', message);
    }
  }

  return (
    <View style={styles.container}>
      <Button title="Connexion avec Facebook" onPress={facebookLogIn}></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
