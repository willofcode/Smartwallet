const mongoose = require('mongoose');
const User = require("../models/User"); 

const expenseSchema = new mongoose.Schema({ 
    userId:
    { type: String,
      ref: User,
      required: true
    },

    category: 
    { type: String, 
      required: true },

    used: 
    { type: Number, 
      required: true },
    
    budget: 
    { type: Number,
      required: true },
    
});

const Expense = mongoose.model('Expense', expenseSchema);


const monthlyBudgetPlanSchema = new mongoose.Schema({
    userId:
    {
      type: String,
      ref: User,
      required: true
    },

    start:
    {
      type: Date,
      required: true
    },

    end:
    {
      type: Date,
      required: true
    },

    monthlyBudget:
    {
      type: Number,
      required: true 
    }
});
 

/// this is  the  main schema we'll be CRUDING data from
const budgetingSchema = new mongoose.Schema({
    userId:
    { type: String,
      ref: User,
      required: true
    },

    name: {
      type: String,
      required: true
    },

    category: 
    { type: String,
      required: true

    },

    month:
    { type: String,
      required: true
    },
  
    budget:
    { type: Number,
      required: true
    },

    expenses: 
    [{ type: mongoose.Schema.Types.ObjectId,
       ref: Expense
    }],

    totalPlannedExpenses:
    { type: Number,
      default: 0
    },

    leftToSpend:
    { type: Number,
      default: 0
    }
});

const Budgeting = mongoose.model('Budgeting', budgetingSchema);
module.exports = Budgeting;