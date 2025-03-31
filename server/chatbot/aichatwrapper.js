require('dotenv').config();
const { ChatOpenAI } = require('langchain/chat_models/openai');
const { ConversationChain } = require('langchain/chains');
const { BufferMemory } = require('langchain/memory');


// boilerplate for aichatWrapper
class aichatWrapper {
    constructor(modelName = "gpt-3.5-turbo", temperature = 0.7) {
        // Initialize the chatbot with default model and temperature
        // Initialize the OpenAI model
        this.chatModel = new ChatOpenAI({
            modelName: modelName,
            temperature: temperature,
            maxTokens: 300,
            openAIApiKey: process.env.OPENAI_API_KEY,
        });

        this.memory = new BufferMemory();
        this.conversation = new ConversationChain({
            llm: this.chatModel,
            memory: this.memory,
            verbose: false,
        });
    }

    // Method to send a message to the chatbot
    // will be modified for personalization
    async chat(userInput) {
        try {
            const response = await this.conversation.call({ input: userInput });
            return response.response;
        } catch (error) {
            console.error("Chatbot Error:", error.message);
            return "Sorry, something went wrong.";
        }
    }

    clearMemory() {
        this.memory.clear();
    }
}

module.exports = aichatWrapper;
