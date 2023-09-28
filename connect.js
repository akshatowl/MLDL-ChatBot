document.addEventListener("DOMContentLoaded", function () {
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
    const chatMessages = document.getElementById("chat-messages");

    sendButton.addEventListener("click", function () {
        const userMessage = userInput.value.trim();
        if (userMessage === "") return;

        // Create and display user message
        const userMessageDiv = document.createElement("div");
        userMessageDiv.className = "message user";
        userMessageDiv.textContent = userMessage;
        chatMessages.appendChild(userMessageDiv);

        // Add animation to user message
        setTimeout(() => {
            userMessageDiv.classList.add("message-appear");
        }, 10);

        // Simulate a response from the chatbot
        setTimeout(() => {
            const chatbotResponseDiv = document.createElement("div");
            chatbotResponseDiv.className = "message chatbot";
            chatbotResponseDiv.textContent = "This is a sample chatbot response.";
            chatMessages.appendChild(chatbotResponseDiv);

            // Add animation to chatbot response
            setTimeout(() => {
                chatbotResponseDiv.classList.add("message-appear");
            }, 10);

            // Scroll to the bottom of the chat
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);

        // Clear the user input field
        userInput.value = "";
    });

    // Handle Enter key press
    userInput.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            sendButton.click();
        }
    });
});
