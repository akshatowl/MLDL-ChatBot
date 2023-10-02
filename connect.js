
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
    import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

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


        const chatMessages = document.getElementById('chat-messages');
        const userInput = document.getElementById('user-input');

        function addUserMessage(message) {
            const userMessage = document.createElement('div');
            userMessage.className = 'user-message message';
            userMessage.textContent = message;
            chatMessages.appendChild(userMessage);
            userInput.value = '';

            // Store the user message in Firebase
            storeMessage('user', message);
        }

        function addAssistantMessage(message) {
            const assistantMessage = document.createElement('div');
            assistantMessage.className = 'assistant-message message';
            assistantMessage.textContent = message;
            chatMessages.appendChild(assistantMessage);

            // Store the assistant's response in Firebase
            storeMessage('assistant', message);
        }

        function storeMessage(type, message) {
            const messageRef = ref(database, `messages/`+ (new Date().getTime()));
            set(messageRef, {
                message: message,
                timestamp: new Date().getTime()
            })
            .then(() => {
                console.log("Data stored!");
            })
            .catch((error) => {
                console.error("Error storing data:", error);
            });
        }

        userInput.addEventListener('keyup', function (event) {
            if (event.key === 'Enter') {
                const userMessage = userInput.value;
                addUserMessage(userMessage);

                // Simulate a response from the chatbot (you can replace this with actual logic)
                setTimeout(function () {
                    const response = 'You said: ' + userMessage;
                    addAssistantMessage(response);
                }, 1000);
                
            }});
        
           

