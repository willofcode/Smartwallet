'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from "./sideBar";

const BudgetingPlanning = () => {
  // We assume each of these “names” is a separate Budget doc in your DB
  const categories = ["Housing", "Food", "Transportation"];

  // We'll store each fetched doc in an array
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);

  // For toggling accordion
  const [openIndex, setOpenIndex] = useState(null);

  // Form for creating a new budget doc
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newBudget, setNewBudget] = useState('');

  // Additional category suggestions
  const categoryOptions = [
    "Housing",
    "Food",
    "Transportation",
    "Utilities",
    "Entertainment",
    "Healthcare",
    "Personal Care",
    "Education",
    "Misc",
  ];

  useEffect(() => {
    fetchBudgets();
  }, []);

  // For each name in `categories`, call GET /get_budget/:name
  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const requests = categories.map(cat =>
        axios.get(`/api/budget/get_budget/${cat}`)
        .catch(err => {
          console.error(`No budget found for name "${cat}"`, err);
          return null;
        })
      );
      const results = await Promise.all(requests);

      const final = results.map(res => (res && res.data ? res.data : null));
      setBudgets(final);
    } catch (error) {
      console.error("Error fetching budgets by name:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  // Create a new budget doc (POST /post_budget)
  const handleSubmitNewCategory = async (e) => {
    e.preventDefault();
    if (!newName || !newCategory || !newBudget) {
      alert("Please fill in name, category, and budget.");
      return;
    }

    try {
      await axios.post('/api/budget/post_budget', {
        name: newName.trim(),
        category: newCategory.trim(),
        budget: Number(newBudget),
      });
      // Re-fetch budgets in case newName is one of our known categories
      await fetchBudgets();

      // Reset form, switch back to "planning" view
      setNewName('');
      setNewCategory('');
      setNewBudget('');
      setViewMode("planning");
    } catch (err) {
      console.error('Error creating new budget:', err);
      alert('Failed to create budget. Check console for details.');
    }
  };

  // Switch between "planning" view (accordion) and "addPlan" view
  const [viewMode, setViewMode] = useState("planning");

  return (
    <div className="flex h-screen bg-[#1B203F] text-white">
      <Sidebar />

      <div className="flex-grow overflow-y-auto p-8">
        <div className="bg-[#2C325C] p-6 rounded-2xl shadow-md w-full space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Planning</h2>
            {/* Link back to overview */}
            <Link to="/budgeting" className="text-sm bg-purple-600 px-3 py-1 rounded-md">
              ← Back to Overview
            </Link>
          </div>

          {viewMode === "planning" && (
            <>
              {/* Some illustration */}
              <div className="flex items-center justify-center">
                <img
                  src="/images/budget.png"
                  alt="Planning Illustration"
                  className="w-95 h-95 object-contain"
                />
              </div>

              {loading && <p className="text-gray-300">Loading budgets...</p>}

              <div className="space-y-2">
                {budgets.map((bgt, idx) => {
                  const isOpen = openIndex === idx;

                  if (!bgt) {
                    // Means we didn't find a doc for categories[idx]
                    return (
                      <div
                        key={`missing-${idx}`}
                        className="bg-[#1B203F] p-4 rounded-md text-red-400"
                      >
                        No budget found for "{categories[idx]}".
                      </div>
                    );
                  }

                  return (
                    <div key={bgt._id || idx} className="bg-[#1B203F] rounded-md overflow-hidden">
                      <button
                        className="flex justify-between items-center w-full px-4 py-3"
                        onClick={() => toggleAccordion(idx)}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-purple-500 rounded-full" />
                          <span>{bgt.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          {isOpen ? "Details" : "Not expanded"}
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
                          <p>Category: {bgt.category}</p>
                          <p>Budget: ${bgt.budget}</p>
                          <p>
                            Created On:{" "}
                            {bgt.createdAt
                              ? new Date(bgt.createdAt).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

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

              <h2 className="text-2xl font-bold">Set Up A New Plan</h2>

              <form onSubmit={handleSubmitNewCategory} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Name</label>
                  <input
                    type="text"
                    placeholder="Unique Budget Name (e.g. Housing)"
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
