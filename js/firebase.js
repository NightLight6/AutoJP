const firebaseConfig = {
  apiKey: "AIzaSyDue8Q8ThttRhDmPBht5Im3R5F33EXOk_M",
  authDomain: "xiii-teams.firebaseapp.com",
  databaseURL: "https://xiii-teams-default-rtdb.firebaseio.com",
  projectId: "xiii-teams",
  storageBucket: "xiii-teams.firebasestorage.app",
  messagingSenderId: "1001232620019",
  appId: "1:1001232620019:web:3b0398b885444770bd5a86",
  measurementId: "G-WR4J5ETVSH"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();
const storage = firebase.storage();

window.firebaseApp = app;
window.db = db;
window.auth = auth;
window.storage = storage;

console.log("Firebase успешно инициализирован через CDN");