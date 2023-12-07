import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
const serverEndpoint = 'http://localhost:3000/users';

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

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);
const apiUrl = "http://localhost:3000/users";
document.getElementById('registerButton').addEventListener('click', async function () {
    console.log("Register button clicked");
    const username = document.getElementById('Username').value;
    const password = document.getElementById('Password').value;
    const firstName = document.getElementById('FirstName').value;
    const lastName = document.getElementById('LastName').value;

    console.log("Username:", username);
    console.log("Password:", password);
    console.log("FirstName:", firstName);
    console.log("LastName:", lastName);

    if (!username || !password || !firstName || !lastName) {
        alert("Please fill in all required fields.");
        return;
    }

    const userRef = ref(database, 'UserInfo/');
   
    const userSnapshot = await get(userRef);
    const users = userSnapshot.val();

    console.log("Existing users:", users);

    if (users) {
        const existingUser = Object.values(users).find(u => u.Username === username);
        if (existingUser) {
            alert("User already exists in the database.");
            return;
        }
    }


    const newUser = {
        FirstName: firstName,
        LastName: lastName,
        Username: username,
        Password: password
    };
    fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify(newUser),
        
      })
      
        .then(response => response.json())
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.error(error);
        });

        alert("User registered successfully.");
        window.location.href = "index.html"; // Redirect to the index or login

});

