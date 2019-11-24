import firebase from 'firebase';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import { ScrollView } from 'react-navigation';
import { NavigationStackProp } from 'react-navigation-stack';
import { colors } from '../colors';
import { Challenge } from '../globalTypes';
import { DiscoverCoachContainer } from './DiscoverCoachContainer';

type Props = {
  navigation: NavigationStackProp;
};

export const DiscoverTopics: FC<Props> = ({ navigation }) => {
  const [topics, setTopics] = useState<Challenge['topics']>([]);

  useEffect(() => {
    (async () => {
      const topicsTemp: Challenge['topics'] = [];
      const querySnapshot = await firebase
        .firestore()
        .collection('topics')
        .get();
      querySnapshot.forEach(doc => {
        topicsTemp.push(doc.data().value);
      });
      const topicsSorted = topicsTemp.sort((topic1, topic2) =>
        topic1.localeCompare(topic2),
      );

      setTopics(topicsSorted);
    })();
  }, []);

  return (
    <>
      <View style={styles.viewContainer}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          {topics.map(topic => (
            <Button
              title={topic}
              key={topic}
              onPress={() => navigation.push('DiscoverChallenges', { topic })}
              buttonStyle={styles.topicButton}
              titleStyle={styles.topicTitle}
            ></Button>
          ))}
        </ScrollView>
      </View>
      <DiscoverCoachContainer />
    </>
  );
};

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
