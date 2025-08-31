// Simple test to make sure it works
console.log("AC Warranty Bot loaded!");

function handleKeyPress(event) {
    if (event.key === "Enter") {
        processInput();
    }
}

function processInput() {
    const input = document.getElementById("user-input");
    const userText = input.value.trim();
    
    if (!userText) return;
    
    addMessage(userText, true);
    input.value = "";
    
    // Simple response for testing
    addMessage("Thank you! This is a test response.");
}

function addMessage(message, isUser = false) {
    const chatMessages = document.getElementById("chat-messages");
    const messageDiv = document.createElement("div");
    messageDiv.className = isUser ? "message user-message" : "message bot-message";
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function verifyPayment() {
    alert("Payment verification would happen here!");
}

// Initialize chat
addMessage("Welcome! Please enter your AC's purchase date (DD-MM-YYYY format):");
