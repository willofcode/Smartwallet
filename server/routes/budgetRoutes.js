const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Budget = require("../models/budgetSchema");

const router = express.Router();

/// CRUD 
router.post("/post_budget", authMiddleware, async (req, res) => {
    try {
        console.log("User from middleware:", req.user);

        /// we shouldn't require the uid the user wouldn't know that tbh
        const { 
            category, 
            budget } = req.body;

        const newBudget = new Budget({
            userId: req.user.userId,
            category,
            budget,
        });

        await newBudget.save();
        console.log("Saved Budget:", newBudget);
        res.status(201).json(newBudget);

    } catch (error) {
        console.error("Error saving budget:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// this should either get by category or get by name...
router.get('/get_budget', async(req, res) => {
    try{
        await res.send({ message: "hi get endpoint"});
    } catch(error){
        console.error(error);
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
