import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Transactions from "./components/Transactions";
import Wallet from "./components/Wallet";
import Advisor from "./components/Advisor";
import Budgeting from "./components/Budgeting";
import Bills from "./components/Bills";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/advisor" element={<Advisor />} />
        <Route path="/budgeting" element={<Budgeting />} />
        <Route path="/bills" element={<Bills />} />
      </Routes>
    </Router>
  );
}

export default App;
