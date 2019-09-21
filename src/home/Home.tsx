import React, { FC } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { ChallengesTaken } from './ChallengesTaken';
import { HomeCoachContainer } from './HomeCoachContainer';

export const Home: FC = () => (
  <>
    <View style={styles.viewContainer}>
      <ScrollView>
        <ChallengesTaken />
      </ScrollView>
    </View>
    <HomeCoachContainer />
  </>
);

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    marginTop: 40,
  },
});
