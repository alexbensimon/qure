import firebase from 'firebase';
import { FireSQL } from 'firesql';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Card } from 'react-native-elements';
import { Challenge } from '../globalTypes';

type Props = {
  topic: Challenge['topic'];
};

type State = {
  challenges: Array<Challenge>;
};

export class DiscoverTopic extends Component<Props, State> {
  state: State = {
    challenges: [],
  };

  async componentDidMount() {
    const fireSQL = new FireSQL(firebase.firestore());
    const challenges = (await fireSQL.query(`
      SELECT *
      FROM challenges
      WHERE topic = '${this.props.topic}'
    `)) as Array<Challenge>;
    this.setState({ challenges });
  }

  render() {
    const { topic } = this.props;
    const { challenges } = this.state;
    return (
      <Card title={`Catégorie : ${topic}`}>
        <>
          {challenges.map(challenge => (
            <Card title={challenge.title} key={challenge.title}>
              <View>
                <Text>{challenge.subTitle}</Text>
                <Text>{challenge.description}</Text>
                <Text>{challenge.rules}</Text>
                <Text>{challenge.duration}</Text>
              </View>
            </Card>
          ))}
        </>
      </Card>
    );
  }
}
