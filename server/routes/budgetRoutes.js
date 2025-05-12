const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Budget = require("../models/budgetSchema");
const { updateUserBudgetWithPlaidCategories } = require("../config/budgetConfig");
const { updateUserBudgetInDB } = require('../config/budgetConfig');
const { plaidClient} = require('../config/plaidConfig');
const router = express.Router();

/// CRUD endpoints

// these need error handling... (on try blocks).

/// CREATE a new monthly budget plan
router.post("/post_budget", authMiddleware, async (req, res) => {
    try {
      const userId   = req.user.userId;
      const { name, category, budget, month } = req.body;

      // month should be a string like "January"
      if (!name || !category || !budget || !month) {
        return res.status(400).json({ message: "name, category, budget & month are all required" });
      }

      const newBudget = new Budget({
        userId,
        name,
        category,
        month,
        budget: Number(budget),
      });

      await newBudget.save();
      return res.status(201).json(newBudget);
    } catch (error) {
      console.error("Error saving budget:", error);
      return res.status(500).json({ message: "Server error", error });
    }
  }
);

/// READ: get all budgets for this user, optionally filtered by month
router.get("/get_all_budgets", authMiddleware, async (req, res) => {
    try {
      const userId = req.user.userId;
      const { month } = req.query;   

      const filter = { userId };
      if (month) filter.month = month;

      const budgets = await Budget.find(filter);
      return res.json(budgets);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      return res
        .status(500)
        .json({ message: "CAN'T GET ALL", error: error.message });
    }
  }
);

/// READ one budget by name (and optionally month via query)
router.get("/get_budget/:name", authMiddleware, async (req, res) => {
    try {
      const userId  = req.user.userId;
      const budgetName = req.params.name;
      const { month }  = req.query;

      const query = { userId, name: budgetName };
      if (month) query.month = month;

      const budget = await Budget.findOne(query);
      if (!budget) {
        return res.status(404).json({ message: "Budget not found" });
      }
      return res.json(budget);
    } catch (error) {
      console.error("Error fetching budget:", error);
      return res.status(500).json({ message: "CAN'T GET /:name", error });
    }
  }
);

/// UPDATE an existing budget (name, category, budget, or month)
router.patch( "/update_budget/:name", authMiddleware, async (req, res) => {
    try {
      const userId = req.user.userId;
      const originalName = req.params.name;
      const updates = req.body;   // may include name, category, budget, month

      // remove empty fields
      Object.keys(updates).forEach(key => {
        if (updates[key] === undefined || updates[key] === "") {
          delete updates[key];
        }
      });

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No updates provided" });
      }

      const updated = await Budget.findOneAndUpdate(
        { userId, name: originalName },
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (!updated) {
        return res.status(404).json({ message: "Budget to update not found" });
      }

      return res.json(updated);
    } catch (error) {
      console.error("Error updating budget:", error);
      return res.status(500).json({ message: "CAN'T UPDATE", error });
    }
  }
);

/// DELETE a budget by name (and optional month filter)
router.delete("/delete_budget/:name", authMiddleware, async (req, res) => {
    try {
      const userId  = req.user.userId;
      const budgetName = req.params.name;
      const { month }  = req.query;

      const query = { name: budgetName };
      if (month) query.month = month;

      const deleted = await Budget.findOneAndDelete(query);
      if (!deleted) {
        return res.status(404).json({ message: "Budget not found" });
      }

      return res.json({
        message: `${budgetName} (${deleted.month}) deleted`,
        deletedBudget: deleted,
      });
    } catch (error) {
      console.error("Error deleting budget:", error);
      return res.status(500).json({ message: "CAN'T DELETE", error });
    }
  }
);
// endpoints be was not used,


// router.get('/update_budget', async (req, res) => {
//     const { accessToken, userId } = req.query;
  
//     if (!accessToken || !userId) {
//       return res.status(400).json({ error: 'Access token and user ID are required' });
//     }
  
//     try {
//       const response = await plaidClient.transactionsGet({
//           // this will be changed later (for development purposes I needed to see if with the access token a user could update their expenses)
//           // it seems that's not currently possible with plaid. 
//         access_token: 'access-production-6882cda7-cca3-430f-b038-14849cd5208f', 
//         start_date: '2025-01-01',  
//         end_date: '2025-12-31',    
//       });
  
//       const transactions = response.data.transactions;
//       const updatedBudget = await updateUserBudgetWithPlaidCategories(transactions, userId);
//       await updateUserBudgetInDB(userId, updatedBudget);
  
//       res.json({ message: 'User budget updated successfully' });
//     } catch (error) {
//       console.error('Error:', error);
//       res.status(500).json({ error: 'An error occurred while processing transactions' });
//     }
//   });
  
module.exports = router;