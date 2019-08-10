import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export function Home() {
  const [coachAdvice, setCoachAdvice] = useState(0);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setCoachAdvice(1)}>
        <Text style={styles.coachIcon}>👨‍🏫</Text>
      </TouchableOpacity>
      {coachAdvice === 1 && (
        <TouchableOpacity onPress={() => setCoachAdvice(2)}>
          <Text style={styles.advice}>
            Bonjour bonjour c'est moi le coach !
          </Text>
        </TouchableOpacity>
      )}
      {coachAdvice === 2 && (
        <TouchableOpacity onPress={() => setCoachAdvice(0)}>
          <Text style={styles.advice}>Hey ! C'est encore moi</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

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
