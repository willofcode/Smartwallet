const { Tool } = require('langchain/tools');
const axios = require('axios');

class BudgetForecastTool extends Tool {
  constructor() {
    super();
    this.name = 'budget_forecast';
    this.description = 'Provides a forecast based on your average spending and budgeting suggestions.';
  }

  async _call({ access_token }) {
    try {
      const response = await axios.post(`${process.env.BASE_URL}/api/get_transactions`, {
        access_token,
      });

      const transactions = response.data.transactions;

      const monthGroups = {};

      transactions.forEach(txn => {
        const [year, month] = txn.date.split('-');
        const key = `${year}-${month}`;
        if (!monthGroups[key]) monthGroups[key] = 0;
        monthGroups[key] += txn.amount;
      });

      const months = Object.keys(monthGroups);
      const avgSpending = months.reduce((sum, m) => sum + monthGroups[m], 0) / months.length;

      return `Based on your past ${months.length} months, you spend about $${avgSpending.toFixed(2)} per month. 
To improve savings, consider allocating 50% to needs, 30% to wants, and 20% to savings/investments.`;
    } catch (err) {
      console.error('Budget forecast error:', err);
      return 'Unable to provide a budget forecast right now.';
    }
  }
}

module.exports = BudgetForecastTool;
