import React, { FC } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { colors } from '../colors';
import { ChallengesTaken } from './ChallengesTaken';
import { HomeCoachContainer } from './HomeCoachContainer';

export const Home: FC = () => (
  <>
    <View style={styles.viewContainer}>
      <ScrollView>
        <Text h1 style={styles.title}>
          Défis en cours
        </Text>
        <ChallengesTaken />
      </ScrollView>
    </View>
    <HomeCoachContainer />
  </>
);

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: colors.white,
  },
  title: {
    marginBottom: 30,
    textAlign: 'center',
    color: colors.dark,
    fontFamily: 'concert-one-regular',
  },
});
