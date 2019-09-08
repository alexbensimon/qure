import firebase from 'firebase';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';

export const Profile: FC = () => {
  const logOut = async () => {
    await firebase.auth().signOut();
  };

  return (
    <View style={styles.container}>
      <Button title="Déconnexion" onPress={logOut}></Button>
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
