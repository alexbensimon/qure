import * as Facebook from 'expo-facebook';
import firebase from 'firebase';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Icon, Text } from 'react-native-elements';

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
            // eslint-disable-next-line no-console
            console.log('Oups! Firebase signInWithCredential error: ', error);
          });
      } else {
        // eslint-disable-next-line no-console
        console.log('Oups! Type not success, type: ', type);
      }
    } catch ({ message }) {
      // eslint-disable-next-line no-console
      console.log('Oups! Facebook Login Error: ', message);
    }
  }

  return (
    <View style={styles.container}>
      <Text h2 style={styles.title}>
        Qure
      </Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: 50,
  },
  button: {
    backgroundColor: '#4267B2',
  },
  buttonTitle: {
    fontWeight: 'bold',
  },
  iconContainer: {
    marginRight: 8,
  },
});
