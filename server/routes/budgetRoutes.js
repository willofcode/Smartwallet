const express = require('express');
const router = express.Router();
const budget = require("../models/budgetSchema"); 


/*    ********        BUDGETING PAGE ENDPOINTS       *******       */

router.post('/post_budget', (req, res) => {
    res.send({ message: "hi post endpoint"});

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