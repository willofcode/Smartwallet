const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Budget = require("../models/budgetSchema");

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

// filtering how a user can retrieve their budget plans
// this should get name


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
        console.error("can't CREATE monthly budget: ", error);
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
