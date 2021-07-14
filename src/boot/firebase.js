import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: 'twitter-clone-9eba2.firebaseapp.com',
  projectId: 'twitter-clone-9eba2',
  storageBucket: 'twitter-clone-9eba2.appspot.com',
  messagingSenderId: '94638000525',
  appId: '1:94638000525:web:5557c472c1fe33da2115c4',
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

export default db;
