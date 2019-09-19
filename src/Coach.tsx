import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-elements';

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
        <TouchableOpacity onPress={this.tellNextSentence}>
          <Text style={styles.coachIcon}>👨‍🏫</Text>
        </TouchableOpacity>
        <Text style={styles.advice}>{sentences[currentSentenceIndex]}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0.2,
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
