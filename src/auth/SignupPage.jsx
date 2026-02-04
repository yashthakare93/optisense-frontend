import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from './api';

function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(name, email, password, role);
      // Navigate to login so they can authenticate
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex overflow-hidden bg-white">
      {/* LEFT SIDE: Matching Visual Brand Panel */}
      <div className="d-none d-lg-flex col-lg-7 position-relative align-items-center justify-content-center bg-dark" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=2000")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(135deg, rgba(0,0,66,0.85) 0%, rgba(0,18,50,0.5) 100%)' }}></div>
        <div className="position-relative text-center text-white px-5">
          <h1 className="display-3 fw-black mb-3">Join OptiSense</h1>
          <p className="lead opacity-75 tracking-widest text-uppercase">See the world through a better lens.</p>
        </div>
      </div>

      {/* RIGHT SIDE: Signup Form */}
      <div className="col-12 col-lg-5 d-flex align-items-center justify-content-center p-4 p-md-5">
        <div className="w-100" style={{ maxWidth: '420px' }}>
          
          <div className="mb-5 text-center text-lg-start">
            <h2 className="fw-black text-primary-custom display-6 mb-2">Create Account</h2>
            <p className="text-muted">Start your premium eyewear journey today.</p>
          </div>

          {error && (
            <div className="alert alert-danger border-0 rounded-3 small py-2 mb-4 d-flex align-items-center">
              <span className="me-2">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSignup}>
            {/* Name Field */}
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control border-0 bg-light shadow-none"
                id="floatingName"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <label htmlFor="floatingName" className="text-muted">Full Name</label>
            </div>

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
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control border-0 bg-light shadow-none"
                id="floatingPassword"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <label htmlFor="floatingPassword" className="text-muted">Password (min. 6 chars)</label>
            </div>

            {/* Role Selection */}
            <div className="mb-4">
              <label className="small text-muted mb-2 ps-1">I am a:</label>
              <div className="d-flex gap-2">
                <button 
                  type="button" 
                  className={`btn flex-fill py-2 rounded-3 border-0 transition-all ${role === 'CUSTOMER' ? 'bg-primary-custom text-white' : 'bg-light text-muted'}`}
                  onClick={() => setRole('CUSTOMER')}
                  style={role === 'CUSTOMER' ? {backgroundColor: '#000042'} : {}}
                >
                  Customer
                </button>
                <button 
                  type="button" 
                  className={`btn flex-fill py-2 rounded-3 border-0 transition-all ${role === 'SELLER' ? 'bg-primary-custom text-white' : 'bg-light text-muted'}`}
                  onClick={() => setRole('SELLER')}
                  style={role === 'SELLER' ? {backgroundColor: '#000042'} : {}}
                >
                  Seller
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-dark w-100 py-3 rounded-3 fw-bold mb-4 shadow-sm"
              disabled={loading}
              style={{ backgroundColor: '#000042', border: 'none' }}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : 'Create My Account'}
            </button>

            <div className="text-center mt-2">
              <p className="text-muted small">
                Already have an account? <Link to="/login" className="text-cyan fw-bold text-decoration-none">Login Here</Link>
              </p>
            </div>
          </form>

          {/* Footer Navigation */}
          <div className="mt-5 pt-4 border-top text-center">
            <Link to="/" className="text-muted small text-decoration-none hover-underline">← Back to OptiSense Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;