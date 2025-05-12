const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Budget = require("../models/budgetSchema");

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
      const { month } = req.query;                // e.g. ?month=May

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

module.exports = router;

// endpoints be was not used,

// I can try to add a post expense and update expense endpoint
// this was the user can add how much money they've spent directly.
router.post('/add_expense', async (req, res) => {
    try {
        
    } catch(error){
        console.error("can't CREATE expense: ", error);
    }
});

router.patch('/update_expense', async (req, res) => {
    try{

    } catch(error){
        console.error("can't UPDATE expense: ", error);
    }
});

// From there all that's left is being able to post the budget the user intends to spend for the month
// it's also important to save the start and end date of the monthly plan

router.post('/add_monthly_budget', async (req, res) =>{
    try{

    } catch(error){
        console.error("can't UPDATE monthly budget: ", error);
    }
});

// The user should definitely be able to change the budget of the monthly plan
router.patch('/update_monthly_budget', async (req, res) =>{
    try{

    } catch(error){
        console.error("can't UPDATE monthly budget: ", error);
    }
});

module.exports = router;
