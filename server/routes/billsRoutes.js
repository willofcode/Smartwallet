const express = require('express');
const router = express.Router();
const plaidRecurringTransactions = require('../utils/plaidFuncBills.js');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

router.get('/recurring', async (req, res) => {
    try {
      const accessToken = 'access-production-6882cda7-cca3-430f-b038-14849cd5208f'; 
      await delay(800);
  
      console.log('plaid API Response:', plaidRecurringTransactions);
      
      res.json({
        recurring_streams: {
          inflow_streams: plaidRecurringTransactions.inflow_streams,
          outflow_streams: plaidRecurringTransactions.outflow_streams,
          updated_datetime: plaidRecurringTransactions.updated_datetime,
          request_id: plaidRecurringTransactions.request_id,
        },
      });
    } catch (error) {
      console.error('Error serving mock recurring transactions:', error);
      res.status(500).json({ error: 'Failed to retrieve recurring transaction data' });
    }
  });

module.exports = router;