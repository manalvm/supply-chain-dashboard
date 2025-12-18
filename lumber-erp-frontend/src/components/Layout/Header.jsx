import React from 'react';
import { User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo-container">
          <img src="/logo.png" alt="Lumber ERP" className="logo" />
          <div className="logo-text">
            <h1>Lumber ERP</h1>
            <span>User Management</span>
          </div>
        </div>
      </div>
      
      <div className="header-right">
        <div className="user-menu">
          <button className="btn btn-icon user-btn">
            <div className="user-avatar-small">
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </div>
          </button>
          <div className="user-dropdown">
            <div className="user-info">
              <p className="user-name">{user?.first_name} {user?.last_name}</p>
              <p className="user-role">{user?.email}</p>
            </div>
            <hr />
            <button className="dropdown-item" onClick={() => navigate('/profile')}>
              <User size={16} />
              Profile
            </button>
            <button className="dropdown-item logout" onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;