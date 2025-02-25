'use client';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import TransactionsPage from "./components/TransactionsPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/signup" element={<AuthPage />} />
                <Route path="transactions" element={<TransactionsPage />}/>
                
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
