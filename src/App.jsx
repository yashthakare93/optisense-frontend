import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './common/Navbar';
import HomePage from './public/Home';
import LoginPage from './auth/LoginPage';
import SignupPage from './auth/SignupPage';
import CustomerDashboard from './customer/CustomerDashboard';
import SellerDashboard from './seller/SellerDashboard';
import AdminDashboard from './admin/AdminDashboard';
import ProtectedRoute from './common/protectedRoute';
import AdminRoute from './common/AdminRoute';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Customer Dashboard */}
          <Route path="/customer/dashboard" element={
            <ProtectedRoute>
              <CustomerDashboard />
            </ProtectedRoute>
          } />

          {/* Seller Dashboard */}
          <Route path="/seller/dashboard" element={
            <ProtectedRoute>
              <SellerDashboard />
            </ProtectedRoute>
          } />

          {/* Admin Dashboard */}
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;