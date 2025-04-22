// Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBcLEPqBMD6DHBnzlde0tp-mUgLKN07Ecw",
    authDomain: "eritest-de3d3.firebaseapp.com",
    projectId: "eritest-de3d3",
    storageBucket: "eritest-de3d3.firebasestorage.app",
    messagingSenderId: "511444603958",
    appId: "1:511444603958:web:4201ce2dc989e62ac67497"
  };
  
// Initialize Firebase
    const app = firebase.initializeApp(firebaseConfig);
    const database = firebase.firestore()