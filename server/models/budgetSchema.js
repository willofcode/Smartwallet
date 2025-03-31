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

const budgetCategorySchema = new mongoose.Schema({
    userId:
    { type: String,
      ref: User,
      required: true
    },

    name: 
    { type: String,
      required: true },

    budget:
    { type: Number,
      required: true }
});

const BudgetCategory = mongoose.model('BudgetCategory', budgetCategorySchema);

const budgetingSchema = new mongoose.Schema({
    userId:
    { type: String,
      ref: User,
      required: true
    },

    categories: 
    [{ type: mongoose.Schema.Types.ObjectId,
       ref: BudgetCategory
    }],

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