import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { Challenge } from './globalTypes';

type State = {
  challengesSucceed: Array<Challenge>;
};

export class Community extends Component<{}, State> {
  state: State = {
    challengesSucceed: [],
  };

  async componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {};

  render() {
    return (
      <View style={styles.container}>
        {/* <Text h3>
          Points :{' '}
          {challengesSucceed.reduce(
            (previousValue, currentValue) => previousValue + currentValue.level,
            0,
          )}
        </Text> */}
        <Text h3 style={styles.title}>
          Classement des amis
        </Text>
        <Text h4>1. Victoria Launay : 10</Text>
        <Text h4>2. Pierre Lahmi : 7</Text>
        <Text h4>3. Alexandre Bensimon : 4</Text>
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
  title: {
    marginBottom: 30,
  },
});
