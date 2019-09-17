import firebase from 'firebase';
import { challenges } from './challengesToLoad';

export function loadChallenges() {
  const collection = firebase.firestore().collection('challenges');

  challenges.forEach(challenge => {
    collection.add(challenge);
  });
}
