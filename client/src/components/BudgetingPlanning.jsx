'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from './sideBar';

//UX --> user experience
const BudgetingPlanning = () => {

  const [categories, setCategories] = useState(
    ["Housing", "Food", "Transportation"]
  );
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [viewMode, setViewMode] = useState("planning");

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

  // I might change this later??
  // my general idea should be that categories are handled
  // tried on backend for some reason they won't register so
  // we can handle our category options here
  // then make it so that we sort by category here via CSS (client side sorting)
  // I need to understand what happened to this page....
  // so i know planning should handle
  // POST
  // DELETE
  // UPDATE

  useEffect(() => {
    fetchBudgets();
  }, [categories]); 

  /* no reason for GET here
  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const requests = categories.map(name =>
        axios.get(`${import.meta.env.VITE_API_URL}/get_budget/${name}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          .catch(err => {
            console.error(`No budget found for "${name}"`, err);
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
  */

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
      const token = localStorage.getItem("token"); // assume JWT is stored in localStorage
      await axios.post(`${import.meta.env.VITE_API_URL}/post_budget`,
        {
          name: newName.trim(),
          category: newCategory.trim(),
          budget: Number(newBudget)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // 1) Add the newName to the categories array
      setCategories((prevCategories) => {
        // Optionally guard against duplicates
        const trimmedName = newName.trim();
        if (prevCategories.includes(trimmedName)) {
          return prevCategories; 
        }
        return [...prevCategories, trimmedName];
      });

      // 2) Reset form, switch back to "planning" view
      setNewName('');
      setNewCategory('');
      setNewBudget('');
      setViewMode("planning");

      // 3) fetchBudgets will auto-run if your categories changed
      //    (due to the [categories] dependency in useEffect)
      //    but you can also call it here directly if you prefer:
      // await fetchBudgets();

    } catch (err) {
      console.error('Error creating new budget:', err);
      alert('Failed to create budget. Check console for details.');
    }
  };

  // Delete a budget doc (DELETE /delete_budget/:name)
  const handleDelete = async (name) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/delete_budget/${name}`);
      // If you want to remove name from categories as well, do so here
      setCategories((prev) => prev.filter(cat => cat !== name));
      // Re-fetch budgets
      await fetchBudgets();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // Update a budget doc (PATCH /update_budget/:name)
  const handleUpdate = async (name, dataToUpdate) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/update_budget/${name}`, dataToUpdate);
      await fetchBudgets();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

// UI --> user interface
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
              {/* Illustration */}
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

                          {/* Example Update/Delete usage */}
                          <div className="mt-3 flex gap-3">
                            <button
                              onClick={() => handleUpdate(bgt.name, { budget: bgt.budget + 50 })}
                              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-sm"
                            >
                              Increase Budget by $50
                            </button>
                            <button
                              onClick={() => handleDelete(bgt.name)}
                              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm"
                            >
                              Delete
                            </button>
                          </div>
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
