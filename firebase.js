import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBJmsGVAEtqa4Yhv3IQdYCqhFHpKWeuj14",
  authDomain: "whatsapp-fce05.firebaseapp.com",
  projectId: "whatsapp-fce05",
  storageBucket: "whatsapp-fce05.appspot.com",
  messagingSenderId: "1087141382935",
  appId: "1:1087141382935:web:1177cdbf5cc48f2ee38552",
};

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig):
firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export {db, auth, provider};