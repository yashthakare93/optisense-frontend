import React, { useState } from 'react';
import OverviewTab from './tabs/OverviewTab';
import OrdersTab from './tabs/OrdersTab';
import WishlistTab from './tabs/WishlistTab';
import SettingsTab from './tabs/SettingsTab';

function CustomerDashboard() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [activeTab, setActiveTab] = useState('OVERVIEW');

    if (!user || user.role !== 'CUSTOMER') {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <p className="text-muted">Access Denied. Customer access required.</p>
            </div>
        );
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'OVERVIEW':
                return <OverviewTab user={user} />;
            case 'ORDERS':
                return <OrdersTab />;
            case 'WISHLIST':
                return <WishlistTab />;
            case 'SETTINGS':
                return <SettingsTab user={user} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-vh-100 bg-light">
            {/* Header & Tabs */}
            <div className="bg-white border-bottom shadow-sm">
                <div className="container py-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <h2 className="fw-bold text-dark mb-0">My Account</h2>
                            <p className="text-muted mb-0">Welcome back, {user.name}</p>
                        </div>
                        <div className="text-uppercase small fw-bold tracking-widest text-muted">
                            Customer Dashboard
                        </div>
                    </div>
                </div>
                <div className="container">
                    <ul className="nav nav-tabs border-bottom-0">
                        {['OVERVIEW', 'ORDERS', 'WISHLIST', 'SETTINGS'].map(tab => (
                            <li className="nav-item" key={tab}>
                                <button
                                    className={`nav-link border-0 py-3 px-4 ${activeTab === tab ? 'active border-bottom border-dark border-3 fw-bold text-dark' : 'text-muted'}`}
                                    onClick={() => setActiveTab(tab)}
                                    style={{ backgroundColor: 'transparent' }}
                                >
                                    {tab.charAt(0) + tab.slice(1).toLowerCase()}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Content Area */}
            <div className="container py-5">
                {renderContent()}
            </div>
        </div>
    );
}

export default CustomerDashboard;
