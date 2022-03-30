import * as firebase from "firebase";
import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD3UN20EgueyRIuQdTc-DoQXMbaWqN3R7o",
  authDomain: "rn-educ.firebaseapp.com",
  projectId: "rn-educ",
  storageBucket: "rn-educ.appspot.com",
  messagingSenderId: "698936691785",
  appId: "1:698936691785:web:28956df17dc9d50b76c398",
  measurementId: "G-MYW89Q6BNH",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
