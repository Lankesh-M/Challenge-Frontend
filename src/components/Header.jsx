
// components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Header({ user, onLogout }) {
  return (
    <header className="header">
      <div className="logo">Challenge App</div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/challenge">Challenges</Link></li>
          <li><Link to="/profile">Profile</Link></li>
        </ul>
      </nav>
      <div className="user-controls">
        <span className="username">Hi, {user.name}</span>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
}

export default Header;