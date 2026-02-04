import React from 'react';
import { Link } from 'react-router-dom';

function OrdersTab() {
    return (
        <div className="card border-0 shadow-sm p-5 text-center">
            <h3>📦 Order History</h3>
            <p className="text-muted">You haven't placed any orders yet.</p>
            <Link to="/" className="btn btn-primary mt-2">Browse Store</Link>
        </div>
    );
}

export default OrdersTab;
