import app from "firebase/app";

const config = {
  apiKey: "AIzaSyCw9jzWKi__glgNrIUqv5GNM6ysu6C-SK8",
  authDomain: "marvel-quiz-578d3.firebaseapp.com",
  projectId: "marvel-quiz-578d3",
  storageBucket: "marvel-quiz-578d3.appspot.com",
  messagingSenderId: "648767091854",
  appId: "1:648767091854:web:5894bc78564ffaebd185df",
};

class Firebase {
  constructor() {
    app.initializeApp(config);
  }
}

export default Firebase;
