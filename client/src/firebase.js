import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

var firebaseConfig = {
    apiKey: "AIzaSyCwQmr5r4q5CVjDrpFfYQWr6NyHMvGj1E4",
    authDomain: "react-otp-d68c5.firebaseapp.com",
    projectId: "react-otp-d68c5",
    storageBucket: "react-otp-d68c5.appspot.com",
    messagingSenderId: "666104085871",
    appId: "1:666104085871:web:cd6aa81068eb9bb6d5bc9a"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase
