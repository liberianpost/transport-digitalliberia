// src/App.jsx - COMPLETE UPDATED TRANSPORT COMPONENT

import React, { useState, useEffect } from 'react';
import Login from './components/Login';

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [activeTab, setActiveTab] = useState('signup');
  const [verifiedDSSN, setVerifiedDSSN] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serviceType, setServiceType] = useState('');

  // API functions
  const authAPI = {
    verifyDSSN: async (dssn, serviceType) => {
      try {
        const response = await fetch('/auth/verify-dssn', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ dssn, serviceType }),
        });
        return await response.json();
      } catch (error) {
        console.error('Error verifying DSSN:', error);
        return { success: false, message: 'Network error' };
      }
    },

    createPassword: async (dssn, password, confirmPassword, email, phoneNumber) => {
      try {
        const response = await fetch('/auth/create-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ dssn, password, confirmPassword, email, phoneNumber }),
        });
        return await response.json();
      } catch (error) {
        console.error('Error creating password:', error);
        return { success: false, message: 'Network error' };
      }
    },

    transportLogin: async (dssn, password) => {
      try {
        const response = await fetch('/auth/transport-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ dssn, password }),
        });
        return await response.json();
      } catch (error) {
        console.error('Error during login:', error);
        return { success: false, message: 'Network error' };
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowLogin(false);
    setShowVehicleModal(false);
    setShowLicenseModal(false);
    console.log('Transportation system login successful:', userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('transportUser');
    localStorage.removeItem('transportToken');
  };

  const handleVehicleClick = () => {
    setShowVehicleModal(true);
    setActiveTab('signup');
    setServiceType('vehicle_registration');
    setShowPasswordForm(false);
    setVerifiedDSSN('');
  };

  const handleLicenseClick = () => {
    setShowLicenseModal(true);
    setActiveTab('signup');
    setServiceType('drivers_license');
    setShowPasswordForm(false);
    setVerifiedDSSN('');
  };

  const handleDSSNVerification = async (dssn) => {
    setLoading(true);
    const result = await authAPI.verifyDSSN(dssn, serviceType);
    setLoading(false);
    
    if (result.success) {
      if (result.requiresPasswordSetup) {
        setShowPasswordForm(true);
        setVerifiedDSSN(dssn);
      } else {
        setActiveTab('login');
        setVerifiedDSSN(dssn);
        alert('DSSN verified. Please login with your password.');
      }
    } else {
      alert(result.message);
    }
  };

  const handlePasswordCreation = async (password, confirmPassword, email, phoneNumber) => {
    setLoading(true);
    const result = await authAPI.createPassword(verifiedDSSN, password, confirmPassword, email, phoneNumber);
    setLoading(false);
    
    if (result.success) {
      alert('Account created successfully! Please login.');
      setActiveTab('login');
      setShowPasswordForm(false);
    } else {
      alert(result.message);
    }
  };

  const handleTransportLogin = async (dssn, password) => {
    setLoading(true);
    const result = await authAPI.transportLogin(dssn, password);
    setLoading(false);
    
    if (result.success) {
      localStorage.setItem('transportToken', result.token);
      localStorage.setItem('transportUser', JSON.stringify(result.user));
      handleLoginSuccess(result.user);
    } else {
      alert(result.message);
    }
  };

  const Modal = ({ show, onClose, title, children }) => {
    if (!show) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{title}</h2>
            <button className="modal-close" onClick={onClose}>×</button>
          </div>
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    );
  };

  const AuthModalContent = ({ serviceType }) => (
    <div className="auth-modal-content">
      <div className="auth-tabs">
        <div 
          className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
          onClick={() => {
            if (!showPasswordForm) {
              setActiveTab('signup');
              setShowPasswordForm(false);
            }
          }}
        >
          Sign Up
        </div>
        <div 
          className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('login');
            setShowPasswordForm(false);
          }}
        >
          Login
        </div>
      </div>
      
      <div className="auth-forms">
        {/* DSSN Verification Form */}
        {!showPasswordForm && activeTab === 'signup' && (
          <div className="auth-form active">
            <h3>Start Your {serviceType === 'vehicle_registration' ? 'Vehicle Registration' : 'Drivers License'} Application</h3>
            <p>Enter your DSSN to begin the registration process</p>
            
            <div className="form-group">
              <label htmlFor="dssn-signup">Digital Social Security Number (DSSN)</label>
              <input 
                type="text" 
                id="dssn-signup"
                placeholder="Enter your 15-digit DSSN" 
                maxLength="15"
                pattern="[0-9]{15}"
                title="DSSN must be 15 digits"
              />
              <div className="input-help">
                Your 15-digit Digital Social Security Number
              </div>
            </div>
            
            <button 
              className="btn btn-transport" 
              style={{width: '100%'}}
              onClick={() => {
                const dssnInput = document.getElementById('dssn-signup');
                if (dssnInput.value.length === 15) {
                  handleDSSNVerification(dssnInput.value);
                } else {
                  alert('Please enter a valid 15-digit DSSN');
                }
              }}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify DSSN & Continue'}
            </button>

            <div className="auth-info">
              <p><strong>Why DSSN?</strong></p>
              <p>Your DSSN verifies your identity and checks if you have the necessary role-based access for {serviceType === 'vehicle_registration' ? 'vehicle registration' : 'drivers license'} services.</p>
              <p>After verification, you'll be guided to create your account password.</p>
            </div>
          </div>
        )}

        {/* Password Creation Form */}
        {showPasswordForm && (
          <div className="auth-form active">
            <h3>Create Your Account</h3>
            <p>Complete your registration for {serviceType === 'vehicle_registration' ? 'Vehicle Registration' : 'Drivers License'} services</p>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email"
                placeholder="Enter your email address" 
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input 
                type="tel" 
                id="phone"
                placeholder="Enter your phone number" 
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password"
                placeholder="Create your password (min. 6 characters)" 
                minLength="6"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input 
                type="password" 
                id="confirmPassword"
                placeholder="Confirm your password" 
                minLength="6"
                required
              />
            </div>
            
            <button 
              className="btn btn-transport" 
              style={{width: '100%'}}
              onClick={() => {
                const email = document.getElementById('email').value;
                const phone = document.getElementById('phone').value;
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                
                if (!email || !phone || !password || !confirmPassword) {
                  alert('Please fill all fields');
                  return;
                }
                
                handlePasswordCreation(password, confirmPassword, email, phone);
              }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="auth-links">
              <button 
                className="auth-link" 
                onClick={() => setShowPasswordForm(false)}
                style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}
              >
                ← Back to DSSN Verification
              </button>
            </div>
          </div>
        )}
        
        {/* Login Form - DSSN and Password */}
        {activeTab === 'login' && (
          <div className="auth-form active">
            <h3>Access Your {serviceType === 'vehicle_registration' ? 'Vehicle Registration' : 'Drivers License'} Account</h3>
            <p>Login to manage your {serviceType === 'vehicle_registration' ? 'vehicle registration' : 'drivers license'} services</p>
            
            <div className="form-group">
              <label htmlFor="dssn-login">Digital Social Security Number (DSSN)</label>
              <input 
                type="text" 
                id="dssn-login"
                placeholder="Enter your 15-digit DSSN" 
                maxLength="15"
                pattern="[0-9]{15}"
                title="DSSN must be 15 digits"
                defaultValue={verifiedDSSN}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password-login">Password</label>
              <input 
                type="password" 
                id="password-login"
                placeholder="Enter your password" 
              />
            </div>
            
            <button 
              className="btn btn-transport" 
              style={{width: '100%'}}
              onClick={() => {
                const dssn = document.getElementById('dssn-login').value;
                const password = document.getElementById('password-login').value;
                
                if (!dssn || !password) {
                  alert('Please enter both DSSN and password');
                  return;
                }
                
                handleTransportLogin(dssn, password);
              }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login to Account'}
            </button>

            <div className="auth-links">
              <a href="#forgot-password" className="auth-link">Forgot Password?</a>
            </div>
          </div>
        )}
      </div>
      
      <div className="auth-footer">
        <p>Backend integration will verify DSSN role-based access</p>
      </div>
    </div>
  );

  return (
    <div className="app">
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🚗</span>
            <span>Digital Liberia Transport</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '0.5rem 1rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div style={{ 
                fontSize: '1.5rem',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
              }}>
                🇱🇷
              </div>
              <span style={{ 
                color: 'var(--white)', 
                fontSize: '0.9rem',
                fontWeight: '600',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}>
                Republic of Liberia
              </span>
            </div>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <span style={{ 
                  color: 'var(--white)', 
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}>
                  Welcome, {user.firstName} {user.lastName}
                </span>
                <button 
                  onClick={handleLogout}
                  className="btn btn-glass"
                  style={{ 
                    padding: '0.7rem 1.2rem', 
                    fontSize: '0.85rem',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowLogin(true)}
                className="btn btn-transport"
                style={{ 
                  padding: '0.7rem 1.5rem', 
                  fontSize: '0.9rem',
                  boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)'
                }}
              >
                🚗 Transport Login
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        {!user ? (
          <div className="hero-section">
            <div className="hero-text">
              <h1>
                National Transport
                <br />
                <span style={{ 
                  background: 'var(--transport-gradient)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent', 
                  backgroundClip: 'text' 
                }}>
                  Management System
                </span>
              </h1>
              <p>
                Advanced transportation management platform for Liberian infrastructure, 
                providing real-time logistics and coordinated mobility solutions.
              </p>

              {/* Transport Features Grid */}
              <div className="transport-features-grid">
                {/* Vehicle Registration Feature */}
                <div 
                  className="transport-feature-item floating" 
                  onClick={handleVehicleClick}
                  style={{
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(124, 58, 237, 0.1))',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    backdropFilter: 'blur(10px)',
                    animationDelay: '0s',
                    cursor: 'pointer'
                  }}
                >
                  <div className="transport-feature-icon" style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)'
                  }}>🚙</div>
                  <div className="transport-feature-content">
                    <h4>Vehicle Registration</h4>
                    <p>Complete vehicle lifecycle management including registration, documentation, compliance tracking, and digital certification services.</p>
                  </div>
                </div>

                {/* Drivers License Feature */}
                <div 
                  className="transport-feature-item floating" 
                  onClick={handleLicenseClick}
                  style={{
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.1))',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    backdropFilter: 'blur(10px)',
                    animationDelay: '0.2s',
                    cursor: 'pointer'
                  }}
                >
                  <div className="transport-feature-icon" style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)'
                  }}>👨‍✈️</div>
                  <div className="transport-feature-content">
                    <h4>Drivers License Services</h4>
                    <p>Comprehensive driver management including license applications, renewals, certifications, and digital license management.</p>
                  </div>
                </div>

                {/* Fleet Management Feature */}
                <div className="transport-feature-item floating" style={{
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(22, 163, 74, 0.1))',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  backdropFilter: 'blur(10px)',
                  animationDelay: '0.4s'
                }}>
                  <div className="transport-feature-icon" style={{
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    boxShadow: '0 8px 20px rgba(34, 197, 94, 0.3)'
                  }}>🚚</div>
                  <div className="transport-feature-content">
                    <h4>Fleet Management</h4>
                    <p>Advanced fleet tracking and optimization with real-time monitoring, maintenance scheduling, and comprehensive analytics.</p>
                  </div>
                </div>

                {/* Route Planning Feature */}
                <div className="transport-feature-item floating" style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.1))',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  backdropFilter: 'blur(10px)',
                  animationDelay: '0.6s'
                }}>
                  <div className="transport-feature-icon" style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)'
                  }}>🛣️</div>
                  <div className="transport-feature-content">
                    <h4>Route Planning & Optimization</h4>
                    <p>Intelligent route planning with traffic analysis, congestion management, and optimization algorithms for efficient transportation.</p>
                  </div>
                </div>
              </div>

              <div className="hero-actions">
                <button 
                  onClick={() => setShowLogin(true)}
                  className="btn btn-transport"
                >
                  🚗 Access Transport Portal
                </button>
                <button className="btn btn-logistics">
                  📦 Logistics Dashboard
                </button>
                <button className="btn btn-infrastructure">
                  🛣️ Infrastructure Map
                </button>
              </div>
            </div>

            <div className="hero-visual" style={{ position: 'relative' }}>
              <div 
                className="floating"
                style={{
                  background: 'var(--card-bg)',
                  padding: '3rem',
                  borderRadius: 'var(--border-radius-lg)',
                  boxShadow: 'var(--shadow-xl)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(20px)',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(45deg, 
                    rgba(34, 197, 94, 0.08) 0%, 
                    rgba(59, 130, 246, 0.08) 50%, 
                    rgba(245, 158, 11, 0.08) 100%)`,
                  zIndex: 0
                }}></div>
                
                <div 
                  style={{
                    fontSize: '6rem',
                    marginBottom: '2rem',
                    color: '#22c55e',
                    filter: 'drop-shadow(0 4px 12px rgba(34, 197, 94, 0.4))',
                    position: 'relative',
                    zIndex: 1,
                    animation: 'pulse 2s ease-in-out infinite'
                  }}
                >
                  🚗
                </div>
                <h3 style={{ 
                  color: '#22c55e', 
                  marginBottom: '1rem',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  position: 'relative',
                  zIndex: 1,
                  textShadow: '0 2px 4px rgba(34, 197, 94, 0.2)'
                }}>
                  National Mobility First
                </h3>
                <p style={{ 
                  color: 'var(--text-light)', 
                  lineHeight: '1.6',
                  position: 'relative',
                  zIndex: 1
                }}>
                  Advanced transport solutions connecting the Republic of Liberia
                </p>
                
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '8px',
                  padding: '0.5rem 0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  zIndex: 1
                }}>
                  <span style={{ fontSize: '1.2rem' }}>🇱🇷</span>
                  <span style={{ 
                    fontSize: '0.8rem', 
                    color: '#22c55e',
                    fontWeight: '600'
                  }}>
                    LIBERIA
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ 
            width: '100%', 
            maxWidth: '1200px',
            textAlign: 'center'
          }}>
            <div 
              style={{
                background: 'var(--card-bg)',
                padding: '4rem',
                borderRadius: 'var(--border-radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(20px)',
                marginBottom: '3rem',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(135deg, 
                  rgba(34, 197, 94, 0.03) 0%, 
                  rgba(59, 130, 246, 0.03) 50%, 
                  rgba(245, 158, 11, 0.03) 100%)`,
                zIndex: 0
              }}></div>
              
              <div 
                style={{
                  fontSize: '4rem',
                  marginBottom: '1.5rem',
                  background: 'var(--transport-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                🎉
              </div>
              <h1 style={{ 
                color: 'var(--text-dark)', 
                marginBottom: '1rem',
                fontSize: '2.5rem',
                fontWeight: '800',
                position: 'relative',
                zIndex: 1
              }}>
                Welcome to Transport Portal
              </h1>
              <p style={{ 
                color: 'var(--text-light)', 
                fontSize: '1.2rem',
                marginBottom: '2rem',
                position: 'relative',
                zIndex: 1
              }}>
                Access advanced transport tools and national mobility systems
              </p>
              
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.8rem',
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '12px',
                padding: '0.8rem 1.2rem',
                marginBottom: '2rem',
                position: 'relative',
                zIndex: 1
              }}>
                <span style={{ fontSize: '1.5rem' }}>🇱🇷</span>
                <span style={{ 
                  fontSize: '0.9rem', 
                  color: '#22c55e',
                  fontWeight: '600'
                }}>
                  Ministry of Transport - Republic of Liberia
                </span>
              </div>
              
              {/* Transport Action Grid */}
              <div className="transport-action-grid">
                <div className="transport-action-card floating" style={{
                  borderTop: '4px solid #22c55e',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9))',
                  animationDelay: '0s'
                }}>
                  <div className="transport-card-icon" style={{
                    backgroundColor: '#22c55e20',
                    color: '#22c55e',
                    background: 'linear-gradient(135deg, #22c55e30, #22c55e10)'
                  }}>🚚</div>
                  <h3 className="transport-card-title">Fleet Management</h3>
                  <p className="transport-card-description">
                    Real-time national fleet tracking and vehicle management systems
                  </p>
                  <button className="btn btn-transport">
                    Manage Fleet
                  </button>
                </div>
                
                <div className="transport-action-card floating" style={{
                  borderTop: '4px solid #3b82f6',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9))',
                  animationDelay: '0.2s'
                }}>
                  <div className="transport-card-icon" style={{
                    backgroundColor: '#3b82f620',
                    color: '#3b82f6',
                    background: 'linear-gradient(135deg, #3b82f630, #3b82f610)'
                  }}>🛣️</div>
                  <h3 className="transport-card-title">Route Planning</h3>
                  <p className="transport-card-description">
                    Optimize and manage transport routes across Liberia
                  </p>
                  <button className="btn btn-logistics">
                    Plan Routes
                  </button>
                </div>
                
                <div className="transport-action-card floating" style={{
                  borderTop: '4px solid #f59e0b',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9))',
                  animationDelay: '0.4s'
                }}>
                  <div className="transport-card-icon" style={{
                    backgroundColor: '#f59e0b20',
                    color: '#f59e0b',
                    background: 'linear-gradient(135deg, #f59e0b30, #f59e0b10)'
                  }}>📦</div>
                  <h3 className="transport-card-title">Logistics</h3>
                  <p className="transport-card-description">
                    Coordinate cargo and passenger logistics nationwide
                  </p>
                  <button className="btn btn-transport">
                    View Logistics
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {showLogin && (
        <Login 
          onLoginSuccess={handleLoginSuccess}
          onBack={() => setShowLogin(false)}
        />
      )}

      {/* Vehicle Registration Modal */}
      <Modal 
        show={showVehicleModal} 
        onClose={() => {
          setShowVehicleModal(false);
          setShowPasswordForm(false);
          setVerifiedDSSN('');
        }}
        title="Vehicle Registration Services"
      >
        <AuthModalContent serviceType="vehicle_registration" />
      </Modal>

      {/* Drivers License Modal */}
      <Modal 
        show={showLicenseModal} 
        onClose={() => {
          setShowLicenseModal(false);
          setShowPasswordForm(false);
          setVerifiedDSSN('');
        }}
        title="Drivers License Services"
      >
        <AuthModalContent serviceType="drivers_license" />
      </Modal>
    </div>
  );
}

export default App;
