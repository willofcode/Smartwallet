const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: 
  { type: String, 
    required: true, 
    unique: true },

  accountId: 
  { type: String, 
    required: true },

  amount: 
  { type: Number, 
    required: true },

  date: 
  { type: Date, 
    required: true },

  description: 
  { type: String },
  
  category: 
  { type: [String] },

  merchantName: 
  { type: String },

  pending: 
  { type: Boolean, default: false },

  createdAt: 
  { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', transactionSchema);