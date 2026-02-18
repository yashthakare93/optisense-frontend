import { useState, useEffect } from 'react';
import { getProductsByShop } from '../api';

function OverviewTab({ shop }) {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalStock: 0,
        totalValue: 0,
        lowStockItems: 0
    });

    useEffect(() => {
        if (shop?.shopId) {
            calculateStats();
        }
    }, [shop]);

    const calculateStats = async () => {
        try {
            if (!shop?.shopId) return;

            const products = await getProductsByShop(shop.shopId);

            if (!Array.isArray(products)) return;

            const totalProducts = products.length;
            const totalStock = products.reduce((sum, p) => sum + (p.stockQuantity || 0), 0);
            const totalValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.stockQuantity || 0)), 0);
            const lowStockItems = products.filter(p => (p.stockQuantity || 0) < 5).length;

            setStats({ totalProducts, totalStock, totalValue, lowStockItems });
        } catch (error) {
            console.error("Failed to load stats", error);
        }
    };

    return (
        <div className="row g-4">
            {/* Stats Cards - Black & White Theme */}
            <div className="col-md-3">
                <div className="card border-1 border-dark shadow-sm bg-white h-100">
                    <div className="card-body">
                        <h6 className="card-title text-muted text-uppercase small fw-bold">Total Products</h6>
                        <h2 className="fw-bold mb-0 text-dark">{stats.totalProducts}</h2>
                        <small className="text-secondary">Variants (SKUs)</small>
                    </div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="card border-1 border-dark shadow-sm bg-dark text-white h-100">
                    <div className="card-body">
                        <h6 className="card-title text-white-50 text-uppercase small fw-bold">Total Stock</h6>
                        <h2 className="fw-bold mb-0">{stats.totalStock}</h2>
                        <small className="text-white-50">Units Available</small>
                    </div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="card border-1 border-dark shadow-sm bg-white h-100">
                    <div className="card-body">
                        <h6 className="card-title text-muted text-uppercase small fw-bold">Inventory Value</h6>
                        <h2 className="fw-bold mb-0 text-dark">₹{(stats.totalValue / 1000).toFixed(1)}k</h2>
                        <small className="text-secondary">Estimated Value</small>
                    </div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="card border-1 border-dark shadow-sm bg-white h-100">
                    <div className="card-body">
                        <h6 className="card-title text-muted text-uppercase small fw-bold">Low Stock</h6>
                        <h2 className="fw-bold mb-0 text-dark">{stats.lowStockItems}</h2>
                        <small className="text-secondary">Items &lt; 5 qty</small>
                    </div>
                </div>
            </div>

            <div className="col-12">
                <div className="card border-0 shadow-sm">
                    <div className="card-body">
                        <h5 className="fw-bold">Welcome, {shop?.name}</h5>
                        <p className="text-muted mb-0">
                            Your shop is currently <strong>{shop?.status}</strong>.
                            Use the tabs above to manage your inventory and orders.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OverviewTab;
