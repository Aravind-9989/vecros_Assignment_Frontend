import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/registerpage";
import Login from "./pages/loginpage";
import QuizSelection from "./pages/quizselection";
import QuizPage from "./pages/quizpage";
import Leaderboard from "./pages/leaderboard";
import './App.css';

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <div className={darkMode ? "dark-mode" : ""}>
      <Router>
       
        <div className="theme-toggle">
          <button className="btn btn-dark" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/quizzes" element={<QuizSelection />} />
          <Route path="/quiz/:id" element={<QuizPage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
