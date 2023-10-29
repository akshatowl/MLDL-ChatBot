import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

document.getElementById('loginForm').addEventListener('submit', function (e) { //fetch username and password entered in text fields of login page
    e.preventDefault();
    var username = document.getElementById('Username').value;
    var password = document.getElementById('Password').value;

window.onerror = function() { //function to throw error for wrong password/username
    alert('Error message: Wrong Username or Password');
    return true;
};

// Initialize Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyBPnrk6AHSsjpiConILj8gYbMGVrrGPw6U",
    authDomain: "mldl-chatbot.firebaseapp.com",
    databaseURL: "https://mldl-chatbot-default-rtdb.firebaseio.com",
    projectId: "mldl-chatbot",
    storageBucket: "mldl-chatbot.appspot.com",
    messagingSenderId: "988783282097",
    appId: "1:988783282097:web:9be4075e02a5e7fed31f90",
    measurementId: "G-1VQ6B1E6TD"
  };

  const firebaseApp = initializeApp(firebaseConfig);
  const database = getDatabase(firebaseApp);
  const userRef = ref(database, 'UserInfo');

  // Query the database to find a user with the entered username
  onValue(userRef, (snapshot) => {
      const users = snapshot.val();
      const user = Object.values(users).find(u => u.Username === username); //Query the database to find user that has same username and password

      if (user) {
          // User with the entered username exists
          if (user.Password === password) { //compare entered password to password in database
              
              console.log("User is authenticated");
              window.location.href = "main.html";

          } else {
              console.log("Password is incorrect");
              window.onerror();
              
          }
      } else {
          console.log("User not found");
      }
  });
});

const signupButton = document.querySelector('button[type="signup"]');
signupButton.addEventListener('click', function () {
    window.location.href = "signup.html"; // Redirect to the signup page
});

