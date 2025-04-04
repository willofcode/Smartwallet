const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Budget = require("../models/budgetSchema");

const router = express.Router();

/// CRUD endpoints

// these need error handling.. (on try blocks).

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
router.get('/get_budget/:name', async(req, res) => {
    try{
        const budgetName = req.params.name;
        const budget = await Budget.findOne({ name: budgetName });

        res.json(budget);
  
    } catch(error){
        console.error(error);
        res.status(500).json({ message: "Cannot GET by name", error});
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
        res.status(500).json({ message: "Update Budget", error })
    }

});

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
    }
});

module.exports = router;
