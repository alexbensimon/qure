import firebase from 'firebase';
import React, { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import { ScrollView } from 'react-navigation';
import { NavigationStackProp } from 'react-navigation-stack';
import { Coach } from '../Coach';
import { colors } from '../colors';
import { PageLoader } from '../components/PageLoader';
import { useLoader } from '../custom-hooks/useLoader';
import { Challenge } from '../globalTypes';

type Props = {
  navigation: NavigationStackProp;
};

export const DiscoverChallenges: FC<Props> = ({ navigation }) => {
  const topic: Challenge['topics'][0] = navigation.getParam('topic');
  const [challenges, setChallenges] = useState<Array<Challenge>>([]);

  const fetchData = async () => {
    const querySnapshot = await firebase
      .firestore()
      .collection('challenges')
      .where('topics', 'array-contains', topic)
      .get();
    const challenges: Array<Challenge> = [];
    querySnapshot.forEach(doc => {
      challenges.push({ ...doc.data(), id: doc.id } as Challenge);
    });
    const challengesSorted = challenges.sort((challenge1, challenge2) =>
      challenge1.title.localeCompare(challenge2.title),
    );

    setChallenges(challengesSorted);
  };

  const isLoading = useLoader(fetchData, [topic]);

  return isLoading ? (
    <PageLoader />
  ) : (
    <>
      <View style={styles.viewContainer}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          {challenges.map(challenge => (
            <Button
              title={challenge.title}
              key={challenge.id}
              onPress={() =>
                navigation.push('DiscoverChallenge', {
                  challengeId: challenge.id,
                })
              }
              buttonStyle={styles.challengeButton}
              titleStyle={styles.challengeTitle}
            ></Button>
          ))}
        </ScrollView>
      </View>
      <Coach
        sentences={[`J'adore les challenge ${navigation.getParam('topic')}`]}
      />
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
  challengeButton: {
    marginTop: 40,
    height: 100,
    marginHorizontal: 10,
    backgroundColor: colors.dark,
  },
  challengeTitle: {
    color: colors.primary,
    fontFamily: 'concert-one-regular',
  },
});
