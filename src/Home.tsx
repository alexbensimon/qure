import React, { FC, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-elements';
import { ChallengesTaken } from './ChallengesTaken';

export const Home: FC = () => {
  const [coachAdvice, setCoachAdvice] = useState(0);

  return (
    <>
      <ChallengesTaken />
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setCoachAdvice(1)}>
          <Text style={styles.coachIcon}>👨‍🏫</Text>
        </TouchableOpacity>
        {coachAdvice === 1 && (
          <TouchableOpacity onPress={() => setCoachAdvice(2)}>
            <Text style={styles.advice}>
              {"Bonjour bonjour c'est moi le coach !"}
            </Text>
          </TouchableOpacity>
        )}
        {coachAdvice === 2 && (
          <TouchableOpacity onPress={() => setCoachAdvice(0)}>
            <Text style={styles.advice}>{"Hey ! C'est encore moi"}</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  coachIcon: {
    fontSize: 75,
  },
  advice: {
    borderWidth: 2,
    borderColor: 'gainsboro',
    borderRadius: 5,
    height: 50,
    marginBottom: 10,
    padding: 10,
  },
});
