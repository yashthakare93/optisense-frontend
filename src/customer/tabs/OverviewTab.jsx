import React from 'react';
import { Link } from 'react-router-dom';

function OverviewTab({ user }) {
    return (
        <div className="row g-4">
            {/* Profile Card */}
            <div className="col-md-4">
                <div className="card border-0 shadow-sm p-4 h-100">
                    <h5 className="fw-bold mb-4">Profile Information</h5>
                    <div className="mb-3">
                        <small className="text-muted d-block">Full Name</small>
                        <strong>{user.name}</strong>
                    </div>
                    <div className="mb-3">
                        <small className="text-muted d-block">Email Address</small>
                        <strong>{user.email}</strong>
                    </div>
                    <div>
                        <small className="text-muted d-block">Member Since</small>
                        <strong>2024</strong>
                    </div>
                </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="col-md-8">
                <div className="card border-0 shadow-sm p-4 h-100">
                    <h5 className="fw-bold mb-4">Recent Orders</h5>
                    <div className="text-center py-5 text-muted bg-light rounded-3">
                        <span style={{ fontSize: '2rem' }}>📦</span>
                        <p className="mt-2 mb-0">No active orders found.</p>
                        <Link to="/" className="btn btn-dark mt-3 btn-sm">Start Shopping</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OverviewTab;
