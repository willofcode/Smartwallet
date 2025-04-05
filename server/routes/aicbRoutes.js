const express = require('express');
const router = express.Router();
const FinancialAdvisorChatbot = require('../chatbot/aichatwrapper');

// Initialize chatbot instance
const chatbot = new FinancialAdvisorChatbot();

// Chatbot interaction endpoint
router.post('/chat', async (req, res) => {
  const { message, userId } = req.body;

  // Validate the request body
  if (!message || !userId) {
    return res.status(400).json({ error: 'Message and userId are required' });
  }

  try {
    // Get the chatbot response
    const response = await chatbot.chat(message, userId);
    res.json({ response });
  } catch (error) {
    console.error('Error in chatbot route:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// status endpoint for chatbot
router.get('/status', async (req, res) => {
  try {
    // Attempt to check if chatbot service is available
    if (!chatbot) {
      throw new Error('Chatbot service not initialized');
    }
    res.json({ status: 'Chatbot service is running' });
  } catch (error) {
    console.error('Error checking chatbot status:', error.message);
    res.status(500).json({ error: 'Chatbot service unavailable' });
  }
});

module.exports = router;
