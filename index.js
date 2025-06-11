// Load environment variables from .env file
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');
const readline = require('readline'); // Node.js built-in module for console input

// Access your API key from environment variables
const API_KEY = process.env.GOOGLE_API_KEY;

if (!API_KEY) {
    console.error("Error: GOOGLE_API_KEY not found in environment variables.");
    console.error("Please create a .env file with GOOGLE_API_KEY=\"YOUR_API_KEY_HERE\"");
    process.exit(1); // Exit the process if API key is missing
}

let genAI;
let model;
let chatSession;

// Setup readline interface for console input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Prompts the user for a value and returns a Promise that resolves with the input.
 * @param {string} promptText The text to display as a prompt.
 * @returns {Promise<string>} A promise that resolves with the user's input.
 */
function askQuestion(promptText) {
    return new Promise((resolve) => {
        rl.question(promptText, (answer) => {
            resolve(answer);
        });
    });
}

/**
 * Validates a number input to be within a specific range.
 * @param {string} input The user's string input.
 * @param {number} min The minimum allowed value.
 * @param {number} max The maximum allowed value.
 * @param {number} defaultValue A default value to use if input is invalid.
 * @returns {number} The validated number or default value.
 */
function validateNumberInput(input, min, max, defaultValue) {
    const num = parseFloat(input);
    if (isNaN(num) || num < min || num > max) {
        console.log(`Invalid input. Using default value: ${defaultValue} (range: ${min}-${max})`);
        return defaultValue;
    }
    return num;
}

async function initializeChatbot() {
    console.log("Initializing Gemini Chatbot...");

    // --- Prompt for Model Parameters ---
    const defaultTemperature = 0.7;
    const defaultTopP = 0.9;
    const defaultMaxOutputTokens = 500;

    console.log("\n--- Configure Model Parameters (press Enter for defaults) ---");
    const tempInput = await askQuestion(`Enter Temperature (0.0 - 2.0, default: ${defaultTemperature}): `);
    const topPInput = await askQuestion(`Enter Top-P (0.0 - 1.0, default: ${defaultTopP}): `);
    const maxTokensInput = await askQuestion(`Enter Max Output Tokens (e.g., 50-2000, default: ${defaultMaxOutputTokens}): `);

    const temperature = validateNumberInput(tempInput, 0.0, 2.0, defaultTemperature);
    const topP = validateNumberInput(topPInput, 0.0, 2.0, defaultTopP);
    const maxOutputTokens = validateNumberInput(maxTokensInput, 50, 2048, defaultMaxOutputTokens); // Reasonable min/max for tokens

    // Initialize Generative AI with dynamic config
    genAI = new GoogleGenerativeAI(API_KEY);

    const modelConfig = {
        model: "gemini-2.0-flash", // Using the confirmed model name
        generationConfig: {
            maxOutputTokens: maxOutputTokens,
            temperature: temperature,
            topP: topP,
            // topK: 32, // Optional: Another parameter you might explore
        },
    };

    model = genAI.getGenerativeModel(modelConfig);

    try {
        // Start a new chat session. The initial history can be empty or pre-seeded.
        chatSession = model.startChat({
            history: [
                // {
                //     role: "user",
                //     parts: [{ text: "You are a helpful AI assistant. Always respond in a friendly tone." }]
                // },
                // {
                //     role: "model",
                //     parts: [{ text: "Understood! I will do my best to be friendly and helpful." }]
                // }
            ],
        });
        console.log("\nChatbot ready! You can now start the conversation.");
        console.log("Type 'exit' or 'quit' to end at any time.");
        console.log(`Current Model: ${modelConfig.model}`);
        console.log(`Parameters: Temperature=${temperature}, Top-P=${topP}, Max Tokens=${maxOutputTokens}\n`);
        
        startConversationLoop(); // Start the conversation loop
    } catch (error) {
        console.error("Failed to initialize chatbot:", error);
        process.exit(1);
    }
}

async function startConversationLoop() {
    while (true) {
        const userInput = await askQuestion("You: ");
        const lowerCaseInput = userInput.toLowerCase();

        if (lowerCaseInput === 'exit' || lowerCaseInput === 'quit') {
            console.log("Chatbot: Goodbye!");
            rl.close();
            break; // Exit the loop
        }

        if (userInput.trim() === '') {
            console.log("Chatbot: Please type something.");
            continue; // Skip to the next iteration of the loop
        }

        try {
            console.log("Chatbot: (thinking...)");
            // Send the user's message to the chat session
            // The ChatSession automatically sends the accumulated history with each call
            const result = await chatSession.sendMessage(userInput);
            const botResponse = result.response.text();
            console.log(`Chatbot: ${botResponse}`); // Prints the model's last response
        } catch (error) {
            console.error("Error communicating with Gemini:", error);
            console.log("Chatbot: Oops! I encountered an error. Please try again.");
            // Optionally, you might want to break here or handle error differently
        }
    }
}

// Start the chatbot initialization process
initializeChatbot();