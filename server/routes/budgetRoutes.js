const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Budget = require("../models/budgetSchema");

const router = express.Router();

router.post("/post_budget", authMiddleware, async (req, res) => {
    try {
        console.log("User from middleware:", req.user);

        const { category, budget } = req.body;
        const newBudget = new Budget({
            userId: req.user.userId,
            category,
            budget,
        });

        await newBudget.save();
        res.status(201).json(newBudget);
    } catch (error) {
        console.error("Error saving budget:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;

/*

// this should either get by category or get by name...
router.get('/getBudget', async(req, res) => {
    try{
        await res.send({ message: "hi get endpoint"});
    } catch(error){
        console.error(error);
    }
});


router.patch('/updateBudget', async(req,res) => {
    try{
        await res.send({ message: "hi update endpoint"});
    } catch(error) {
        console.error(error);
    }

});

router.delete('/deleteBudget', async(req, res) =>{
    try{
        await res.send({ message: "hi delete endpoint"});
    } catch(error){
        console.error(error);
    }
});
*/