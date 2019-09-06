import * as Facebook from 'expo-facebook';
import firebase from 'firebase';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';

type Props = {
  logIn: (userName: string) => void;
};

export const Login: FC<Props> = ({ logIn }) => {
  async function facebookLogIn() {
    try {
      const {
        type,
        token,
        // expires,
        // permissions,
        // declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync('2808452099169831', {
        behavior: 'native',
        permissions: ['public_profile'],
      });
      if (type === 'success') {
        // Build Firebase credential with the Facebook access token.
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        // Sign in with credential from the Facebook user.
        firebase
          .auth()
          .signInWithCredential(credential)
          .catch(error => {
            // Handle Errors here.
          });

        // Get the user's name using Facebook's Graph API
        const response = await fetch(
          `https://graph.facebook.com/me?access_token=${token}`,
        );
        const { name } = await response.json();
        logIn(name);
      } else {
        console.log('type not success, type: ', type);
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }

  return (
    <View style={styles.container}>
      <Button title="Login with Facebook" onPress={facebookLogIn}></Button>
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
