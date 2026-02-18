import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductsByShop, deleteProduct } from '../api';
import ProductDetailsModal from '../modals/ProductDetailsModal';

function ProductsTab({ shop }) {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]); // Raw products
    const [groupedProducts, setGroupedProducts] = useState([]); // Grouped by Model
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null); // The specific variant to show
    const [selectedGroup, setSelectedGroup] = useState([]); // All variants in the group
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        if (shop?.shopId) {
            fetchProducts();
        }
    }, [shop]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await getProductsByShop(shop.shopId);
            setProducts(data || []);
            groupProducts(data || []);
        } catch (err) {
            console.error("Failed to fetch products", err);
            setError("Failed to load products.");
        } finally {
            setLoading(false);
        }
    };

    const groupProducts = (rawProducts) => {
        const groups = {};

        const seenIds = new Set();
        rawProducts.forEach(product => {
            if (seenIds.has(product.productId)) return;
            seenIds.add(product.productId);

            // Priority:
            // 1. Model No (Normalized: trimmed, lowercase)
            // 2. Name (Fallback)

            let key = 'Unknown';
            const baseModel = product.specifications?.['Base Model'];
            const modelNo = product.specifications?.['Model No.'];

            if (baseModel && baseModel.trim() !== '') {
                key = baseModel.trim().toUpperCase();
            } else if (modelNo && modelNo.trim() !== '') {
                key = modelNo.trim().toUpperCase(); // Legacy/Fallback
            } else if (product.name) {
                key = product.name.trim(); // Fallback to name
            }

            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(product);
        });

        // Convert map to array of groups (each group is an array of variants)
        setGroupedProducts(Object.values(groups));
    };

    const handleDelete = async (productId) => {
        console.log('Delete button clicked for product:', productId);
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProduct(productId);
                // Refresh both lists
                const newProducts = products.filter(p => p.productId !== productId);
                setProducts(newProducts);
                groupProducts(newProducts);
            } catch (err) {
                console.error('Delete error:', err);
                alert("Failed to delete product");
            }
        }
    };

    const handleProductAdded = () => {
        fetchProducts();
    };

    if (loading) return <div className="text-center py-5 text-muted">Loading products...</div>;

    return (
        <div>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h4 className="fw-bold mb-1 text-dark">My Inventory</h4>
                    <p className="text-muted small mb-0">Manage your collections and variants</p>
                </div>
                <button
                    className="btn btn-dark rounded-0 px-4 py-2 text-uppercase small fw-bold tracking-wide"
                    onClick={() => navigate('/seller/add-product', { state: { shopId: shop.shopId } })}
                >
                    + Add Product
                </button>
            </div>

            {error && <div className="alert alert-danger rounded-0 border-0 border-start border-4 border-danger">{error}</div>}

            {groupedProducts.length === 0 ? (
                <div className="text-center py-5 border border-dashed text-muted">
                    <h5 className="fw-normal mb-2">No products found</h5>
                    <button className="btn btn-link text-dark text-decoration-none" onClick={() => navigate('/seller/add-product', { state: { shopId: shop.shopId } })}>
                        Start adding products &rarr;
                    </button>
                </div>
            ) : (
                <div className="card border-0 shadow-sm">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-white border-bottom border-2">
                                <tr>
                                    <th className="py-3 ps-4 text-secondary text-uppercase small fw-bold" style={{ width: '40%' }}>Product</th>
                                    <th className="py-3 text-secondary text-uppercase small fw-bold">Variants</th>
                                    <th className="py-3 text-secondary text-uppercase small fw-bold">Price</th>
                                    <th className="py-3 text-secondary text-uppercase small fw-bold">Status</th>
                                    <th className="py-3 text-end pe-4 text-secondary text-uppercase small fw-bold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupedProducts.map((group, index) => {
                                    const mainProduct = group[0];
                                    const variantCount = group.length;
                                    const totalStock = group.reduce((sum, p) => sum + (p.stockQuantity || 0), 0);

                                    return (
                                        <tr key={index} className="border-bottom">
                                            <td className="ps-4 py-3">
                                                <div className="d-flex align-items-start">
                                                    <div className="border d-flex align-items-center justify-content-center me-3" style={{ width: '70px', height: '70px' }}>
                                                        {mainProduct.images && mainProduct.images.length > 0 ? (
                                                            <img
                                                                src={`http://localhost:8080${mainProduct.images[0]}`}
                                                                alt={mainProduct.name}
                                                                className="img-fluid p-1 object-fit-contain h-100"
                                                            />
                                                        ) : (
                                                            <span className="text-muted small" style={{ fontSize: '0.7rem' }}>No Img</span>
                                                        )}
                                                    </div>
                                                    <div className="pt-1">
                                                        <div className="fw-bold text-dark">{mainProduct.name}</div>
                                                        <div className="small text-muted text-uppercase tracking-wider mt-1">
                                                            {mainProduct.brand} &bull; <span className="text-secondary">{mainProduct.specifications?.['Base Model'] || mainProduct.specifications?.['Model No.'] || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge border border-dark text-dark bg-white rounded-pill px-3 fw-normal">
                                                    {variantCount} Color{variantCount > 1 ? 's' : ''}
                                                </span>
                                                <div className="small text-muted mt-2 text-truncate" style={{ maxWidth: '150px' }}>
                                                    {group.map(p => p.specifications?.['Frame Colour'] || 'Standard').join(', ')}
                                                </div>
                                            </td>
                                            <td className="fw-bold text-dark">₹{mainProduct.price.toLocaleString()}</td>
                                            <td>
                                                {totalStock > 0 ? (
                                                    <div className="d-flex align-items-center gap-2">
                                                        <span className="d-inline-block bg-success rounded-circle" style={{ width: '8px', height: '8px' }}></span>
                                                        <span className="text-dark small">{totalStock} units</span>
                                                    </div>
                                                ) : (
                                                    <div className="d-flex align-items-center gap-2">
                                                        <span className="d-inline-block bg-danger rounded-circle" style={{ width: '8px', height: '8px' }}></span>
                                                        <span className="text-danger small fw-bold">Out of Stock</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="text-end pe-4">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <button
                                                        className="btn btn-sm btn-outline-dark"
                                                        onClick={() => { setSelectedGroup(group); setShowDetails(true); }}
                                                        title="View Details"
                                                    >
                                                        👁️
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-dark"
                                                        onClick={() => navigate('/seller/add-product', { state: { shopId: shop.shopId, initialGroup: group } })}
                                                        title="Edit Product"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-dark"
                                                        onClick={() => navigate('/seller/add-product', { state: { shopId: shop.shopId, initialGroup: group } })}
                                                        title="Add Color Variant"
                                                    >
                                                        🎨+
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDelete(mainProduct.productId)}
                                                        title="Delete Product"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}



            {/* Product Details Modal */}
            <ProductDetailsModal
                show={showDetails}
                productGroup={selectedGroup}
                onClose={() => { setShowDetails(false); setSelectedGroup([]); }}
                onDelete={handleDelete}
            />
        </div>
    );
}

export default ProductsTab;
