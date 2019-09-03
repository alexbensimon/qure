import firebase from 'firebase';
import React, { FC, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const Community: FC = () => {
  const [localValue, setLocalValue] = useState(null);

  const doc = firebase
    .firestore()
    .collection('tests')
    .doc('CjNUwAnFznsZTwvsILw1');

  doc.onSnapshot(res => {
    setLocalValue(res.data().value);
  });

  const incrementInDb = (): void => {
    doc.set({ value: localValue + 1 });
  };

  return (
    localValue !== null && (
      <View style={styles.container}>
        <Text>Community</Text>
        <Text>{localValue}</Text>
        <TouchableOpacity onPress={incrementInDb}>
          <Text style={styles.plus}>+</Text>
        </TouchableOpacity>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plus: {
    fontSize: 40,
  },
});
