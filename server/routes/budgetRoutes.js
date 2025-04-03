const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Budget = require("../models/budgetSchema");

const router = express.Router();

/// CRUD endpoints

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

router.patch('/update_budget', async(req,res) => {
    try{
        await res.send({ message: "hi update endpoint"});
    } catch(error) {
        console.error(error);
    }

});

router.delete('/delete_budget', async(req, res) =>{
    try{
        await res.send({ message: "hi delete endpoint"});
    } catch(error){
        console.error(error);
    }
});

module.exports = router;
