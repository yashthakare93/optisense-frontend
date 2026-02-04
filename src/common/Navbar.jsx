import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../auth/api';

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const syncUser = () => {
      setUser(JSON.parse(localStorage.getItem('user') || 'null'));
    };
    window.addEventListener("authChange", syncUser);
    window.addEventListener("storage", syncUser);
    return () => {
      window.removeEventListener("authChange", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  return (
    <nav className="sticky-top bg-white border-bottom shadow-sm" style={{ zIndex: 1050 }}>
      {/* 1. TOP UTILITY BAR */}
      <div className="border-bottom" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container-fluid px-4 px-lg-5">
          <div className="d-flex justify-content-between align-items-center py-2" style={{ fontSize: '11px' }}>
            <div className="d-flex gap-3">
              <span className="text-muted cursor-pointer hover-cyan">🏠 Book Home Eye Test</span>
              <span className="text-muted cursor-pointer d-none d-md-inline">👓 Try at Home</span>
            </div>
            <div className="d-flex gap-3 align-items-center">
              <span className="text-muted cursor-pointer">Track Order</span>
              <span className="text-muted">Support: <strong className="text-cyan">99998 99998</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION */}
      <div className="navbar navbar-expand-lg bg-white ">
        <div className="container-fluid px-4 px-lg-5">

          {/* LEFT: Logo + Categories locked together at start */}
          <div className="d-flex align-items-center">
            <Link className="navbar-brand me-4" to="/">
              <img src="/Logo.png" alt="OptiSense" style={{ height: '40px' }} />
            </Link>

            <ul className="navbar-nav d-none d-lg-flex flex-row gap-4 mb-0">
              {['EYEGLASSES', 'SUNGLASSES', 'CONTACTS'].map((item) => (
                <li key={item} className="nav-item">
                  <Link
                    className="nav-link fw-bold text-dark text-uppercase p-0"
                    style={{ fontSize: '13px', letterSpacing: '1px' }}
                    to={`/${item.toLowerCase()}`}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT: Profile & Icons */}
          <div className="ms-auto d-flex align-items-center gap-4">

            {/* ACCOUNT DROPDOWN - Fixed Logic */}
            <div className="position-relative">
              <div
                className="d-flex align-items-center gap-2 cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{ cursor: 'pointer' }}
              >
                <span style={{ fontSize: '20px' }}>👤</span>
                <div className="d-flex flex-column leading-tight">
                  <span className="text-muted" style={{ fontSize: '10px' }}>{user ? 'Hello,' : 'Sign In'}</span>
                  <span className="fw-bold text-dark" style={{ fontSize: '12px' }}>
                    {user ? user.name?.split(' ')[0] : 'Account'}
                  </span>
                </div>
              </div>

              {/* Manual Dropdown to ensure it works without external JS */}
              {isDropdownOpen && (
                <div
                  className="position-absolute bg-white shadow rounded-3 py-2 mt-2 end-0 border"
                  style={{ minWidth: '180px', zIndex: 2000 }}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  {user ? (
                    <>
                      {/* DASHBOARD LINK BASED ON ROLE */}
                      <Link
                        className="dropdown-item py-2 px-3 small fw-bold text-primary"
                        to={
                          user.role === 'ADMIN' ? '/admin/dashboard' :
                            user.role === 'SELLER' ? '/seller/dashboard' :
                              '/customer/dashboard'
                        }
                      >
                        📊 Dashboard
                      </Link>

                      {/* ROLE SPECIFIC LINKS */}
                      {user.role === 'CUSTOMER' && (
                        <Link className="dropdown-item py-2 px-3 small fw-bold" to="/orders">My Orders</Link>
                      )}

                      <Link className="dropdown-item py-2 px-3 small fw-bold" to="/profile">Profile Settings</Link>
                      <div className="dropdown-divider"></div>
                      <button onClick={handleLogout} className="dropdown-item py-2 px-3 small fw-bold text-danger">LOGOUT</button>
                    </>
                  ) : (
                    <>
                      <Link className="dropdown-item py-2 px-3 small fw-bold text-dark" to="/login" onClick={() => setIsDropdownOpen(false)}>LOGIN</Link>
                      <Link className="dropdown-item py-2 px-3 small fw-bold text-dark" to="/signup" onClick={() => setIsDropdownOpen(false)}>SIGN UP</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* UTILITY ICONS */}
            <div className="d-flex align-items-center gap-3 border-start ps-4">
              <span className="cursor-pointer d-none d-md-inline" style={{ fontSize: '22px' }}>♡</span>
              <div className="position-relative cursor-pointer">
                <span style={{ fontSize: '22px' }}>👜</span>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary" style={{ fontSize: '9px' }}>0</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;