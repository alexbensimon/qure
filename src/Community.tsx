import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import firebase from 'firebase';
import { TouchableOpacity } from 'react-native-gesture-handler';

export function Community() {
  const [localValue, setLocalValue] = useState(0);

  const doc = firebase
    .firestore()
    .collection('test')
    .doc('WJRM1M9xJQg8AIjgUi4O');

  doc.onSnapshot(res => {
    setLocalValue(res.data().value);
  });

  function incrementInDb() {
    doc.set({ value: localValue + 1 });
  }

  return (
    localValue !== 0 && (
      <View style={styles.container}>
        <Text>Community</Text>
        <Text>{localValue}</Text>
        <TouchableOpacity onPress={incrementInDb}>
          <Text style={styles.plus}>+</Text>
        </TouchableOpacity>
      </View>
    )
  );
}

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
