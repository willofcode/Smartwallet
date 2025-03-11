'use client';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import TransactionsPage from "./components/TransactionsPage";
import BillsPage from "./components/BillsPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/authform" element={<AuthPage />} />
                <Route path="/transactions" element={<TransactionsPage />} />
                <Route path="/bills" element={<BillsPage />} />
                
                {/* Protected Route (gotta make a component like this SUPER HELPFUL)
                <Route 
                  path= "/transactions"
                  element= {
                    <ProtectedRoute>
                      <TransactionsPage />
                    </ProtectedRoute>
                  }
                />
                */}
            </Routes>
        </Router>
    );
}

export default App;
