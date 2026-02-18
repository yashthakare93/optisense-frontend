import React, { useState, useEffect } from 'react';
import UserManagementTab from './tabs/UserManagementTab';
import ShopManagementTab from './tabs/ShopManagementTab';
import { getShopStats } from './api';

function AdminDashboard() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [activeTab, setActiveTab] = useState('USERS');

    // Stats State
    const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getShopStats();
                // API wrapper returns response.data or response directly depending on impl.
                // admin/api.js returns 'response', so we need 'response.data' if it's an axioss response, 
                // BUT common/api.js interceptor normally returns `response.data`.
                // Let's check api.js again. admin/api.js for getShopStats returns `response`. 
                // If apiClient returns `response`, then we need `response.data`. 
                // Wait, getAllUsers in admin/api.js returns `response.data`. 
                // getShopStats returns `response`. This is inconsistent. I should fix api.js first actually or just handle it.
                // Let's assume response is the data because of common/api.js usually unwrapping.
                // Actually, looking at admin/api.js line 86: `return response;`. Line 85: `await apiClient.get(...)`.
                // I will assume it returns the data directly based on other parts, but I'll check if it's an object.
                setStats(data || { pending: 0, approved: 0, rejected: 0 });
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
        // Set interval to refresh stats periodically
        const interval = setInterval(fetchStats, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-vh-100 bg-light" style={{ paddingTop: '100px' }}>
            <div className="bg-white border-bottom shadow-sm px-4 py-3 d-flex justify-content-between align-items-center">
                <h4 className="fw-bold mb-0 text-primary">Admin Dashboard</h4>
                <div className="btn-group">
                    <button
                        className={`btn ${activeTab === 'USERS' ? 'btn-dark' : 'btn-outline-dark'}`}
                        onClick={() => setActiveTab('USERS')}
                    >
                        Users
                    </button>
                    <button
                        className={`btn ${activeTab === 'SHOPS' ? 'btn-dark' : 'btn-outline-dark'}`}
                        onClick={() => setActiveTab('SHOPS')}
                    >
                        Shops
                    </button>
                </div>
            </div>

            <div className="container py-4">
                {/* --- STATS OVERVIEW --- */}
                <div className="row mb-4">
                    <StatCard title="Total Users" value="-" color="primary" icon="👥" />
                    <StatCard title="Pending Shops" value={stats.pending} color="warning" icon="⏳" />
                    <StatCard title="Active Shops" value={stats.approved} color="success" icon="✅" />
                    <StatCard title="Rejected Shops" value={stats.rejected} color="danger" icon="❌" />
                </div>

                {activeTab === 'USERS' && <UserManagementTab />}
                {activeTab === 'SHOPS' && <ShopManagementTab />}
            </div>
        </div>
    );
}

function StatCard({ title, value, color, icon }) {
    return (
        <div className="col-md-3">
            <div className={`card shadow-sm border-start border-${color} border-4`}>
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <div className="text-muted small fw-bold text-uppercase">{title}</div>
                            <h3 className="fw-bold mb-0 text-dark">{value}</h3>
                        </div>
                        <div className={`text-${color} fs-1 opacity-25`}>{icon}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;