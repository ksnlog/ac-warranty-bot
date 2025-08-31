let currentStep = "start";
let acAge = 0;
let selectedOption = null;
let purchaseDate = "";

const prices = { "1": 6999, "2": 3999, "3": 2999 };
const durations = { "1": "4 years", "2": "2 years", "3": "1 year" };

function handleKeyPress(event) {
    if (event.key === "Enter") {
        processInput();
    }
}

function addMessage(message, isUser = false) {
    const chatMessages = document.getElementById("chat-messages");
    const messageDiv = document.createElement("div");
    messageDiv.className = isUser ? "message user-message" : "message bot-message";
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function processInput() {
    const input = document.getElementById("user-input");
    const userText = input.value.trim();
    
    if (!userText) return;
    
    addMessage(userText, true);
    input.value = "";
    
    switch(currentStep) {
        case "start":
            handlePurchaseDate(userText);
            break;
        case "option_select":
            handleOptionSelect(userText);
            break;
        case "declaration":
            handleDeclaration(userText);
            break;
        case "payment_verify":
            handlePaymentVerification(userText);
            break;
    }
}

function handlePurchaseDate(dateStr) {
    try {
        const [day, month, year] = dateStr.split("-").map(Number);
        const purchaseDateObj = new Date(year, month - 1, day);
        const today = new Date();
        
        let age = today.getFullYear() - purchaseDateObj.getFullYear();
        if (today.getMonth() < purchaseDateObj.getMonth() || 
            (today.getMonth() === purchaseDateObj.getMonth() && today.getDate() < purchaseDateObj.getDate())) {
            age--;
        }
        
        acAge = age;
        purchaseDate = dateStr;
        
        if (age >= 4) {
            addMessage("Sorry! Your AC is " + age + " years old. Extended warranty is only available for ACs under 4 years.");
            return;
        }
        
        addMessage("Great! Your AC is " + age + " year(s) old and eligible for extended warranty.");
        showWarrantyOptions();
        
    } catch (error) {
        addMessage("Invalid date format. Please use DD-MM-YYYY format (e.g., 01-01-2023):");
    }
}

function showWarrantyOptions() {
    addMessage("Please choose an option:");
    
    if (acAge < 1) {
        addMessage("1. 4 years extension - ₹6,999.00");
        addMessage("2. 2 years extension - ₹3,999.00");
        addMessage("3. 1 year extension - ₹2,999.00");
    } else if (acAge < 3) {
        addMessage("1. 2 years extension - ₹3,999.00");
        addMessage("2. 1 year extension - ₹2,999.00");
    } else {
        addMessage("1. 1 year extension - ₹2,999.00");
    }
    
    addMessage('Type "coverage" to see what\'s covered.');
    currentStep = "option_select";
}

function handleOptionSelect(choice) {
    if (choice.toLowerCase() === "coverage") {
        showCoverageDetails();
        return;
    }
    
    const validChoices = acAge < 1 ? ["1", "2", "3"] : (acAge < 3 ? ["1", "2"] : ["1"]);
    
    if (validChoices.includes(choice)) {
        selectedOption = choice;
        addMessage("You selected: " + durations[choice] + " extension for ₹" + prices[choice].toLocaleString() + ".00");
        showDeclaration();
    else {
        addMessage("Invalid choice. Please select a valid option:");
        showWarrantyOptions();
    }
}

function showCoverageDetails() {
    addMessage("✓ COVERED: All breakdowns, 2 free services/year, critical parts, gas charge");
    addMessage("✗ NOT COVERED: Plastic parts, external damage, industrial areas, misuse");
    showWarrantyOptions();
}

function showDeclaration() {
    addMessage("Please confirm ALL of the following by typing \"YES\":");
    addMessage("✓ I entered correct purchase date: " + purchaseDate);
    addMessage("✓ I have valid invoice copy");
    addMessage("✓ My AC is working well, no major issues");
    addMessage("✓ My AC is in residential area");
    addMessage("✓ Wrong information will cancel warranty");
    currentStep = "declaration";
}

function handleDeclaration(response) {
    if (response.toUpperCase() === "YES") {
        addMessage("Declaration accepted! ✅");
        showPaymentOptions();
    } else {
        addMessage("Please confirm all statements to proceed. Type \"YES\" to confirm:");
    }
}

function showPaymentOptions() {
    const amount = prices[selectedOption];
    
    document.getElementById("payment-section").style.display = "block";
    document.getElementById("payment-details").innerHTML = 
        '<div class="success-message">' +
        '<h4>Payment Amount: ₹' + amount.toLocaleString() + '.00</h4>' +
        '<p>Please pay using any UPI app:</p>' +
        '<div class="coverage-details">' +
        '<strong>UPI ID:</strong> YOUR-ACTUAL-UPI-ID@YBL<br>' +
        '<strong>Amount:</strong> ₹' + amount.toLocaleString() + '.00<br>' +
        '<strong>Description:</strong> AC Warranty Extension' +
        '</div>' +
        '<p>After payment, click the button below and enter Transaction ID.</p>' +
        '</div>';
    
    addMessage("Payment instructions displayed below. Complete payment and click verify.");
    currentStep = "payment_verify";
}

function verifyPayment() {
    const transId = prompt("Please enter your UPI Transaction ID:");
    if (transId) {
        completeOrder(transId);
    } else {
        alert("Please enter a valid Transaction ID.");
    }
}

function handlePaymentVerification(transId) {
    if (transId) {
        completeOrder(transId);
    }
}

function completeOrder(transId) {
    addMessage("Payment verified successfully! ✅");
    addMessage("Your extended warranty has been activated.");
    addMessage("Transaction Reference: " + transId);
    
    document.getElementById("payment-details").innerHTML = 
        '<div class="success-message">' +
        '<h3>🎉 Order Confirmed! 🎉</h3>' +
        '<p><strong>Product:</strong> AC Warranty (' + durations[selectedOption] + ')</p>' +
        '<p><strong>Amount Paid:</strong> ₹' + prices[selectedOption].toLocaleString() + '.00</p>' +
        '<p><strong>Transaction ID:</strong> ' + transId + '</p>' +
        '<p>Thank you for your purchase! Keep invoice copy safe.</p>' +
        '</div>';
    
    currentStep = "complete";
}

// Initialize chat
addMessage("Welcome! Please enter your AC's purchase date (DD-MM-YYYY format):");
