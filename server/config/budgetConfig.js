const User = require('../models/User'); 

async function updateUserBudgetInDB(userId, updatedBudget) {
  const user = await User.findOne({ userId })
  ;
  if (!user) {
    throw new Error('User not found');
  }

  user.budget = updatedBudget; 
  await user.save();
}

async function updateUserBudgetWithPlaidCategories(transactions, userId) {
  const user = await User.findOne({ userId });
  if (!user) {
    throw new Error('User not found');
  }

  if (!user.budget) {
    user.budget = {};
  }

  for (let transaction of transactions) {
    const { amount, category } = transaction;

    for (let cat of category) {
      if (!user.budget.hasOwnProperty(cat)) {
        user.budget[cat] = 0;
      }
      user.budget[cat] += amount;
    }
  }

  await user.save();
  return user.budget;
}

  
  module.exports = {updateUserBudgetWithPlaidCategories, updateUserBudgetInDB };