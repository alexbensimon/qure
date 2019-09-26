import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../colors';
import { ChallengesTaken } from './ChallengesTaken';
import { HomeCoachContainer } from './HomeCoachContainer';

export const Home: FC = () => (
  <>
    <View style={styles.viewContainer}>
      <ChallengesTaken />
    </View>
    <HomeCoachContainer />
  </>
);

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
