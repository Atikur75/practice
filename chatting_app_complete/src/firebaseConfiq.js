// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuviVtkrcT84XtR8olvb5p3VHfnd1oVVA",
  authDomain: "attendence-12e92.firebaseapp.com",
  databaseURL: "https://attendence-12e92-default-rtdb.firebaseio.com",
  projectId: "attendence-12e92",
  storageBucket: "attendence-12e92.appspot.com",
  messagingSenderId: "471278190736",
  appId: "1:471278190736:web:d3f9490008323ab038d815"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default firebaseConfig;