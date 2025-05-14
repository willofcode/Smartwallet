require('dotenv').config();
const { ChatOpenAI } = require('@langchain/openai');
const { ConversationChain } = require('langchain/chains');
const { BufferMemory } = require('langchain/memory');
const { PromptTemplate } = require('@langchain/core/prompts');
const Conversation = require('../models/converse');
const TransactionInsightTool = require('./tools/TransactionInsightTool');
const BudgetForecastTool = require('./tools/BudgetForecastTool');
const InvestmentSimulatorTool = require('./tools/InvestmentSimulatorTool');
const { initializeAgentExecutorWithOptions } = require('langchain/agents');

class FinancialAdvisorChatbot {
  constructor(modelName = "gpt-3.5-turbo", temperature = 0.7) {
    this.chatModel = new ChatOpenAI({
      modelName,
      temperature,
      maxTokens: 500,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    this.memory = new BufferMemory({
      returnMessages: true,
      memoryKey: "chat_history",
      inputKey: "input",
    });

    const tools = [
      new TransactionInsightTool(),
      new BudgetForecastTool(),
      new InvestmentSimulatorTool(),
    ];

    // Initialize LangChain agent executor
    this.executorPromise = initializeAgentExecutorWithOptions(tools, this.chatModel, {
      agentType: "zero-shot-react-description",
      memory: this.memory,
      verbose: true, // Logs tool selection and steps
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
      
      Never suggest specific stocks or make promises about returns.
      Always clarify that you provide general advice and users should consult a certified financial advisor for specific investment decisions.
      
      Previous conversation history:
      {chat_history}
      
      Human: {input}
      AI: `);

    this.conversation = new ConversationChain({
      llm: this.chatModel,
      memory: this.memory,
      prompt: financialAdvisorPrompt,
      verbose: process.env.NODE_ENV === 'development',
    });
  }

  async chat(userInput, userId = 'default', access_token = '') {
    try {
      console.log(`User ${userId}: ${userInput}`);

      await this.loadConversationHistory(userId);
      const executor = await this.executorPromise;

      // Format input for tools that require access_token
      const toolInput = {
        input: userInput,
        access_token,
        userId,
      };

      const response = await executor.invoke({
        input: JSON.stringify(toolInput)
      });

      const message = response.output;
      console.log(`FinBot: ${message}`);

      await this.saveMessageToDB(userId, 'user', userInput);
      await this.saveMessageToDB(userId, 'bot', message);

      return message;
    } catch (error) {
      console.error("Chatbot Error:", error);
      return "I apologize, but I'm having trouble processing your request right now. Could you try again in a moment?";
    }
  }

  // Save message to database
  async saveMessageToDB(userId, role, message) {
    try {
      let conversation = await Conversation.findOne({ userId });
      if (!conversation) {
        conversation = await Conversation.create({
          userId,
          messages: [{ role, message, timestamp: new Date() }],
          createdAt: new Date(),
        });
      } else {
        conversation.messages.push({ role, message, timestamp: new Date() });
        await conversation.save();
      }
      console.log(`Message saved for user ${userId}`);
    } catch (error) {
      console.error("Error saving message to DB:", error);
    }
  }

  // Load conversation memory
  async loadConversationHistory(userId) {
    try {
      const conversation = await Conversation.findOne({ userId });
      if (conversation) {
        this.memory.chat_history = conversation.messages.map((msg) => ({
          role: msg.role === 'user' ? 'Human' : 'AI',
          content: msg.message,
        }));
        console.log(`Loaded history for user ${userId}`);
      }
    } catch (error) {
      console.error("Error loading conversation history:", error);
    }
  }

  clearMemory() {
    this.memory.clear();
    return "Conversation history has been cleared.";
  }

  async saveConversationHistory(userId) {
    try {
      const history = await this.memory.loadMemoryVariables({});
      console.log(`Saving memory for user ${userId}`);
      return history;
    } catch (error) {
      console.error("Error saving conversation history:", error);
    }
  }
}

module.exports = FinancialAdvisorChatbot;
