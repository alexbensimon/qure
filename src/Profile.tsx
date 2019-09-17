import firebase from 'firebase';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Button, Text } from 'react-native-elements';

export const Profile: FC = () => {
  const logOut = async () => {
    await firebase.auth().signOut();
  };

  return (
    <View style={styles.container}>
      {/* {user => (
        <>
          <Avatar
            rounded
            source={{
              uri: user.photoURL,
            }}
            size="medium"
            containerStyle={styles.item}
          />
          <Text h4 style={styles.item}>
            {user.displayName}
          </Text>
        </>
      )} */}

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
  item: {
    marginBottom: 30,
  },
});
