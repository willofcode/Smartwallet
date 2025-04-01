require('dotenv').config();
const { ChatOpenAI } = require('@langchain/openai');
const { ConversationChain } = require('langchain/chains');
const { BufferMemory } = require('langchain/memory');
const { PromptTemplate } = require('@langchain/core/prompts');

class FinancialAdvisorChatbot {
  constructor(modelName = "gpt-3.5-turbo", temperature = 0.7) {
    // Initialize the OpenAI model
    this.chatModel = new ChatOpenAI({
      modelName: modelName,
      temperature: temperature,
      maxTokens: 500,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    // Create a memory instance with return messages flag
    this.memory = new BufferMemory({
      returnMessages: true,
      memoryKey: "chat_history",
      inputKey: "input",
    });

    // Define the financial advisor prompt template
    const financialAdvisorPrompt = PromptTemplate.fromTemplate(`
      You are a helpful and knowledgeable financial advisor assistant. Your name is FinBot.
      
      Your responsibilities include:
      - Providing personalized financial advice
      - Explaining financial concepts in simple terms
      - Helping with budgeting, investing, and financial planning
      - Recalling previous conversations to maintain context
      - Being polite, professional, and supportive
      
      Always introduce yourself as FinBot on first interaction. Never suggest specific stocks or make promises about returns.
      Always clarify that you provide general advice and users should consult a certified financial advisor for specific investment decisions.
      
      Previous conversation history:
      {chat_history}
      
      Human: {input}
      AI: `);

    // Create the conversation chain
    this.conversation = new ConversationChain({
      llm: this.chatModel,
      memory: this.memory,
      prompt: financialAdvisorPrompt,
      verbose: process.env.NODE_ENV === 'development',
    });
  }

  // Method to send a message to the chatbot
  async chat(userInput, userId = 'default') {
    try {
      // Log the incoming message (could be stored in a database in production)
      console.log(`User ${userId}: ${userInput}`);
      
      const response = await this.conversation.call({ input: userInput });
      
      // Log the outgoing response
      console.log(`FinBot: ${response.response}`);
      
      return response.response;
    } catch (error) {
      console.error("Chatbot Error:", error);
      return "I apologize, but I'm having trouble processing your request right now. Could you try again in a moment?";
    }
  }

  // Method to clear the conversation memory
  clearMemory() {
    this.memory.clear();
    return "Conversation history has been cleared.";
  }

  // Method to save conversation history (for future implementation)
  async saveConversationHistory(userId) {
    // This would integrate with a database in a production environment
    const history = await this.memory.loadMemoryVariables({});
    console.log(`Saving conversation history for user ${userId}`);
    return history;
  }

  // Method to load conversation history (for future implementation)
  async loadConversationHistory(userId, history) {
    // This would integrate with a database in a production environment
    console.log(`Loading conversation history for user ${userId}`);
    // Implementation would depend on the specific database integration
  }
}

module.exports = FinancialAdvisorChatbot;