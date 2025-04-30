// Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCyf_g1e6g4nFYk6IMa6umJ7r7f9YdNjHs",
    authDomain: "ddu-eksamenspro.firebaseapp.com",
    projectId: "ddu-eksamenspro",
    storageBucket: "ddu-eksamenspro.firebasestorage.app",
    messagingSenderId: "684525044400",
    appId: "1:684525044400:web:acaaa98e8dc0ccb4703175",
    measurementId: "G-86K7486E15"
  };
  
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.firestore()
