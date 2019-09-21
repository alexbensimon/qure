import firebase from 'firebase';
import React, { Component } from 'react';
import { Coach } from '../Coach';

type State = {
  sentences: Array<string>;
};

export class CommunityCoachContainer extends Component<{}, State> {
  state: State = {
    sentences: [],
  };

  async componentDidMount() {
    const doc = await firebase
      .firestore()
      .collection('coaches')
      .doc('basic')
      .get();
    this.setState({ sentences: doc.data().communitySentences });
  }

  render() {
    const { sentences } = this.state;
    return <Coach sentences={sentences} />;
  }
}
