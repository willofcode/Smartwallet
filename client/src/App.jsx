'use client';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./components/AuthPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/signup" element={<AuthPage />} />
                <Route path="/" element={<h1 class="underline"> Welcome to SmartWallet </h1>} />
            </Routes>
        </Router>
    );
}

export default App;
