import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { Package, User as UserIcon, Heart, LogOut } from 'lucide-react';
import './Account.css';

export default function Account() {
  const { user, login, register, logout, isLoading } = useUser();
  const [isLoginMode, setIsLoginMode] = useState(true);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  
  const [errorStatus, setErrorStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorStatus('');
    let result;
    
    if (isLoginMode) {
      result = await login(formData.email, formData.password);
    } else {
      result = await register(formData.firstName, formData.lastName, formData.email, formData.password);
    }

    if (!result.success) {
      setErrorStatus(result.error || "Authentication failed. Make sure your Medusa backend is running.");
    }
    setIsSubmitting(false);
  };

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  if (isLoading) return <div className="container" style={{textAlign: 'center', padding: '5rem'}}>Loading...</div>;

  if (user) {
    return (
      <div className="account-page animate-fade-in">
        <h1>Welcome, {user.first_name || 'Customer'}!</h1>
        <p style={{color: '#6b7280'}}>Manage your shopping profile securely.</p>
        
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <UserIcon size={32} color="#3b82f6" />
            <h3>Your Profile</h3>
            <p>{user.email}</p>
          </div>
          <div className="dashboard-card">
            <Package size={32} color="#10b981" />
            <h3>Your Orders</h3>
            <p>0 Recent Orders</p>
          </div>
          <div className="dashboard-card" style={{ cursor: 'pointer' }} onClick={logout}>
            <LogOut size={32} color="#ef4444" />
            <h3 style={{color: '#ef4444'}}>Logout</h3>
            <p>End current securely session</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page animate-fade-in">
      <h1>{isLoginMode ? 'Sign In' : 'Create Account'}</h1>
      
      {errorStatus && (
        <div style={{background: '#fef2f2', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.9rem'}}>
          {errorStatus}
        </div>
      )}

      <form className="account-form" onSubmit={handleSubmit}>
        {!isLoginMode && (
          <div style={{display: 'flex', gap: '1rem'}}>
            <div className="form-group" style={{flex: 1}}>
              <label>First Name</label>
              <input type="text" name="firstName" required onChange={handleChange}/>
            </div>
            <div className="form-group" style={{flex: 1}}>
              <label>Last Name</label>
              <input type="text" name="lastName" required onChange={handleChange}/>
            </div>
          </div>
        )}
        
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" name="email" required onChange={handleChange}/>
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" required onChange={handleChange}/>
        </div>

        <button type="submit" className="btn btn-primary" style={{marginTop: '1rem'}} disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : (isLoginMode ? 'Login Securely' : 'Register Account')}
        </button>
      </form>

      <p className="toggle-form">
        {isLoginMode ? "Don't have an account? " : "Already have an account? "}
        <button onClick={() => setIsLoginMode(!isLoginMode)}>
          {isLoginMode ? 'Sign up' : 'Login'}
        </button>
      </p>
    </div>
  );
}
