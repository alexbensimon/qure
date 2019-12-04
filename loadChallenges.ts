import firebase from 'firebase';
// import { challenges } from './challengesToLoad';
import { emptyChallenge } from './challengesToLoad';

export function loadChallenges() {
  const collection = firebase.firestore().collection('challenges');

  // challenges.forEach(challenge => {
  //   collection.add(challenge);
  // });

  for (let i = 0; i < 10; i++) {
    collection.add(emptyChallenge);
  }
}
