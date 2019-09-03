import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';

export const Profile: FC = () => (
  <View style={styles.container}>
    <Text>Profile</Text>
    <Button title="Awesome button from UI kit"></Button>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
