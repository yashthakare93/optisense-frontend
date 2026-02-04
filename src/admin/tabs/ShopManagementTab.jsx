import React, { useState, useEffect } from 'react';
import { getShopsByStatus, approveShop, rejectShop } from '../api';
import ShopDetailsModal from '../components/ShopDetailsModal';

function ShopManagementTab() {
    // State for Data
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeStatus, setActiveStatus] = useState('PENDING'); // PENDING, APPROVED, REJECTED

    // State for Modal
    const [selectedShop, setSelectedShop] = useState(null);
    const [isRejecting, setIsRejecting] = useState(false);

    // 1. Fetch Shops when Filter Changes
    useEffect(() => {
        fetchShops();
    }, [activeStatus]);

    const fetchShops = async () => {
        try {
            setLoading(true);
            const data = await getShopsByStatus(activeStatus);
            setShops(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // 2. Action Handlers
    const handleApprove = async () => {
        if (!selectedShop) return;
        if (!window.confirm(`Approve shop "${selectedShop.shopName}"?`)) return;

        try {
            await approveShop(selectedShop.shopId);
            alert("Shop Approved! ✅");
            setSelectedShop(null);
            fetchShops();
        } catch (err) {
            alert("Failed to approve.");
        }
    };

    const handleReject = async (reason) => {
        if (!selectedShop || !reason) return;
        try {
            await rejectShop(selectedShop.shopId, reason);
            alert("Shop Rejected. ❌");
            setSelectedShop(null);
            setIsRejecting(false);
            fetchShops();
        } catch (err) {
            alert("Failed to reject.");
        }
    };

    return (
        <div>
            {/* --- FILTER TABS --- */}
            <div className="d-flex mb-4 gap-2">
                {['PENDING', 'APPROVED', 'REJECTED'].map(status => (
                    <button
                        key={status}
                        className={`btn ${activeStatus === status ? 'btn-dark' : 'btn-outline-secondary'} rounded-pill px-4`}
                        onClick={() => setActiveStatus(status)}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* --- TABLE --- */}
            {loading ? (
                <div className="text-center py-5">Loading shops...</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Shop Name</th>
                                <th>Business Type</th>
                                <th>Owner ID</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shops.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-4 text-muted">No shops found for this status.</td></tr>
                            ) : (
                                shops.map((shop) => (
                                    <tr key={shop.shopId}>
                                        <td>#{shop.shopId}</td>
                                        <td className="fw-bold">{shop.shopName}</td>
                                        <td><span className="badge bg-light text-dark border">{shop.businessType || 'N/A'}</span></td>
                                        <td>User #{shop.sellerId}</td>
                                        <td className="small text-muted">{new Date().toLocaleDateString()}</td>
                                        {/* Note: Backend needs to send createdDate ideally */}
                                        <td>
                                            <button
                                                className="btn btn-primary btn-sm px-3"
                                                onClick={() => setSelectedShop(shop)}
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- MODAL FOR DETAILS (The "Rest Fields") --- */}
            {selectedShop && (
                <ShopDetailsModal
                    shop={selectedShop}
                    onClose={() => { setSelectedShop(null); setIsRejecting(false); }}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    isPending={activeStatus === 'PENDING'}
                    isRejecting={isRejecting}
                    setRejecting={setIsRejecting}
                />
            )}
        </div>
    );
}

export default ShopManagementTab;
