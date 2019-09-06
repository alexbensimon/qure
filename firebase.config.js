import firebase from 'firebase';
import 'firebase/firestore';

const firebaseConfig = {
  projectId: 'qure-8a945',
  apiKey: 'AIzaSyDA8rY7oa3IUkux9etOXMSaFb5YY0SP6HY',
};

firebase.initializeApp(firebaseConfig);

// Listen for authentication state to change.
firebase.auth().onAuthStateChanged(user => {
  if (user != null) {
    console.log('We are authenticated now!');
  }
});

// Add info to user object
// firebase
//   .database()
//   .ref('users/' + user.uid)
//   .set({
//     highscore: score,
//   });
