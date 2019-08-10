import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export class Community extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Community</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
