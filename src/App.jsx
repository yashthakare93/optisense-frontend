import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './common/Navbar';
import ProtectedRoute from './common/ProtectedRoute';
import AdminRoute from './common/AdminRoute';
// Lazy Load Pages
const HomePage = React.lazy(() => import('./public/Home'));
const LoginPage = React.lazy(() => import('./auth/LoginPage'));
const SignupPage = React.lazy(() => import('./auth/SignupPage'));
const CustomerDashboard = React.lazy(() => import('./customer/CustomerDashboard'));
const SellerDashboard = React.lazy(() => import('./seller/SellerDashboard'));
const AdminDashboard = React.lazy(() => import('./admin/AdminDashboard'));
const Marketplace = React.lazy(() => import('./public/Marketplace'));
const ProductDetails = React.lazy(() => import('./public/ProductDetails'));
const AddProductPage = React.lazy(() => import('./seller/pages/AddProductPage'));

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Navbar />
        <React.Suspense fallback={
          <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/product/:id" element={<ProductDetails />} />

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

            {/* Add Product Page */}
            <Route path="/seller/add-product" element={
              <ProtectedRoute>
                <AddProductPage />
              </ProtectedRoute>
            } />

            {/* Admin Dashboard */}
            <Route path="/admin/dashboard" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
          </Routes>
        </React.Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;