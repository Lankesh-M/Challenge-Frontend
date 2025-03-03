// App.jsx - Main component with routing
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Challenge from './pages/Challenge';
import Profile from './pages/Profile';
import Header from './components/Header';
import './Main.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="app">
        {isLoggedIn && <Header user={user} onLogout={handleLogout} />}
        <div className="content">
          <Routes>
            <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
            <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <Signup onLogin={handleLogin} />} />
            <Route path="/" element={isLoggedIn ? <Home user={user} /> : <Navigate to="/login" />} />
            <Route path="/challenge" element={isLoggedIn ? <Challenge user={user} /> : <Navigate to="/login" />} />
            <Route path="/profile" element={isLoggedIn ? <Profile user={user} /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
