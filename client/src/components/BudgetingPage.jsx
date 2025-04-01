'use client';

import React, { useState } from 'react';
import Sidebar from "../components/sideBar";
///import { axios } from 'axios';

const BudgetingPage = () => {
  const [pageState, setPageState] = useState('overview'); 

  // Now we have 5 default categories instead of 3
  const [categories, setCategories] = useState([
    "Food", 
    "Housing", 
    "Transportation",
    "Entertainment",
    "Education"
  ]);

  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newBudget, setNewBudget] = useState('');

  // Accordion-like state for toggling each category's details
  const [openCategoryIndex, setOpenCategoryIndex] = useState(null);

  // Example data for the "Total Planned Expenses" section
  const expenseData = [
    { category: "Housing", used: 750, budget: 900, dates: "15 Sep - 12 Oct" },
    { category: "Food", used: 1000, budget: 900, dates: "15 Sep - 12 Oct" },
    { category: "Transportation", used: 300, budget: 300, dates: "15 Sep - 12 Oct" },
  ];

  // Predefined categories for the dropdown in "Add Category" form
  const categoryOptions = [
    "Food",
    "Gas",
    "Housing",
    "Entertainment",
    "Utilities",
    "Healthcare",
    "Transportation",
    "Personal Care",
    "Education",
    "Misc",
  ];

  // Navigation
  const handleGoToOverview = () => setPageState('overview');
  const handleGoToPlanning = () => setPageState('planning');
  const handleGoToAddCategory = () => setPageState('addCategory');

  // Toggle the expanded category
  const toggleCategory = (idx) => {
    setOpenCategoryIndex(openCategoryIndex === idx ? null : idx);
  };

  // Form submission for a new category
  const handleSubmitNewCategory = (e) => {
    e.preventDefault();
    if (newCategory.trim()) {
      setCategories([...categories, newCategory.trim()]);
    }
    setNewName('');
    setNewCategory('');
    setNewBudget('');
    setPageState('planning');
  };

  return (
    <div className="flex h-screen bg-[#1B203F] text-white">
      <Sidebar />

      {/* Main Content Container */}
      <div className="flex-grow overflow-y-auto p-8">

        {/* =========================
            OVERVIEW STATE
        ========================== */}
        {pageState === 'overview' && (
          <div className="space-y-6 w-full">
            {/* -- Card 1: Left to Spend -- */}
            <div className="bg-[#2C325C] p-6 rounded-2xl shadow-md w-full">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block w-2 h-2 rounded-full bg-purple-500" />
                <h2 className="text-sm md:text-base">
                  Left to spend in the next 22 days
                </h2>
              </div>
              <p className="text-3xl font-bold mb-2">$3,252.33</p>
              {/* Progress bar */}
              <div className="relative w-full bg-gray-600 h-2 rounded-full">
                <div
                  className="absolute top-0 left-0 h-2 bg-purple-500 rounded-full"
                  style={{ width: '80%' }}
                />
              </div>
              <div className="flex justify-between text-xs mt-2">
                <span>$0</span>
                <span>$4,000</span>
              </div>
            </div>

            {/* -- Card 2: Total Planned Expenses -- */}
            <div className="bg-[#2C325C] p-6 rounded-2xl shadow-md w-full relative">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm md:text-base">Total Planned Expenses</h2>
                {/* Gear icon → goes to planning */}
                <button
                  onClick={handleGoToPlanning}
                  className="text-gray-300 hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.325 4.317c.426-1.756 3.01-1.756 3.436 0
                       a1.724 1.724 0 002.591.99c1.398-.92 3.066.746 2.146 2.146
                       a1.724 1.724 0 00.99 2.59c1.756.427 1.756 3.01 0 3.436
                       a1.724 1.724 0 00-.99 2.591c.92 1.398-.746 3.066-2.146 2.146
                       a1.724 1.724 0 00-2.59.99c-.427 1.756-3.011 1.756-3.438 0
                       a1.724 1.724 0 00-2.59-.99c-1.398.92-3.066-.746-2.146-2.146
                       a1.724 1.724 0 00-.99-2.59c-1.756-.427-1.756-3.011 0-3.438
                       a1.724 1.724 0 00.99-2.59c-.92-1.398.746-3.066 2.146-2.146
                       .984.647 2.312.188 2.59-.99z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-3xl font-bold mb-4">$3,634.27</p>

              {/* Dynamically render each expense item */}
              {expenseData.map(({ category, used, budget, dates }, idx) => {
                const leftover = budget - used;
                const usagePercent = Math.min((used / budget) * 100, 100).toFixed(0);
                const isUnderBudget = leftover >= 0;

                return (
                  <div key={idx} className="mb-4">
                    <h3 className="text-sm font-semibold">{category}</h3>
                    <p className="text-xs text-gray-300">{dates}</p>

                    {/* Progress bar */}
                    <div className="relative w-full bg-gray-600 h-2 rounded-full mt-1">
                      <div
                        className="absolute top-0 left-0 h-2 bg-purple-500 rounded-full"
                        style={{ width: `${usagePercent}%` }}
                      />
                    </div>

                    <p className="text-xs mt-1">
                      {leftover >= 0 
                        ? `$${leftover} left of $${budget}` 
                        : `Over by $${Math.abs(leftover)} of $${budget}`
                      }
                      {' — '}
                      {isUnderBudget ? (
                        <span className="text-green-400 inline-flex items-center gap-1">
                          You’re doing great!
                          <span
                            className="inline-block w-4 h-4 bg-current"
                            style={{
                              maskImage: `url(${"images/thumbsup.png"})`,
                              WebkitMaskImage: `url(${"images/thumbsup.png"})`,
                              maskRepeat: 'no-repeat',
                              WebkitMaskRepeat: 'no-repeat',
                              maskSize: 'contain',
                              WebkitMaskSize: 'contain'
                            }}
                          />
                        </span>
                      ) : (
                        <span className="text-red-400 inline-flex items-center gap-1">
                          Needs work
                          <span
                            className="inline-block w-4 h-4 bg-current"
                            style={{
                              maskImage: `url(${"images/thumbsdown.png"})`,
                              WebkitMaskImage: `url(${"images/thumbsdown.png"})`,
                              maskRepeat: 'no-repeat',
                              WebkitMaskRepeat: 'no-repeat',
                              maskSize: 'contain',
                              WebkitMaskSize: 'contain'
                            }}
                          />
                        </span>
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================
            PLANNING (MANAGE) STATE
        ========================== */}
        {pageState === 'planning' && (
          <div className="bg-[#2C325C] p-6 rounded-2xl shadow-md w-full space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Planning</h2>
              <button
                onClick={handleGoToOverview}
                className="text-sm bg-purple-600 px-3 py-1 rounded-md"
              >
                ← Back to Overview
              </button>
            </div>

            <div className="flex items-center justify-center">
              <img
                src={"images/budget.png"}
                alt="Planning"
                className="w-95 h-95 object-contain"
              />
            </div>

            {/* Accordion-like list of categories */}
            <div className="space-y-2">
              {categories.map((cat, idx) => {
                // Check if this category is currently expanded
                const isOpen = openCategoryIndex === idx;

                return (
                  <div key={idx} className="bg-[#1B203F] rounded-md overflow-hidden">
                    {/* Clickable row to expand/collapse */}
                    <button
                      className="flex justify-between items-center w-full px-4 py-3"
                      onClick={() => toggleCategory(idx)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-purple-500 rounded-full" />
                        <span>{cat}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        {isOpen ? "Details" : "Not setup"}
                        {/* Arrow icon rotates if open */}
                        <svg
                          className={`h-4 w-4 transform transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {/* Expanded details (if open) */}
                    {isOpen && (
                      <div className="px-4 pb-3 text-sm text-gray-300">
                        {/* Example placeholders - update with real data if desired */}
                        <p>Budget: $500</p>
                        <p>Spent: $200</p>
                        <p>Leftover: $300</p>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Add a new category */}
              <button
                onClick={handleGoToAddCategory}
                className="w-full flex items-center justify-center gap-2 bg-[#1B203F] hover:bg-[#3b4470] px-4 py-2 rounded-md mt-2"
              >
                <span className="text-xl leading-none">+</span>
                <span>Add a New Category</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================
            ADD CATEGORY STATE
        ========================== */}
        {pageState === 'addCategory' && (
          <div className="bg-[#2C325C] p-6 rounded-2xl shadow-md w-full">
            <h2 className="text-2xl font-bold mb-4">Set Up A New Plan</h2>
            <div className="flex items-center justify-center mb-6">
              <img
                src={"images/calculator-icon.png"}
                alt="Calculator"
                className="w-90 h-90 object-contain"
              />
            </div>

            <form onSubmit={handleSubmitNewCategory} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Type Your Name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-[#1B203F] border border-gray-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-[#1B203F] border border-gray-600 focus:outline-none"
                >
                  <option value="">Select a category</option>
                  {categoryOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Budget</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Enter Monthly Spending Budget"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-full px-4 py-2 rounded-md bg-[#1B203F] border border-gray-600 focus:outline-none"
                  />
                  <span className="absolute top-2 right-3 text-gray-400">💲</span>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleGoToPlanning}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default BudgetingPage;
