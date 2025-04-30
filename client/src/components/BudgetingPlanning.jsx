'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from './sideBar';

//UX --> user experience
const BudgetingPlanning = () => {

  const [budgets, setBudgets] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [viewMode, setViewMode] = useState("planning");
  const [loading, setLoading] = useState(false);
  const [editValues, setEditValues] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

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

  const fetchAllBudgets = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('token'); // so here we need their token

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/get_all_budgets`, { 
        headers: {
          Authorization: `Bearer ${token}`, // here I'm checking to see the user's JWT token.
        }
      });

      console.log("Fetched: ", response.data);
      setBudgets(response.data)// then send the budgetplan data to our user
    }
    /// from here it's just error hadnling 
    catch(error){
      console.error("could not get all budgets: ", error);
    }
    /// then we can cut the loading 
    finally{
      setLoading(false);
    }

  };

  useEffect(() => {
    fetchAllBudgets();
  }, [])

  // GET BY NAME <-- we can just port them over from the over view page
  const fetchBudgetFromName = async (name) => {
    try {
      setLoading(true);// we have to actually load in our budgets

      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/get_budget/${name}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // I'll add a log if I'm not able to seethe data properly.
      setBudgets(response.data);

      }
    // if anything goes wrong we'll throw an error
    catch(error){
      console.error("could not fetch by name: ", error);
    }
    // then we can cut the loading 
    finally {
      setLoading(false);
    }

  };

  //// CREATE --> POST
  const handleSubmitNewCategory = async (e) => {
    e.preventDefault();

    /// this is error handling requiring our user to fill out all fields
    if (!newName || !newCategory || !newBudget) {
      alert("Please add name, category and budget.");
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

      // error handling (the catch)
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

  // I'll make a search function for the page + we can port it later to overview
  const searchBudgets = () => {
    // if our name can't be found in our array of budgets
    // just throw an empty array
    if (!Array.isArray(budgets)){ 
      return [];
    }

    else{
      // we're flattening the search words to be lower case so any
      // word we're searching for returns the appropriate result
      return budgets.filter((bgt) =>
        bgt.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  };

/// UI --> user interface
  return (
    <div className="flex min-h-screen bg-[#1B203F] text-white">
      <Sidebar />
      <div className="flex-grow p-8 overflow-y-auto">
        <div className="bg-[#2C325C] p-6 rounded-2xl shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h2 className="text-2xl font-bold">Planning</h2>
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
              <div className="flex gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name..."
                  className="px-3 py-2 rounded-md bg-[#1B203F] border border-gray-600 w-full sm:w-60"
                />
                <button
                  onClick={() => {
                    if (searchTerm.trim()) {
                      fetchBudgetFromName(searchTerm);
                    } else {
                      alert("Enter a name to search.");
                    }
                  }}
                  className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-md text-sm"
                >
                  Search
                </button>

              </div>
              <Link to="/budgeting" className="text-sm bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-md text-center">
                ← Back to Overview
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-300">Loading budgets...</div>
          ) : viewMode === "planning" ? (
            <>
              {searchBudgets().map((bgt, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div key={`${bgt.name}-${idx}`} className="bg-[#1B203F] rounded-md mb-2">
                    <button
                      className="flex justify-between items-center w-full px-4 py-3"
                      onClick={() => toggleAccordion(idx)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-purple-500 rounded-full" />
                        <span>{bgt.name}</span>
                      </div>
                      <span className="text-gray-400 text-sm">${bgt.budget}</span>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-sm text-gray-300 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <input
                          type="text"
                          placeholder="New name"
                          value={editValues[bgt.name]?.name ?? bgt.name}
                          onChange={(e) =>
                            setEditValues((prev) => ({
                              ...prev,
                              [bgt.name]: {
                                ...prev[bgt.name],
                                name: e.target.value,
                              },
                            }))
                          }
                          className="px-2 py-1 rounded-md bg-[#2C325C] border border-gray-600 w-full sm:w-1/3"
                        />
                        <input
                          type="number"
                          placeholder="New amount"
                          value={editValues[bgt.name]?.budget ?? bgt.budget}
                          onChange={(e) =>
                            setEditValues((prev) => ({
                              ...prev,
                              [bgt.name]: {
                                ...prev[bgt.name],
                                budget: Number(e.target.value),
                              },
                            }))
                          }
                          className="px-2 py-1 rounded-md bg-[#2C325C] border border-gray-600 w-full sm:w-1/3"
                        />
                        <button
                          onClick={() =>
                            handleUpdate(
                              bgt.name,
                              editValues[bgt.name]?.budget ?? bgt.budget,
                              editValues[bgt.name]?.name ?? bgt.name
                            )
                          }
                          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-sm"
                        >
                          Save Changes
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

              <button
                onClick={() => setViewMode("addPlan")}
                className="w-full flex items-center justify-center gap-2 bg-[#1B203F] hover:bg-[#3b4470] px-4 py-2 rounded-md mt-4"
              >
                <span className="text-xl">＋</span>
                <span>Add New Plan</span>
              </button>
            </>
          ) : (
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
                  className="hide-spinner px-2 py-1 rounded-md bg-[#2C325C] border border-gray-600 w-full sm:w-1/3"
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