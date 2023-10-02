 
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
        var sessionID = new Date().getTime();
        var messageNum = 0;

        const conversationList = document.getElementById('conversation-list');
        // const chatMessages = document.getElementById('chat-messages');
        // const userInput = document.getElementById('user-input');

        conversationList.addEventListener('click', function (event) {
            if (event.target.tagName === 'LI') {
                const selectedConversation = event.target.dataset.conversation;
                
                // You can use the selectedConversation data for further actions, e.g., displaying it in the chat or loading related data.
                
                // For now, let's display the selected conversation in the chat as an example.
                addAssistantMessage('You selected: ' + selectedConversation);
            }
        });

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
            const messageRef = ref(database, "Conversations/" + sessionID +"/" + messageNum);
            set(messageRef, message)
            .then(() => {
                messageNum = messageNum + 1;
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
            }
        });
