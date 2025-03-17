import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import TransactionsPage from "./components/TransactionsPage";
import BillsPage from "./components/BillsPage";
import Sidebar from "./components/sideBar";
import BudgetingPage from "./components/BudgetingPage";

function App() {
    return (
        <Router>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/authform" element={<AuthPage />} />
                        <Route path="/transactions" element={<TransactionsPage />} />
                        <Route path="/bills" element={<BillsPage />} />
                        <Route path="/budgeting" element={<BudgetingPage />} />

                        {/* ProtectedRoute example (to be implemented later)
                        <Route 
                            path="/transactions"
                            element={
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
