import React, { useState, useEffect } from 'react';
import Login from './components/Login';

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
    console.log('Transportation system login successful:', userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('transportUser');
  };

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
                  Welcome, Officer {user.profile?.firstName} {user.profile?.lastName}
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

              <div className="transport-features-grid">
                <div className="transport-feature-item floating" style={{
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(22, 163, 74, 0.1))',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  backdropFilter: 'blur(20px)',
                  animationDelay: '0s'
                }}>
                  <div className="transport-feature-icon" style={{
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    boxShadow: '0 8px 25px rgba(34, 197, 94, 0.4)'
                  }}>🚚</div>
                  <div className="transport-feature-content">
                    <h4>Fleet Management</h4>
                    <p>Real-time vehicle tracking and fleet optimization for national transport</p>
                  </div>
                </div>

                <div className="transport-feature-item floating" style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.1))',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  backdropFilter: 'blur(20px)',
                  animationDelay: '0.2s'
                }}>
                  <div className="transport-feature-icon" style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)'
                  }}>🛣️</div>
                  <div className="transport-feature-content">
                    <h4>Route Planning</h4>
                    <p>Intelligent route optimization and traffic management systems</p>
                  </div>
                </div>

                <div className="transport-feature-item floating" style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.1))',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  backdropFilter: 'blur(20px)',
                  animationDelay: '0.4s'
                }}>
                  <div className="transport-feature-icon" style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    boxShadow: '0 8px 25px rgba(245, 158, 11, 0.4)'
                  }}>⚡</div>
                  <div className="transport-feature-content">
                    <h4>Logistics Coordination</h4>
                    <p>Efficient cargo and passenger transport coordination nationwide</p>
                  </div>
                </div>

                <div className="transport-feature-item floating" style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(124, 58, 237, 0.1))',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  backdropFilter: 'blur(20px)',
                  animationDelay: '0.6s'
                }}>
                  <div className="transport-feature-icon" style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)'
                  }}>📊</div>
                  <div className="transport-feature-content">
                    <h4>Infrastructure Analytics</h4>
                    <p>Comprehensive transport infrastructure monitoring and analytics</p>
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
              
              <div className="transport-action-grid">
                <div className="transport-action-card floating" style={{
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(22, 163, 74, 0.1))',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  backdropFilter: 'blur(20px)',
                  animationDelay: '0s'
                }}>
                  <div className="transport-card-icon" style={{
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    boxShadow: '0 15px 30px rgba(34, 197, 94, 0.4)'
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
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.1))',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  backdropFilter: 'blur(20px)',
                  animationDelay: '0.2s'
                }}>
                  <div className="transport-card-icon" style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    boxShadow: '0 15px 30px rgba(59, 130, 246, 0.4)'
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
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.1))',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  backdropFilter: 'blur(20px)',
                  animationDelay: '0.4s'
                }}>
                  <div className="transport-card-icon" style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    boxShadow: '0 15px 30px rgba(245, 158, 11, 0.4)'
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
    </div>
  );
}

export default App;
