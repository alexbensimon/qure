import firebase from 'firebase';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import { NavigationScreenProps, ScrollView } from 'react-navigation';
import { Challenge } from '../globalTypes';
import { DiscoverCoachContainer } from './DiscoverCoachContainer';
import { colors } from '../colors';

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
      <>
        <View style={styles.viewContainer}>
          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            {topics.map(topic => (
              <Button
                title={topic}
                key={topic}
                onPress={() => navigation.push('Challenges', { topic })}
                buttonStyle={styles.topicButton}
                titleStyle={styles.topicTitle}
              ></Button>
            ))}
          </ScrollView>
        </View>
        <DiscoverCoachContainer />
      </>
    );
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollViewContainer: {
    alignItems: 'stretch',
  },
  topicButton: {
    marginTop: 40,
    height: 100,
    marginRight: 10,
    marginLeft: 10,
    backgroundColor: colors.light,
  },
  topicTitle: {
    color: colors.dark,
    fontFamily: 'concert-one-regular',
  },
});
