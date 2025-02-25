'use client';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./components/AuthPage";
import TransactionsPage from "./components/TransactionsPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/signup" element={<AuthPage />} />
                <Route path="transactions" element={<TransactionsPage />}/>
                <Route path="/" element={<h1 class="underline"> Welcome to SmartWallet </h1>} />
                
                
                {/* Protected Route
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
