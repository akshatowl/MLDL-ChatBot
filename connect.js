const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const unorderedConversationList = document.getElementById("unordered-conversation-list");

var sessionID = new Date().getTime();
var messageNum = 0;
var sessionNum = 0;
var userID = localStorage.getItem("userID");
var sessions = [];
var baseUrl = "http://localhost:3000"; 
var messageContext = [];
messageContext.push({"role": "system", "content": "You are an assistant that collaborates with machine learning researchers to do machine learning research. Provide accurate answers to the questions asked by the user."});

console.log(userID);

const dataRef2 = `${baseUrl}/sessions/${userID}`;
fetch(dataRef2)
    .then(response => response.json())
    .then(data => {
        console.log(data.data);
        // if (data.exists) {
            // console.log(data[data]);
        sessionNum = data.data.length;
        for (let i = 0 ; i < data.data.length ; i++) {
            sessions.push(data.data[i]);
            const conversationItem = document.createElement('li');
            conversationItem.dataset.conversation = "" + (i+1);
            conversationItem.appendChild(document.createTextNode("Conversation: " + (i + 1)));
            unorderedConversationList.appendChild(conversationItem);
        }
                // }
        // } else {
        //     sessionNum = 0;
        // }

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
        messageContext = [];
        messageContext.push({"role": "system", "content": "You are an assistant that collaborates with machine learning researchers to do machine learning research. Provide accurate answers to the questions asked by the user."});
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
                    if(index % 2 === 0) {
                        messageContext.push({"role": "user", "content": message}); 
                    } else {
                        messageContext.push({"role": "assistant", "content": message});
                    }
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
        messageContext.push({"role": "user", "content": message}); 

        storeMessage('user', message, userID);
    }
    
    function addAssistantMessage(message) {
        const assistantMessage = document.createElement('div');
        assistantMessage.className = 'assistant-message message';
        assistantMessage.textContent = message;
        chatMessages.appendChild(assistantMessage);
        messageContext.push({"role": "assistant", "content": message});
        storeMessage('assistant', message);
    }
    
    function storeMessage(type, message) {
        if (messageNum === 0) {
            // Create a new session
            fetch(`${baseUrl}/sessions/${userID}/${sessionNum}`, {
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
                // messageNum = data.length;
                console.log("Message stored!");
            })
            .catch(error => {
                console.error("Error storing message:", error);
            });
    }

    userInput.addEventListener('keyup', async function (event) {
        if (event.key === 'Enter') {
            const userMessage = userInput.value;
            addUserMessage(userMessage);
            messageNum = messageNum + 1;

            var lastMessageContext = messageContext;
            if (messageContext.length > 10) {
                lastMessageContext = messageContext.slice(-10);
                lastMessageContext.splice(0, 0, {"role": "system", "content": "You are an assistant that collaborates with machine learning researchers to do machine learning research. Provide accurate answers to the questions asked by the user."})
            }
            console.log(lastMessageContext);

            await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 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',
                },
                body: JSON.stringify({
                    "model": "gpt-3.5-turbo",
                    "messages": lastMessageContext,
                    "max_tokens": 100
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP error! Status: ${response.status}");
                }
                return response.json();
            })
            .then(data => {
                addAssistantMessage(data.choices[0].message.content);
                messageNum = messageNum + 1;
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    });

    // userInput.addEventListener('keyup', async function (event) {
    //     if (event.key === 'Enter') {
    //         const userMessage = userInput.value;
    //         addUserMessage(userMessage);
    //         messageNum = messageNum + 1;

    //         var lastMessageContext = messageContext;
    //         if (messageContext.length > 10) {
    //             lastMessageContext = messageContext.slice(-10);
    //             lastMessageContext.splice(0, 0, {"role": "system", "content": "You are an assistant that collaborates with machine learning researchers to do machine learning research. Provide accurate answers to the questions asked by the user."})
    //         }
    //         console.log(lastMessageContext);

    //         fetch(`${baseUrl}/llm`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ lastMessageContext }),
    //         })
    //             .then(response => response.json())
    //             .then(data => {
    //                 // messageNum = data.length;
    //                 messageNum = messageNum + 1;
    //                 console.log(data);
    //                 addAssistantMessage(data);
    //             })
    //             .catch(error => {
    //                 console.error("Error storing message:", error);
    //             });
    //     }
    // });