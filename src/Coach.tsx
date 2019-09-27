import React, { Component } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-elements';
import { colors } from './colors';

type Props = {
  sentences: Array<string>;
};

type State = {
  currentSentenceIndex: number;
};

export class Coach extends Component<Props, State> {
  state: State = {
    currentSentenceIndex: 0,
  };

  tellNextSentence = () => {
    this.setState(state => ({
      currentSentenceIndex:
        state.currentSentenceIndex < this.props.sentences.length - 1
          ? state.currentSentenceIndex + 1
          : 0,
    }));
  };

  render() {
    const { sentences } = this.props;
    const { currentSentenceIndex } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Text style={styles.coachIcon}>👨‍🏫</Text>
        </View>
        <ScrollView style={styles.adviceContainer}>
          <TouchableOpacity
            onPress={this.tellNextSentence}
            style={styles.touchStyle}
          >
            <Text style={styles.advice}>{sentences[currentSentenceIndex]}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0.2,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.white,
  },
  iconContainer: {
    width: '22%',
  },
  coachIcon: {
    fontSize: 75,
  },
  adviceContainer: {
    backgroundColor: colors.dark,
    borderRadius: 10,
    height: 60,
    maxWidth: '75%',
    marginBottom: 10,
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
