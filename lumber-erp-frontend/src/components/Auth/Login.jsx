import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usersAPI } from '../../services/api';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      // Get all users and find matching credentials
      const response = await usersAPI.getAll();
      const users = response.data || response;
      
      console.log('All users:', users);
      
      const user = users.find(
        u => u.email.toLowerCase() === formData.email.toLowerCase()
      );

      console.log('Found user:', user);

      if (!user) {
        setApiError('Invalid email or password');
        setLoading(false);
        return;
      }

      if (user.status !== 'active') {
        setApiError('Your account is inactive. Please contact support.');
        setLoading(false);
        return;
      }

      // In production, password verification would be done on backend
      // For now, we just check if user exists and is active
      login(user);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      setApiError('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-shape shape-1"></div>
        <div className="auth-shape shape-2"></div>
        <div className="auth-shape shape-3"></div>
      </div>

      <div className="auth-content">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <img src="/logo.png" alt="Lumber ERP" />
            </div>
            <h1>Welcome Back</h1>
            <p>Sign in to your Lumber ERP account</p>
          </div>

          {apiError && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@company.com"
                  className={errors.email ? 'error' : ''}
                  autoFocus
                />
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={errors.password ? 'error' : ''}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              <LogIn size={18} />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register">Create Account</Link></p>
          </div>

          <div className="demo-info">
            <p className="demo-title">🎯 For Testing:</p>
            <p className="demo-text">Register a new account or use any registered email</p>
          </div>
        </div>

        <div className="auth-info">
          <h2>🌲 Lumber ERP</h2>
          <p>Complete Enterprise Resource Planning solution for the lumber industry</p>
          <ul className="feature-list">
            <li>✓ User & Role Management</li>
            <li>✓ Inventory & Warehouse Control</li>
            <li>✓ Forest & Harvesting Tracking</li>
            <li>✓ Sales & Financial Management</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;