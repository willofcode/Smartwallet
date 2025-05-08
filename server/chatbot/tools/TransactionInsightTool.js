const { Tool } = require('langchain/tools');
const axios = require('axios');
const { extractDateRange, extractCategory, isRecurringSearch } = require('../utils/nlpParser');

class TransactionInsightTool extends Tool {
  constructor() {
    super();
    this.name = 'transaction_insight';
    this.description = 'Analyzes transactions and provides spending insights based on category, date range, or recurrence.';
  }

  async _call(input) {
    try {
      const { input: userMessage, access_token } = input;
      const dateRange = extractDateRange(userMessage);
      const category = extractCategory(userMessage);
      const recurring = isRecurringSearch(userMessage);

      const response = await axios.post(`${process.env.BASE_URL}/api/get_transactions`, {
        access_token,
      });

      let transactions = response.data.transactions;

      // Filter logic
      if (dateRange) {
        const [start, end] = dateRange;
        transactions = transactions.filter(transaction => transaction.date >= start && transaction.date <= end);
      }

      if (category) {
        transactions = transactions.filter(transaction => transaction.category?.some(cat => cat.toLowerCase().includes(category.toLowerCase())));
      }

      if (recurring) {
        const seen = new Map();
        transactions.forEach(transaction => {
          const key = `${transaction.name}_${transaction.amount}`;
          seen.set(key, (seen.get(key) || 0) + 1);
        });
        transactions = transactions.filter(transaction => seen.get(`${transaction.name}_${transaction.amount}`) > 1);
      }

      // Summary insights
      const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
      const average = (totalSpent / transactions.length) || 0;

      if (transactions.length === 0) {
        return "No significant transactions found for that time or category.";
      }

      let insight = `You had ${transactions.length} ${recurring ? 'recurring ' : ''}${category ? category + ' ' : ''}transactions`;

      if (dateRange) {
        insight += ` between ${dateRange[0]} and ${dateRange[1]}`;
      }

      insight += `. You spent a total of $${totalSpent.toFixed(2)} with an average of $${average.toFixed(2)} per transaction.`;

      if (recurring) {
        insight += " Consider reviewing subscriptions to identify services you no longer use.";
      }

      return insight;

    } catch (error) {
      console.error('Insight generation failed:', error);
      return 'Unable to generate insights due to a processing error.';
    }
  }
}

module.exports = TransactionInsightTool;
