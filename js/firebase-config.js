// CardMax - Firebase Configuration
// Initialize Firebase services

const firebaseConfig = {
  apiKey: "AIzaSyDPeaQqZr3gpritpEr8ukAK9Jk2fmOvIjc",
  authDomain: "cardmax-aed88.firebaseapp.com",
  projectId: "cardmax-aed88",
  storageBucket: "cardmax-aed88.firebasestorage.app",
  messagingSenderId: "972421493637",
  appId: "1:972421493637:web:adcd0852cb93e179e94aec",
  measurementId: "G-8WBEJ6ZJFP"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export services for use in other files
const auth = firebase.auth();
const db = firebase.firestore();

// Google Auth Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();
