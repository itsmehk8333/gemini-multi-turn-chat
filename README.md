# Gemini Multi-Turn Chat

A Node.js-based interactive chatbot using Google's Gemini AI model that supports multi-turn conversations with customizable parameters.

## Features

- Interactive command-line interface for chatting with Gemini AI
- Configurable model parameters (temperature, top-p, max tokens)
- Multi-turn conversation support with chat history
- Environment variable based API key management
- User-friendly error handling and input validation

## Prerequisites

- Node.js (v14 or higher)
- A Google AI API key (Gemini)

## Setup

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd gemini-multi-turn-chat
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Google API key:
   ```
   GOOGLE_API_KEY=your_api_key_here
   ```

## Running the Chatbot

1. Start the chatbot:
   ```bash
   node index.js
   ```

2. When prompted, you can configure the following parameters (or press Enter for defaults):
   - Temperature (0.0 - 2.0, default: 0.7)
   - Top-P (0.0 - 1.0, default: 0.9)
   - Max Output Tokens (50-2048, default: 500)

3. Start chatting! Type your messages and press Enter to send.

4. To exit the chat, type 'exit' or 'quit'.

## Dependencies

- `@google/generative-ai`: Google's official Node.js client for Gemini AI
- `dotenv`: For environment variable management
- `readline`: Node.js built-in module for console input

## Error Handling

The script includes error handling for:
- Missing API key
- Invalid model parameters
- API communication errors
- Empty user input

## License

[Your chosen license] 