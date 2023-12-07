import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

document.getElementById('loginForm').addEventListener('submit', async function (e) { //fetch username and password entered in text fields of login page
    e.preventDefault();
    var username = document.getElementById('Username').value;
    var password = document.getElementById('Password').value;

window.onerror = function() { //function to throw error for wrong password/username
    alert('Error message: Wrong Username or Password');
    return true;
};
window.onuser = function() { //function to throw error for wrong password/username
    alert('No user found!');
    return true;
};
// Initialize Firebase Config
const baseUrl = "http://localhost:3000";
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

  try {
    // Use await within an async function
    const user = await getUserDataByUsername(baseUrl, username);

    if (user) {
        if (user.Password === password) {
            localStorage.setItem("userID", user.Username);
            console.log("User is authenticated");
            window.location.href = "main.html";
        } else {
            console.log("Password is incorrect");
            window.onerror();
        }
    } else {
        console.log("User not found");
        window.onuser()
        
    }
} catch (error) {
    console.error('Error fetching user data:', error);
}
});

async function getUserDataByUsername(baseUrl, username) {
try {
    const response = await fetch(`${baseUrl}/users/${username}`);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data;
} catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
}
}

const signupButton = document.querySelector('button[type="signup"]');
signupButton.addEventListener('click', function () {
    window.location.href = "signup.html"; 
});

 // Query the database to find a user with the entered username
//   onValue(userRef, (snapshot) => {
//       const users = snapshot.val();
//     //   const user = Object.values(users).find(u => u.Username === username); //Query the database to find user that has same username and password
//        const user = getUserDataByUsername(username)
//         console.log("this should be the user", user);
//       if (user) {
//           // User with the entered username exists
//           if (user.Password === password) { //compare entered password to password in database
//               localStorage.setItem("userID", user.Username);
//               console.log("User is authenticated");
//               window.location.href = "main.html";

//           } else {
//               console.log("Password is incorrect");
//               window.onerror();
              
//           }
//       } else {
//           console.log("User not found");
//       }
//   });
// });
// async function getUserDataByUsername(username) {
//     return fetch(`${baseUrl}/users/${username}`)
//       .then(response => response.json())
//       .then(data => {
//         console.log(data);
//         return data;
//       })
//       .catch(error => {
//         console.error('Error fetching user data:', error);
//         throw error;
//       });
//   }