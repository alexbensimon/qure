import firebase from 'firebase';
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { NavigationScreenProps, ScrollView } from 'react-navigation';
import { Challenge } from '../globalTypes';

type State = {
  topics: Challenge['topics'];
};

type Props = NavigationScreenProps;

export class DiscoverTopics extends Component<Props, State> {
  state: State = {
    topics: [],
  };

  async componentDidMount() {
    const topics = [];
    const querySnapshot = await firebase
      .firestore()
      .collection('topics')
      .get();
    querySnapshot.forEach(doc => {
      topics.push(doc.data().value);
    });

    this.setState({ topics });
  }

  render() {
    const { navigation } = this.props;
    const { topics } = this.state;
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {topics.map(topic => (
          <Button
            title={topic}
            key={topic}
            onPress={() => navigation.push('Challenges', { topic })}
            buttonStyle={styles.topic}
          ></Button>
        ))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
  },
  topic: {
    marginTop: 40,
    height: 100,
    marginRight: 10,
    marginLeft: 10,
  },
});
