import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import TransactionsPage from "./components/TransactionsPage";
import BillsPage from "./components/BillsPage";
import Sidebar from "./components/sideBar";
import BudgetingOverview from "./components/BudgetingOverview";
import BudgetingPlanning from "./components/BudgetingPlanning";
import WalletPage from "./components/WalletPage";
import VerifyEmailPage from "./components/VerifyEmailPage";
import { CardProvider } from "./components/TempDataFiles/CardInfo";

function App() {
    return (
        <CardProvider>
        <Router>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/verifyEmail" element={<VerifyEmailPage />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/authform" element={<AuthPage />} />
                        <Route path="/transactions" element={<TransactionsPage />} />
                        <Route path="/bills" element={<BillsPage />} />
                        <Route path="/budgeting" element={<BudgetingOverview />} />
                        <Route path="/budgeting/planning" element={<BudgetingPlanning />} />
                        <Route path="/wallet" element={<WalletPage />} />

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
        </CardProvider>
    );
}

export default App;
