const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const unorderedConversationList = document.getElementById("unordered-conversation-list");

var sessionID = new Date().getTime();
var messageNum = 0;
var sessionNum = 0;
var userID = localStorage.getItem("userID");
var sessions = [];
var baseUrl = "http://localhost:3000"; 

console.log(userID);

const dataRef2 = `${baseUrl}/messages/${userID}`;
fetch(dataRef2)
    .then(response => response.json())
    .then(snapshot => {
        if (snapshot.exists) {
            console.log(snapshot.val());
            sessionNum = snapshot.val().length;
            for (let i = 0; i < snapshot.val().length; i++) {
                sessions.push(snapshot.val()[i]);
                const conversationItem = document.createElement('li');
                conversationItem.dataset.conversation = "" + (i + 1);
                conversationItem.appendChild(document.createTextNode("Conversation: " + (i + 1)));
                unorderedConversationList.appendChild(conversationItem);
            }
        } else {
            sessionNum = 0;
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
    if (i === 0) {
        // Initial message
        const assistantMessage = document.createElement('div');
        assistantMessage.className = 'assistant-message message';
        assistantMessage.textContent = "Hi there! How can I assist you today?";
        chatMessages.appendChild(assistantMessage);
        sessionID = new Date().getTime();
        messageNum = 0;
        return;
    }

    // Fetch data from the server
    fetch(`${baseUrl}/conversations/${sessions[i - 1]}`)
        .then(response => response.json())
        .then(data => {
            sessionID = sessions[i - 1];
            messageNum = data.length;
            data.forEach((message, index) => {
                const messageElement = document.createElement('div');
                messageElement.className = index % 2 === 0 ? 'user-message message' : 'assistant-message message';
                messageElement.textContent = message;
                chatMessages.appendChild(messageElement);
            });
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

function addUserMessage(message) {
    const userMessage = document.createElement('div');
    userMessage.className = 'user-message message';
    userMessage.textContent = message;
    chatMessages.appendChild(userMessage);
    userInput.value = '';

    storeMessage('user', message, userID);
}

function addAssistantMessage(message) {
    const assistantMessage = document.createElement('div');
    assistantMessage.className = 'assistant-message message';
    assistantMessage.textContent = message;
    chatMessages.appendChild(assistantMessage);

    storeMessage('assistant', message);
}

function storeMessage(type, message) {
    if (messageNum === 0) {
        // Create a new session
        fetch(`${baseUrl}/sessions/${userID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionID }),
        })
            .then(response => response.json())
            .then(data => {
                sessions.push(sessionID);
                sessionNum = sessions.length;

                const conversationItem = document.createElement('li');
                conversationItem.dataset.conversation = "" + sessionNum;
                conversationItem.appendChild(document.createTextNode("Conversation: " + sessionNum));
                unorderedConversationList.appendChild(conversationItem);

                console.log("Session created!");
            })
            .catch(error => {
                console.error("Error creating session:", error);
            });
    }

    // Store the message in the conversation
    fetch(`${baseUrl}/conversations/${sessionID}/${messageNum}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, userID }),
    })
        .then(response => response.json())
        .then(data => {
            messageNum = data.length;
            console.log("Message stored!");
        })
        .catch(error => {
            console.error("Error storing message:", error);
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
