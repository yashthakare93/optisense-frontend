import React from 'react';

function OverviewTab() {
    return (
        <div className="card shadow-sm border-0">
            <div className="card-body p-4">
                <h5 className="card-title fw-bold text-dark mb-3">Shop Overview</h5>
                <p className="text-muted">
                    Welcome to your seller dashboard. Here you can manage your products, view orders, and update your shop settings.
                </p>
                <div className="alert alert-light border border-secondary border-opacity-25 d-inline-block">
                    <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>Quick Status</small>
                    <div className="fw-bold text-dark">System Operational</div>
                </div>
            </div>
        </div>
    );
}

export default OverviewTab;
