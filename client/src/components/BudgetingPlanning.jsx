'use client';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from "./sideBar";

const BudgetingPlanning = () => {
  // Toggle between "planning" view and "addPlan" view
  const [viewMode, setViewMode] = useState("planning");

  // Default categories
  const [categories, setCategories] = useState([
    "Food", 
    "Housing", 
    "Transportation",
    "Entertainment",
    "Education"
  ]);
  
  // Accordion state for toggling each category's details
  const [openCategoryIndex, setOpenCategoryIndex] = useState(null);
  
  // For adding a new category (plan)
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newBudget, setNewBudget] = useState('');
  
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
  
  // Toggle the expanded category in the accordion
  const toggleCategory = (idx) => {
    setOpenCategoryIndex(openCategoryIndex === idx ? null : idx);
  };

  // Handle new category form submission
  const handleSubmitNewCategory = (e) => {
    e.preventDefault();
    if (newCategory.trim()) {
      setCategories([...categories, newCategory.trim()]);
    }
    setNewName('');
    setNewCategory('');
    setNewBudget('');
    setViewMode("planning");
  };

  return (
    <div className="flex h-screen bg-[#1B203F] text-white">
      <Sidebar />
      
      <div className="flex-grow overflow-y-auto p-8">
        <div className="bg-[#2C325C] p-6 rounded-2xl shadow-md w-full space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Planning</h2>
            {/* Link back to the overview page */}
            <Link to="/budgeting" className="text-sm bg-purple-600 px-3 py-1 rounded-md">
              ← Back to Overview
            </Link>
          </div>

          {viewMode === "planning" && (
            <>
              {/* Illustration */}
              <div className="flex items-center justify-center">
                <img
                  src="/images/budget.png"
                  alt="Planning Illustration"
                  className="w-95 h-95 object-contain"
                />
              </div>

              {/* Accordion-like list of categories */}
              <div className="space-y-2">
                {categories.map((cat, idx) => {
                  const isOpen = openCategoryIndex === idx;
                  return (
                    <div key={idx} className="bg-[#1B203F] rounded-md overflow-hidden">
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
                          <svg
                            className={`h-4 w-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
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
                      {isOpen && (
                        <div className="px-4 pb-3 text-sm text-gray-300">
                          {/* Example placeholders */}
                          <p>Budget: $500</p>
                          <p>Spent: $200</p>
                          <p>Leftover: $300</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Button to switch to add plan view */}
              <button
                onClick={() => setViewMode("addPlan")}
                className="w-full flex items-center justify-center gap-2 bg-[#1B203F] hover:bg-[#3b4470] px-4 py-2 rounded-md mt-2"
              >
                <span className="text-xl leading-none">+</span>
                <span>Add a New Category</span>
              </button>
            </>
          )}

          {viewMode === "addPlan" && (
            <div className="space-y-6">
              {/* Illustration */}
              <div className="flex items-center justify-center">
                <img
                  src="/images/calculator-icon.png"
                  alt="Calculator"
                  className="w-95 h-95 object-contain"
                />
              </div>

              {/* "Set Up A New Plan" heading */}
              <h2 className="text-2xl font-bold">Set Up A New Plan</h2>

              {/* Form for adding a new category */}
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
                    onClick={() => setViewMode("planning")}
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
    </div>
  );
};

export default BudgetingPlanning;
