import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../auth/api';
import { Heart, ShoppingBag, User, Search as SearchIcon, Phone } from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  return (
    <div className="fixed-top shadow-sm" style={{ zIndex: 1050 }}>
      {/* 1. TOP UTILITY BAR (White Background) */}
      <div className="bg-white text-dark py-1 border-bottom">
        <div className="container-fluid px-3 px-lg-4">
          <div className="d-flex justify-content-between align-items-center" style={{ fontSize: '10px' }}>
            <div className="d-flex gap-2 text-muted">
              <span>Corporate</span> <span>|</span>
              <span>StoreLocator</span> <span>|</span>
              <span>Singapore</span> <span>|</span>
              <span>UAE</span> <span>|</span>
              <span>John Jacobs</span> <span>|</span>
              <span>Aqualens</span> <span>|</span>
              <span>Cobrowsing</span> <span>|</span>
              <span>Engineering Blog</span> <span>|</span>
              <span>Partner With Us</span>
            </div>
            <div className="d-flex gap-2 align-items-center fw-bold">
              <Phone size={12} />
              <span>99998 99998</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR (Black Background - Logo + Categories + Search + Icons) */}
      <div
        className="navbar navbar-expand-lg py-2"
        style={{
          backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.9)' : '#000000',
          backdropFilter: isScrolled ? 'blur(10px)' : 'none',
          transition: 'all 0.3s ease',
          color: 'white'
        }}
      >
        <div className="container-fluid px-3 px-lg-4">
          {/* FLEX CONTAINER */}
          <div className="d-flex align-items-center w-100 justify-content-between">

            {/* LEFT: LOGO */}
            <Link className="navbar-brand me-3" to="/">
              <img src="/Logo.png" alt="OptiSense" style={{ height: '28px', filter: 'brightness(0) invert(1)' }} />
            </Link>

            {/* LEFT-CENTER: CATEGORY LINKS (Visible on Large Screens) */}
            <ul className="navbar-nav d-none d-xl-flex flex-row gap-3 me-auto">
              {[
                { label: 'EYEGLASSES', category: 'Eyeglasses' },
                { label: 'SUNGLASSES', category: 'Sunglasses' },
                { label: 'CONTACTS', category: 'Contact Lenses' },
                { label: 'SPECIAL POWER', category: null },
                { label: 'STORES', category: null },
                { label: 'TRY @ HOME', category: null }
              ].map(item => (
                <li key={item.label} className="nav-item">
                  <Link
                    to={item.category ? `/marketplace?category=${encodeURIComponent(item.category)}` : '/marketplace'}
                    className="nav-link text-white fw-bold text-uppercase p-0"
                    style={{ fontSize: '13px', letterSpacing: '0.3px' }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* RIGHT-CENTER: SEARCH BAR */}
            <div className="d-none d-lg-block mx-3" style={{ width: '280px' }}>
              <form onSubmit={(e) => {
                e.preventDefault();
                navigate(`/marketplace?search=${searchTerm}`);
              }}>
                <div className="input-group align-items-center ps-2" style={{ backgroundColor: '#2B2B2B', borderRadius: '5px', height: '36px' }}>
                  <SearchIcon size={16} className="text-white" />
                  <input
                    type="text"
                    className="form-control border-0 shadow-none bg-transparent text-white"
                    placeholder="What are you looking for?"
                    style={{ fontSize: '13px', padding: '0px 10px', height: '100%', color: 'white' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </form>
            </div>

            {/* RIGHT: ICONS & ACTIONS */}
            <div className="d-flex align-items-center gap-4">
              <div className="cursor-pointer" title="Wishlist">
                <Heart size={20} className="text-white" />
              </div>
              <div className="cursor-pointer" title="Cart">
                <ShoppingBag size={20} className="text-white" />
              </div>

              <div className="position-relative cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <User size={20} className="text-white" />
                {/* DROPDOWN */}
                {isDropdownOpen && (
                  <div className="position-absolute bg-white text-dark shadow-lg rounded-2 py-2 mt-3 end-0 border" style={{ minWidth: '180px', zIndex: 2000 }}>
                    {user ? (
                      <>
                        <div className="px-3 py-1 border-bottom mb-2 bg-light">
                          <small className="d-block text-muted">Hello,</small>
                          <span className="fw-bold">{user.name}</span>
                        </div>
                        <Link className="dropdown-item py-2 px-3 small fw-bold" to={user.role === 'ADMIN' ? '/admin/dashboard' : user.role === 'SELLER' ? '/seller/dashboard' : '/customer/dashboard'}>Dashboard</Link>
                        <Link className="dropdown-item py-2 px-3 small fw-bold" to="/orders">My Orders</Link>
                        <div className="dropdown-divider"></div>
                        <button onClick={handleLogout} className="dropdown-item py-2 px-3 small fw-bold text-danger">Logout</button>
                      </>
                    ) : (
                      <>
                        <Link className="dropdown-item py-2 px-3 small fw-bold" to="/login">Login</Link>
                        <Link className="dropdown-item py-2 px-3 small fw-bold" to="/signup">Sign Up</Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
