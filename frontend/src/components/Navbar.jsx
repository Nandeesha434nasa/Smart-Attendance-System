import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          📚 Smart Attendance System
        </div>
        {isAuthenticated && (
          <div className="nav-links">
            <span className="user-info">
              Welcome, {user?.name} ({user?.role})
            </span>
            <button className="btn btn-secondary" onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;