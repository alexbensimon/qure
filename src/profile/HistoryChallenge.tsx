import React, { FC } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-elements';
import { NavigationScreenProps, withNavigation } from 'react-navigation';
import { colors } from '../colors';
import { ChallengeTakenType } from '../globalTypes';
import { toDate, lightFormat } from 'date-fns';

type Props = {
  challengeTaken: ChallengeTakenType;
} & NavigationScreenProps;

const RawHistoryChallenge: FC<Props> = ({
  challengeTaken: { challengeId, timestamp, title, subTitle, succeed, level },
  navigation,
}) => (
  <TouchableOpacity
    onPress={() => {
      navigation.push('HistoryChallengeDetails', {
        challengeId: challengeId,
      });
    }}
  >
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.result}>{succeed ? `✅ + ${level}` : '🔴'}</Text>
        <Text style={styles.date}>
          {lightFormat(toDate(timestamp), 'dd/MM/yyyy')}
        </Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subTitle}>{subTitle}</Text>
    </View>
  </TouchableOpacity>
);

export const HistoryChallenge = withNavigation(RawHistoryChallenge);

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 10,
    marginBottom: 30,
    backgroundColor: colors.dark,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    paddingTop: 3,
  },
  cardHeader: {
    alignSelf: 'stretch',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  result: {
    fontFamily: 'concert-one-regular',
    color: colors.primary,
    marginLeft: 5,
  },
  date: {
    fontFamily: 'concert-one-regular',
    color: colors.alert,
    marginRight: 5,
  },
  title: {
    fontFamily: 'concert-one-regular',
    color: colors.primary,
    marginBottom: 5,
    textAlign: 'center',
    fontSize: 20,
  },
  subTitle: {
    fontFamily: 'concert-one-regular',
    color: colors.light,
    marginBottom: 20,
    marginHorizontal: 8,
    textAlign: 'center',
    fontSize: 15,
  },
});
