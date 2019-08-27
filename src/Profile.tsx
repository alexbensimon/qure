import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const Profile: React.FC = () => (
  <View style={styles.container}>
    <Text>Profile</Text>
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
