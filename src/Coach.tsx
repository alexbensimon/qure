import React, { FC, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-elements';
import { colors } from './colors';

type Props = {
  sentences: Array<string>;
};

export const Coach: FC<Props> = ({ sentences }) => {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

  const tellNextSentence = () => {
    setCurrentSentenceIndex(currentSentenceIndex =>
      currentSentenceIndex < sentences.length - 1
        ? currentSentenceIndex + 1
        : 0,
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.coachIcon}>👨‍🏫</Text>
      </View>
      <ScrollView style={styles.adviceContainer}>
        <TouchableOpacity onPress={tellNextSentence} style={styles.touchStyle}>
          <Text style={styles.advice}>{sentences[currentSentenceIndex]}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.white,
  },
  iconContainer: {
    width: 80,
  },
  coachIcon: {
    fontSize: 75,
  },
  adviceContainer: {
    backgroundColor: colors.dark,
    borderRadius: 10,
    height: 60,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  touchStyle: {
    flex: 1,
  },
  advice: {
    fontFamily: 'concert-one-regular',
    color: colors.primary,
    marginHorizontal: 10,
    marginVertical: 5,
    fontSize: 18,
  },
});
