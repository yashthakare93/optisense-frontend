import React, { useState, useEffect } from 'react';

function ProductDetailsModal({ show, onClose, productGroup, onDelete }) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState(null);

    // Initial Load: Select the first variant in the group
    useEffect(() => {
        if (productGroup && productGroup.length > 0) {
            setSelectedVariant(productGroup[0]);
            setActiveImageIndex(0);
        }
    }, [productGroup]);

    if (!show || !selectedVariant) return null;

    // Use current selected variant for display
    const product = selectedVariant;

    const nextImage = () => {
        setActiveImageIndex((prev) => (prev + 1) % product.images.length);
    };

    const prevImage = () => {
        setActiveImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    };

    const handleColorChange = (variant) => {
        setSelectedVariant(variant);
        setActiveImageIndex(0);
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '0' }}>
                    <div className="modal-body p-0">
                        <button
                            type="button"
                            className="btn-close position-absolute top-0 end-0 m-3 z-3 bg-white p-2 shadow-sm opacity-100"
                            onClick={onClose}
                        ></button>

                        <div className="row g-0 h-100">
                            {/* Left: Image Gallery */}
                            <div className="col-md-6 bg-light d-flex flex-column align-items-center justify-content-center p-4 position-relative">
                                {product.images && product.images.length > 0 ? (
                                    <>
                                        <div className="w-100 mb-3 text-center" style={{ height: '350px' }}>
                                            <img
                                                src={`http://localhost:8080${product.images[activeImageIndex]}`}
                                                className="img-fluid h-100 object-fit-contain mix-blend-multiply"
                                                alt={product.name}
                                            />
                                        </div>
                                        {/* Thumbnails */}
                                        {product.images.length > 1 && (
                                            <div className="d-flex gap-2 justify-content-center overflow-x-auto w-100 px-2">
                                                {product.images.map((img, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`border ${idx === activeImageIndex ? 'border-dark' : 'border-0'} bg-white`}
                                                        style={{ width: '50px', height: '50px', cursor: 'pointer', opacity: idx === activeImageIndex ? 1 : 0.6 }}
                                                        onClick={() => setActiveImageIndex(idx)}
                                                    >
                                                        <img
                                                            src={`http://localhost:8080${img}`}
                                                            className="w-100 h-100 object-fit-cover"
                                                            alt="thumb"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-muted">No Images</div>
                                )}
                            </div>

                            {/* Right: Product Info */}
                            <div className="col-md-6 p-4 d-flex flex-column bg-white">
                                {/* Header */}
                                <div className="mb-4">
                                    <small className="text-uppercase text-secondary fw-bold tracking-wider">{product.brand}</small>
                                    <h3 className="fw-bold text-dark mt-1 mb-2">{product.name}</h3>
                                    <div className="d-flex align-items-center gap-3">
                                        <h4 className="fw-normal text-dark mb-0">₹{product.price.toLocaleString()}</h4>
                                        <span className={`badge rounded-pill fw-normal px-3 py-1 ${product.stockQuantity > 0 ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                                            {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </div>
                                    <div className="mt-2 text-muted small">
                                        Model: <span className="font-monospace text-dark">{product.specifications?.['Model No.'] || 'N/A'}</span>
                                    </div>
                                </div>

                                {/* Variants */}
                                {productGroup && productGroup.length > 1 && (
                                    <div className="mb-4">
                                        <label className="small text-uppercase fw-bold text-muted mb-2" style={{ fontSize: '0.75rem' }}>Available Colors</label>
                                        <div className="d-flex flex-wrap gap-2">
                                            {productGroup.map((varItem, idx) => {
                                                const isSelected = varItem.productId === selectedVariant.productId;
                                                return (
                                                    <button
                                                        key={varItem.productId}
                                                        className={`btn btn-sm rounded-0 px-3 ${isSelected ? 'btn-dark' : 'btn-outline-dark'}`}
                                                        onClick={() => handleColorChange(varItem)}
                                                    >
                                                        {varItem.specifications?.['Frame Colour'] || `Var ${idx + 1}`}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Specs & Desc */}
                                <div className="flex-grow-1 overflow-y-auto" style={{ maxHeight: '300px' }}>
                                    {/* Description */}
                                    <div className="mb-4">
                                        <h6 className="fw-bold border-bottom pb-2 mb-2">Description</h6>
                                        <p className="text-muted small leading-relaxed">
                                            {product.description || "No description provided."}
                                        </p>
                                    </div>

                                    {/* Specifications Table */}
                                    {product.specifications && Object.keys(product.specifications).length > 0 && (
                                        <div>
                                            <h6 className="fw-bold border-bottom pb-2 mb-2">Specifications</h6>
                                            <table className="table table-borderless table-sm small mb-0">
                                                <tbody>
                                                    {Object.entries(product.specifications).map(([key, value]) => (
                                                        <tr key={key} className="border-bottom border-light">
                                                            <td className="text-secondary w-50 py-2">{key}</td>
                                                            <td className="text-dark fw-bold text-end py-2">{value}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>

                                {/* Footer Action */}
                                <div className="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
                                    <small className="text-muted">Stock: {product.stockQuantity}</small>
                                    {onDelete && (
                                        <button
                                            className="btn btn-outline-danger btn-sm rounded-0 px-3"
                                            onClick={() => {
                                                if (window.confirm(`Delete variant "${product.specifications?.['Frame Colour']}"?`)) {
                                                    onDelete(product.productId);
                                                    onClose();
                                                }
                                            }}
                                        >
                                            Delete Variant
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailsModal;
