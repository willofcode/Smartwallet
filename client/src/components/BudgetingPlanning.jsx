'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from './sideBar';

// UX --> user experience
const BudgetingPlanning = () => {
  const [budgets, setBudgets] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  /* new-plan form */
  const [newName, setNewName]       = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newBudget, setNewBudget]   = useState('');
  const [newMonth, setNewMonth]     = useState('');

  const [viewMode,  setViewMode]  = useState('planning');
  const [loading,   setLoading]   = useState(false);

  /* editing existing budgets */
  const [editValues, setEditValues] = useState({});  // { [oldName]: { name, budget, month } }

  const [searchTerm, setSearchTerm] = useState('');

  /* ---------- hard-coded selects ---------- */
  const categoryOptions = [
    'Housing','Food','Transportation','Utilities','Entertainment',
    'Healthcare','Personal Care','Education','Misc',
  ];
  const monthOptions = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December',
  ];

  /* ---------- helpers ---------- */
  const toggleAccordion = (idx) =>
    setOpenIndex(openIndex === idx ? null : idx);

  const fetchAllBudgets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/get_all_budgets`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBudgets(data);
    } catch (err) {
      console.error('could not get all budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllBudgets(); }, []);

  /* ---------- POST NEW ---------- */
  const handleSubmitNewCategory = async (e) => {
    e.preventDefault();
    if (!newName || !newCategory || !newBudget || !newMonth) {
      alert('Please fill name, category, month, and budget.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/post_budget`,
        {
          name: newName.trim(),
          category: newCategory,
          month: newMonth,
          budget: Number(newBudget),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBudgets((prev) => [...prev, data]);
      setNewName(''); setNewCategory(''); setNewBudget(''); setNewMonth('');
      setViewMode('planning');
    } catch (err) {
      console.error('Cannot POST new budget:', err);
      alert('Failed to POST budget. Check console for details.');
    }
  };

  /* ---------- UPDATE ---------- */
  const handleUpdate = async (origName, updatedFields) => {
    // remove undefined fields
    const payload = Object.fromEntries(
      Object.entries(updatedFields).filter(([,v]) => v !== undefined && v !== '')
    );
    if (Object.keys(payload).length === 0) {
      alert('Nothing to update.');
      return;
    }
    try {
      const { data } = await axios.patch(
        `${import.meta.env.VITE_API_URL}/update_budget/${origName}`,
        payload
      );
      setBudgets((prev) =>
        prev.map((b) => (b.name === origName ? data : b))
      );
      // clear editor for that row
      setEditValues((prev) => ({ ...prev, [origName]: {} }));
    } catch (err) {
      console.error('Cannot UPDATE budget:', err);
      alert('UPDATE budget failed, check console');
    }
  };

  /* ---------- DELETE ---------- */
  const handleDelete = async (name) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/delete_budget/${name}`);
      setBudgets((prev) => prev.filter((b) => b.name !== name));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('DELETE budget failed, check console');
    }
  };

  /* ---------- search ---------- */
  const filteredBudgets = budgets.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ---------- UI ---------- */
  return (
    <div className="flex min-h-screen bg-[#1B203F] text-white">
      <Sidebar />
      <div className="flex-grow p-8 overflow-y-auto">
        <div className="bg-[#2C325C] p-6 rounded-2xl shadow-md space-y-6">
          {/* header */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <h2 className="text-2xl font-bold">Planning</h2>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="flex gap-2 w-full sm:w-auto">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name..."
                  className="px-3 py-2 rounded-md bg-[#1B203F] border border-gray-600 w-full sm:w-60"
                />
              </div>
              <Link
                to="/budgeting"
                className="text-sm bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-md text-center"
              >
                ← Back to Overview
              </Link>
            </div>
          </div>

          {loading ? (
            <p className="text-center py-8 text-gray-300">Loading budgets...</p>
          ) : viewMode === 'planning' ? (
            <>
              {filteredBudgets.map((bgt, idx) => {
                const isOpen = openIndex === idx;
                const ev = editValues[bgt.name] || {};
                return (
                  <div key={bgt.name} className="bg-[#1B203F] rounded-md mb-2">
                    <button
                      className="flex justify-between items-center w-full px-4 py-3"
                      onClick={() => toggleAccordion(idx)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-purple-500 rounded-full" />
                        <span>{bgt.name}</span>
                      </div>
                      <span className="text-gray-400 text-sm">
                        ${bgt.budget}{' '}
                        {bgt.month ? `· ${bgt.month}` : ''}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 text-sm text-gray-300 space-y-3">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                          {/* editable name */}
                          <input
                            placeholder="Name"
                            value={ev.name ?? bgt.name}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [bgt.name]: {
                                  ...prev[bgt.name],
                                  name: e.target.value,
                                },
                              }))
                            }
                            className="px-2 py-1 rounded-md bg-[#2C325C] border border-gray-600 w-full lg:w-1/3"
                          />
                          {/* editable month */}
                          <select
                            value={ev.month ?? bgt.month ?? ''}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [bgt.name]: {
                                  ...prev[bgt.name],
                                  month: e.target.value,
                                },
                              }))
                            }
                            className="px-2 py-1 rounded-md bg-[#2C325C] border border-gray-600 w-full lg:w-1/4"
                          >
                            <option value="">Month</option>
                            {monthOptions.map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                          {/* editable amount */}
                          <input
                            type="number"
                            placeholder="Amount"
                            value={ev.budget ?? bgt.budget}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [bgt.name]: {
                                  ...prev[bgt.name],
                                  budget: Number(e.target.value),
                                },
                              }))
                            }
                            className="px-2 py-1 rounded-md bg-[#2C325C] border border-gray-600 w-full lg:w-1/4"
                          />

                          <button
                            onClick={() =>
                              handleUpdate(bgt.name, ev)
                            }
                            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-sm"
                          >
                            Save
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
                onClick={() => setViewMode('addPlan')}
                className="w-full flex items-center justify-center gap-2 bg-[#1B203F] hover:bg-[#3b4470] px-4 py-2 rounded-md mt-4"
              >
                <span className="text-xl">＋</span>
                <span>Add New Plan</span>
              </button>
            </>
          ) : (
            /* ---------------- ADD PLAN FORM ---------------- */
            <form onSubmit={handleSubmitNewCategory} className="space-y-6">
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

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-4 py-2 rounded-md bg-[#1B203F] border border-gray-600"
                  >
                    <option value="">Select category</option>
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-1">Month</label>
                  <select
                    value={newMonth}
                    onChange={(e) => setNewMonth(e.target.value)}
                    className="w-full px-4 py-2 rounded-md bg-[#1B203F] border border-gray-600"
                  >
                    <option value="">Select month</option>
                    {monthOptions.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">Budget</label>
                <input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="hide-spinner px-4 py-2 rounded-md bg-[#1B203F] border border-gray-600 w-full"
                  placeholder="e.g. 400"
                />
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
                  onClick={() => setViewMode('planning')}
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
