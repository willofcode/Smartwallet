'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from './sideBar';

//UX --> user experience
const BudgetingPlanning = () => {

  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [viewMode, setViewMode] = useState("planning");

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

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  // a user needs to fill out all fields for a new category 
  // a part of me is worried this is doing to much
  // but I'll worry about it later.
  //// CREATE --> POST
  const handleSubmitNewCategory = async (e) => {
    e.preventDefault();

    /// this is error handling requiring our user to fill out all fields
    if (!newName || !newCategory || !newBudget) {
      alert("Please fill in name, category, and budget.");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // we're grabbing the JWT token of a user
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/post_budget`, // calling the post budget endpoint I made
        {
          /// posting the body data the endpoints accepts to the website
          name: newName.trim(), 
          category: newCategory.trim(),
          budget: Number(newBudget)
        },
        {
          // this is auth, verifying the budegt at a certain users JWT
          // we do this so that a user's budget plan belongs to that user...
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setBudgets(prev => [...prev, res.data]); /// adding a local state for setting the budget

      // this is setting the new body and it's also gonna show our newly made 
      // budget plan, on our planning page via view model, I may remove that
      // it's not the point of the planning page
      setNewName('');
      setNewCategory('');
      setNewBudget('');
      setViewMode("planning");

      // error handling the catch
    } catch(error){
      console.error('Cannot POST new budget:', error);
      alert('Failed to POST budget. Check console for details.');
    }
  };

  /// DELETE 
  const handleDelete = async (name) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/delete_budget/${name}`); // calling delete endpoint I amde
      setBudgets((prev) => prev.filter(b => b.name !== name)); /// deleting by our budget name
      ///await fetchBudgets(); ///  then refetch our budgets.. I may remove this, I'm not sure yet
      /// error handling 
    } catch(error){
      console.error("Delete failed:", error);
      alert('DELETE budget failed, check console');
    }
  };

 /// UPDATE
  const handleUpdate = async(name, new_amount) => {
      //// we can redo this with just awaiting the actual endpoint
      //// I'll worry about that later...
      //// change the budget but NOT by 50 by however much a user wants to change it to.
      try {
        const res = await axios.patch(`${import.meta.env.VITE_API_URL}/update_budget/${name}`, {
          budget: new_amount
        });

        setBudgets(prev => 
          prev.map(b => b.name === name ? res.data : b)
        );
      } catch(error){
        console.error("Cannot UPDATE budget:", error );
        alert('UPDATE budget failed, check console');
      }
  };

  /// we could do like, client side filtering group the budgets by 
  /// the category they are in. (this should be in the overvie side???)
  /// ok this is close to what we want but I was right i don't need this on the planning page
  const groupedBudgets = budgets.reduce((acc, b) => {
    if(!acc[b.category]) acc[b.category] = [];
    acc[b.category].push(b);
    return acc;

  }, {});

/// UI --> user interface
/// I'm too tired ngl
  return (
    <div className="flex min-h-screen bg-[#1B203F] text-white">
      <Sidebar />
      <div className="flex-grow p-8 overflow-y-auto">
        <div className="bg-[#2C325C] p-6 rounded-2xl shadow-md space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Planning</h2>
            <Link to="/budgeting" className="text-sm bg-purple-600 px-3 py-1 rounded-md">
              ← Back to Overview
            </Link>
          </div>

          {viewMode === "planning" && (
            <>
              {Object.entries(groupedBudgets).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-xl font-semibold mt-6 mb-2">{category}</h3>
                  {items.map((bgt, idx) => {
                    const isOpen = openIndex === `${category}-${idx}`;
                    return (
                      <div key={`${bgt.name}-${idx}`} className="bg-[#1B203F] rounded-md mb-2">
                        <button
                          className="flex justify-between items-center w-full px-4 py-3"
                          onClick={() => toggleAccordion(`${category}-${idx}`)}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-purple-500 rounded-full" />
                            <span>{bgt.name}</span>
                          </div>
                          <span className="text-gray-400 text-sm">${bgt.budget}</span>
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 text-sm text-gray-300">
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => handleUpdate(bgt.name, bgt.budget + 50)}
                                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-sm"
                              >
                                + $50
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
              ))}

              <button
                onClick={() => setViewMode("addPlan")}
                className="w-full flex items-center justify-center gap-2 bg-[#1B203F] hover:bg-[#3b4470] px-4 py-2 rounded-md mt-4"
              >
                <span className="text-xl">＋</span>
                <span>Add New Plan</span>
              </button>
            </>
          )}

          {viewMode === "addPlan" && (
            <form onSubmit={handleSubmitNewCategory} className="space-y-4">
              <h2 className="text-2xl font-bold">New Budget Plan</h2>
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-[#1B203F] border border-gray-600"
                  placeholder="e.g. Car Payment"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-[#1B203F] border border-gray-600"
                >
                  <option value="">Select a category</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Budget</label>
                <input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-[#1B203F] border border-gray-600"
                  placeholder="e.g. 400"
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetingPlanning;