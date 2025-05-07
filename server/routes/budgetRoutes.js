const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Budget = require("../models/budgetSchema");
const { updateUserBudgetWithPlaidCategories } = require("../config/budgetConfig");
const { updateUserBudgetInDB } = require('../config/budgetConfig');
const { plaidClient} = require('../config/plaidConfig');
const router = express.Router();

/// CRUD endpoints

// these need error handling... (on try blocks).

router.post("/post_budget", authMiddleware, async (req, res) => {
    try {
        console.log("User from middleware:", req.user);

        /// we shouldn't require the uid the user wouldn't know that tbh
        const { 
            name,
            category, 
            budget } = req.body;

        const new_budget = new Budget({
            userId: req.user.userId,
            name,
            category,
            budget,
        });

        await new_budget.save();
        console.log("Saved Budget:", new_budget);
        res.status(201).json(new_budget);

    } catch (error) {
        console.error("Error saving budget:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// this should get all budgets for a specific user. this could be based off id (userid)
router.get('/get_all_budgets', authMiddleware, async(req, res) => {
    try{
        //await res.json({ message: "hi get all budgets" });
        const userId = req.user.userId;
        const budgets = await Budget.find({ userId });

        res.json(budgets);

    }catch(error){
        console.error("Error details:", error);
        res.status(500).json({ message: "CAN'T GET ALL: ", error: error.message});
    }
});

router.get('/get_budget/:name', async(req, res) => {
    try{
        const budgetName = req.params.name;
        const budget = await Budget.findOne({ name: budgetName });

        res.json(budget);
  
    } catch(error){
        console.error(error);
        res.status(500).json({ message: "CAN'T GET/:name :", error});
    }
});

//200!
router.patch('/update_budget/:name', async(req,res) => {
    try{

        const findBudgetName = req.params.name;
        const updateBudgetData = req.body;

        if(Object.keys(updateBudgetData).length === 0) {
            return res.status(404).json({ message: "Cannot update, budget not found."});
        }

        else{

            const updatedBudget =  await Budget.findOneAndUpdate(
                { name: findBudgetName },
                { $set: updateBudgetData },
                { new: true,
                runValidators: true
                }
            );

            res.json(updatedBudget);
        }

    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "CAN'T UPDATE: ", error });
    }

});

//200
router.delete('/delete_budget/:name', async(req, res) =>{
    try{
        const budgetName = req.params.name;
        const deletedBudget = await Budget.findOneAndDelete({ name: budgetName });

        if(!deletedBudget){
            res.status(404).json({ message: "Budget Not Found."});
        }

        else{
            res.json({deletedBudget, message:`${budgetName} has been deleted`});
        }

    } catch(error){
        console.error(error);
        res.status(500).json({ message: "CAN'T DELETE: ", error });
    }
});

router.get('/update_budget', async (req, res) => {
  const { accessToken, userId } = req.query;

  if (!accessToken || !userId) {
    return res.status(400).json({ error: 'Access token and user ID are required' });
  }

  try {
    const response = await plaidClient.transactionsGet({
        // this will be changed later (for development purposes I needed to see if with the access token a user could update their expenses)
        // it seems that's not currently possible with plaid. 
      access_token: 'access-production-6882cda7-cca3-430f-b038-14849cd5208f', 
      start_date: '2025-01-01',  
      end_date: '2025-12-31',    
    });

    const transactions = response.data.transactions;

    const updatedBudget = await updateUserBudgetWithPlaidCategories(transactions, userId);

    await updateUserBudgetInDB(userId, updatedBudget);

    res.json({ message: 'User budget updated successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing transactions' });
  }
});

module.exports = router;