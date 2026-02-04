import React, { useState, useEffect } from 'react';
import { getMyShop } from './api';
import OverviewTab from './tabs/OverviewTab';
import ProductsTab from './tabs/ProductsTab';
import OrdersTab from './tabs/OrdersTab';
import SettingsTab from './tabs/SettingsTab';
import CreateShopTab from './tabs/CreateShopTab';

function SellerDashboard() {
    const user = JSON.parse(localStorage.getItem('user'));

    // Global State
    const [shop, setShop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('OVERVIEW');

    // Fetch Shop Data
    useEffect(() => {
        if (user && user.role === 'SELLER') {
            fetchShopDetails();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchShopDetails = async () => {
        try {
            setLoading(true);
            const data = await getMyShop();
            setShop(data);
            setActiveTab('OVERVIEW'); // Reset to Overview on success
        } catch (err) {
            setShop(null);
            setActiveTab('CREATE SHOP'); // Default to Create Shop if no shop
        } finally {
            setLoading(false);
        }
    };

    // Callback for when shop is updated
    const handleShopUpdate = (updatedShop) => {
        setShop(updatedShop);
    };

    // Callback for when shop is created
    const handleShopCreated = (newShop) => {
        setShop(newShop);
        setActiveTab('OVERVIEW');
    };

    if (!user || user.role !== 'SELLER') return <div className="p-5 text-center">Access Denied</div>;
    if (loading) return <div className="vh-100 d-flex align-items-center justify-content-center">Loading...</div>;

    // Define Tabs based on Shop State
    const tabs = shop ? ['OVERVIEW', 'PRODUCTS', 'ORDERS', 'SETTINGS'] : ['CREATE SHOP'];
    const currentTab = tabs.includes(activeTab) ? activeTab : tabs[0];

    const renderContent = () => {
        switch (currentTab) {
            case 'CREATE SHOP': return <CreateShopTab onShopCreated={handleShopCreated} />;
            case 'OVERVIEW': return <OverviewTab />;
            case 'PRODUCTS': return <ProductsTab />;
            case 'ORDERS': return <OrdersTab />;
            case 'SETTINGS': return <SettingsTab shop={shop} onUpdate={handleShopUpdate} />;
            default: return null;
        }
    };

    return (
        <div className="min-vh-100 bg-light">

            {/* PENDING WARNING BANNER */}
            {shop && shop.status === 'PENDING' && (
                <div className="bg-warning text-dark text-center py-2 fw-bold">
                    ⏳ Your shop is currently under review. Some features may be restricted until approval.
                </div>
            )}

            {/* REJECTION DANGER BANNER */}
            {shop && shop.status === 'REJECTED' && (
                <div className="bg-danger text-white text-center py-3 px-3">
                    <div className="fw-bold mb-1">❌ Your shop application was rejected.</div>
                    {shop.rejectionReason && <div className="small bg-white text-danger d-inline-block px-2 rounded mt-1">Reason: {shop.rejectionReason}</div>}
                    <div className="mt-2 small">Please update your shop details in the <b>Settings</b> tab to resubmit for approval.</div>
                </div>
            )}

            <div className="bg-white border-bottom shadow-sm">
                <div className="container py-3 d-flex justify-content-between align-items-center">
                    <div>
                        {shop ? (
                            <>
                                <h4 className="mb-0 fw-bold text-primary">{shop.shopName}</h4>
                                <small className="text-muted text-uppercase tracking-wider">Seller Dashboard</small>
                            </>
                        ) : (
                            <>
                                <h4 className="mb-0 fw-bold text-dark">Welcome, {user.name}</h4>
                                <small className="text-muted text-uppercase tracking-wider">New Seller</small>
                            </>
                        )}
                    </div>
                    {shop ? (
                        shop.status === 'APPROVED' ? (
                            <span className="badge bg-success">Active</span>
                        ) : shop.status === 'REJECTED' ? (
                            <span className="badge bg-danger">Rejected</span>
                        ) : (
                            <span className="badge bg-warning text-dark">Pending Approval</span>
                        )
                    ) : (
                        <span className="badge bg-secondary">No Shop</span>
                    )}
                </div>

                {/* Navigation Tabs */}
                <div className="container">
                    <ul className="nav nav-tabs border-bottom-0">
                        {tabs.map(tab => (
                            <li className="nav-item" key={tab}>
                                <button
                                    className={`nav-link border-0 py-3 px-4 ${currentTab === tab ? 'active border-bottom border-primary border-3 fw-bold text-primary' : 'text-muted'}`}
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

            <div className="container py-4">
                {renderContent()}
            </div>
        </div>
    );
}

export default SellerDashboard;
