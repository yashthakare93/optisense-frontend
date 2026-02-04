import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from './api';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(email, password);

      // Sync user to localStorage so Navbar updates immediately
      localStorage.setItem('user', JSON.stringify(response.data));
      window.dispatchEvent(new Event("authChange"));

      const userRole = response.data?.role;

      // ROLE-BASED NAVIGATION SWITCH
      switch (userRole) {
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        case 'SELLER':
          navigate('/seller/dashboard');
          break;
        case 'CUSTOMER':
          navigate('/customer/dashboard');
          break;
        default:
          navigate('/'); // Fallback if role is undefined or different
          break;
      }

    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex overflow-hidden bg-white">
      {/* LEFT SIDE: Visual Brand Panel */}
      <div className="d-none d-lg-flex col-lg-7 position-relative align-items-center justify-content-center bg-dark" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&q=80&w=2070")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(135deg, rgba(0,0,66,0.8) 0%, rgba(0,0,0,0.4) 100%)' }}></div>
        <div className="position-relative text-center text-white px-5">
          <h1 className="display-3 fw-black mb-3">OptiSense</h1>
          <p className="lead opacity-75 tracking-widest text-uppercase">Precision Vision. Premium Style.</p>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="col-12 col-lg-5 d-flex align-items-center justify-content-center p-4 p-md-5">
        <div className="w-100" style={{ maxWidth: '400px' }}>

          <div className="mb-5 text-center text-lg-start">
            <h2 className="fw-black text-primary-custom display-6 mb-2">Welcome Back</h2>
            <p className="text-muted">Enter your details to access your OptiSense account.</p>
          </div>

          {error && (
            <div className="alert alert-danger border-0 rounded-3 small py-2 mb-4 d-flex align-items-center">
              <span className="me-2">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* Email Field */}
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control border-0 bg-light shadow-none"
                id="floatingEmail"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="floatingEmail" className="text-muted">Email address</label>
            </div>

            {/* Password Field */}
            <div className="form-floating mb-4">
              <input
                type="password"
                className="form-control border-0 bg-light shadow-none"
                id="floatingPassword"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="floatingPassword" className="text-muted">Password</label>
            </div>

            {/* Action Buttons */}
            <button
              type="submit"
              className="btn btn-dark w-100 py-3 rounded-3 fw-bold mb-4 shadow-sm"
              disabled={loading}
              style={{ backgroundColor: '#000042', transition: 'all 0.3s ease' }}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : 'Login to Account'}
            </button>

            <div className="text-center mt-4">
              <p className="text-muted small">
                New to OptiSense? <Link to="/signup" className="text-cyan fw-bold text-decoration-none hover-underline">Create an Account</Link>
              </p>
            </div>
          </form>

          {/* Simple Footer Links */}
          <div className="mt-5 pt-4 border-top text-center">
            <Link to="/" className="text-muted small text-decoration-none">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;