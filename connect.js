import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

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
        var sessionNum = 1;
        var userID = 1;
        var sessions = [];

        const unorderedConversationList = document.getElementById("unordered-conversation-list");

        const dataRef2 = ref(database);
        get(child(dataRef2, "UserToMessages/" + userID)).then((snapshot) =>{
            if(snapshot.exists()) {
                console.log(snapshot.val());
                sessionNum = snapshot.val().length;
                for (let i = 0 ; i < snapshot.val().length ; i++) {
                    sessions.push(snapshot.val()[i]);
                    const conversationItem = document.createElement('li');
                    conversationItem.dataset.conversation = "" + (i+1);
                    conversationItem.appendChild(document.createTextNode("Conversation: " + (i + 1)));
                    unorderedConversationList.appendChild(conversationItem);
                }
            }
            else {
                sessionNum = 1;
            }
        })
        .catch((error) => {
            alert("Unsuccessful " + error);
        });

        const conversationList = document.getElementById('conversation-list');

        conversationList.addEventListener('click', function (event) {
            if (event.target.tagName === 'LI') {
                const selectedConversation = event.target.dataset.conversation;
                
               
                getData(parseInt(selectedConversation));
            }
        });

        function getData(i) {
            chatMessages.innerHTML = '';
            if(i == 0) {
                const assistantMessage = document.createElement('div');
                assistantMessage.className = 'assistant-message message';
                assistantMessage.textContent = "Hi there! How can I assist you today?";
                chatMessages.appendChild(assistantMessage);
                sessionID = new Date().getTime();
                messageNum = 0;
                return;
            }
            const dataRef = ref(database);
            // const sessions = [1696225565878, 1696199129829, 1696199956758, 1696205950086, 1696199956758]; //session key values
            get(child(dataRef, "Conversations/" + sessions[i-1])).then((snapshot) =>{
                if(snapshot.exists()) {
                    console.log(snapshot.val());
                    sessionID = sessions[i-1];
                    messageNum = snapshot.val().length
                    for (let i = 0 ; i < snapshot.val().length ; i++) {
                        if(i%2 == 0) {
                            const oldMessage = document.createElement('div');
                            oldMessage.className = 'user-message message';
                            oldMessage.textContent = snapshot.val()[i];
                            chatMessages.appendChild(oldMessage);
                        } else {
                            const oldMessage = document.createElement('div');
                            oldMessage.className = 'assistant-message message';
                            oldMessage.textContent = snapshot.val()[i];
                            chatMessages.appendChild(oldMessage);
                        }
                    }

                    console.log(messageNum + " " + snapshot.val()[0])
                }
                else {
                    alert("No data found");
                }
            })
            .catch((error) => {
                alert("Unsuccessful " + error);
            });
        }

        function addUserMessage(message) {
            const userMessage = document.createElement('div');
            userMessage.className = 'user-message message';
            userMessage.textContent = message;
            chatMessages.appendChild(userMessage);
            userInput.value = '';

            storeMessage('user', message); //sends to firebase
        }

        function addAssistantMessage(message) {
            const assistantMessage = document.createElement('div');
            assistantMessage.className = 'assistant-message message';
            assistantMessage.textContent = message;
            chatMessages.appendChild(assistantMessage);

            storeMessage('assistant', message);
        }

        function storeMessage(type, message) {
            if (messageNum == 0) {
                const sessionRef = ref(database, "UserToMessages/" + userID + "/" + sessionNum);
                set(sessionRef, sessionID)
                .then(() => {
                    sessions.push(sessionID);
                    sessionNum = sessionNum + 1;
                    const conversationItem = document.createElement('li');
                    conversationItem.dataset.conversation = "" + sessionNum;
                    conversationItem.appendChild(document.createTextNode("Conversation: " + sessionNum));
                    unorderedConversationList.appendChild(conversationItem);
                    console.log("Data stored!");
                })
                .catch((error) => {
                    console.error("Error storing data:", error);
                });
            }
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

                setTimeout(function () {
                    const response = 'You said: ' + userMessage;
                    addAssistantMessage(response);
                }, 1000);
            }
        });