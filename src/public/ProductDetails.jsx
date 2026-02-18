import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, getProductVariants } from '../customer/api';
import { Star, Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw, ChevronDown, ChevronUp, Share2 } from 'lucide-react';

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [isZooming, setIsZooming] = useState(false);

    // Accordion State
    const [openSection, setOpenSection] = useState('specs');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductById(id);
                setProduct(data);

                // Fetch Variants if Model No exists
                const modelNo = data.specifications?.['Model No.'] || data.specifications?.['Model No'];

                if (modelNo) {
                    const variantsData = await getProductVariants(modelNo);
                    // Filter out current product from variants list
                    setVariants(variantsData.filter(v => v.productId !== data.productId));
                }
            } catch (error) {
                console.error("Failed to load product", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setZoomPosition({ x, y });
    };

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-white">
            <div className="spinner-border text-dark" role="status" style={{ width: '3rem', height: '3rem' }}></div>
        </div>
    );

    if (!product) return (
        <div className="container py-5 text-center mt-5">
            <h3 className="fw-light">Product not found</h3>
            <button className="btn btn-dark mt-3 px-4 rounded-0" onClick={() => navigate('/marketplace')}>Back to Marketplace</button>
        </div>
    );

    const images = product.images && product.images.length > 0
        ? product.images.map(img => `http://localhost:8080${img}`)
        : ['/eyeglasses.webp'];

    return (
        <div className="container-fluid px-0 bg-white" style={{ marginTop: '105px', minHeight: '100vh' }}>

            {/* Breadcrumb */}
            <div className="border-bottom mb-4">
                <div className="container py-3">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 small text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
                            <li className="breadcrumb-item"><a href="/" className="text-decoration-none text-muted">Home</a></li>
                            <li className="breadcrumb-item"><a href="/marketplace" className="text-decoration-none text-muted">{product.category}</a></li>
                            <li className="breadcrumb-item active text-dark" aria-current="page">{product.name}</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container pb-5">
                <div className="row g-lg-5">

                    {/* LEFT: PREMIUM GALLERY */}
                    {/* LEFT: PREMIUM GALLERY - GRID LAYOUT */}
                    <div className="col-lg-7 mb-5 mb-lg-0 sticky-top" style={{ top: '100px', height: 'fit-content', zIndex: 1 }}>
                        <div className="row g-3">
                            {images.length === 1 ? (
                                // SINGLE IMAGE LAYOUT
                                <div className="col-12">
                                    <div className="bg-white border rounded-4 overflow-hidden position-relative d-flex align-items-center justify-content-center hover-shadow transition-all" style={{ height: '600px' }}>
                                        <img
                                            src={images[0]}
                                            alt={product.name}
                                            className="w-100 h-100 object-fit-contain p-5"
                                        />
                                        {product.stockQuantity < 5 && (
                                            <div className="position-absolute top-0 start-0 m-4">
                                                <span className="badge bg-danger text-uppercase px-3 py-2 fw-normal tracking-wide">Low Stock</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                // MULTI IMAGE GRID
                                images.map((img, idx) => (
                                    <div key={idx} className="col-6">
                                        <div className="bg-white border rounded-4 overflow-hidden position-relative d-flex align-items-center justify-content-center hover-border-dark transition-all" style={{ height: '400px' }}>
                                            <img
                                                src={img}
                                                alt={`${product.name} - View ${idx + 1}`}
                                                className="w-100 h-100 object-fit-contain p-4"
                                            />

                                            {/* Stock Badge (Only on first image) */}
                                            {idx === 0 && product.stockQuantity < 5 && (
                                                <div className="position-absolute top-0 start-0 m-3">
                                                    <span className="badge bg-danger text-uppercase px-3 py-2 fw-normal" style={{ letterSpacing: '1px' }}>Low Stock</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* RIGHT: PRODUCT INFO */}
                    <div className="col-lg-5">
                        <div className="ps-lg-4 d-flex flex-column h-100">

                            {/* Header Info */}
                            <div className="mb-5">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 className="text-secondary text-uppercase fw-bold mb-2" style={{ letterSpacing: '2px', fontSize: '0.75rem' }}>{product.brand || 'OptiSense'}</h6>
                                        <h1 className="fw-bold display-5 text-dark mb-3 lh-sm">{product.name}</h1>

                                        {/* Rating - Clean Row */}
                                        <div className="d-flex align-items-center gap-3 mb-4">
                                            <div className="d-flex align-items-center gap-1 bg-light px-2 py-1 rounded border">
                                                <Star size={14} fill="currentColor" className="text-dark" />
                                                <span className="fw-bold small text-dark">4.8</span>
                                            </div>
                                            <span className="text-muted small">|</span>
                                            <span className="text-secondary small">128 Reviews</span>
                                            <span className="text-muted small">|</span>
                                            <span className="text-success small fw-bold">In Stock</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons (Right Aligned) */}
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-outline-light text-dark border-secondary rounded-circle p-2 hover-bg-dark hover-text-white transition-all d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }} title="Add to Wishlist">
                                            <Heart size={20} />
                                        </button>
                                        <button className="btn btn-outline-light text-dark border-secondary rounded-circle p-2 hover-bg-dark hover-text-white transition-all d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }} title="Share">
                                            <Share2 size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* Price Block - Big & Bold */}
                                <div className="p-3 bg-light bg-opacity-50 rounded-3 border border-light">
                                    <div className="d-flex align-items-baseline gap-2">
                                        <span className="display-6 fw-bold text-dark">₹{product.price?.toLocaleString()}</span>
                                        <span className="text-muted text-decoration-line-through fs-5">₹{Math.round(product.price * 1.4).toLocaleString()}</span>
                                        <span className="text-success fw-bold ms-2">40% OFF</span>
                                    </div>
                                    <p className="text-muted small mb-0 mt-1">Inclusive of all taxes. Free shipping on orders above ₹999.</p>
                                </div>
                            </div>

                            <hr className="text-muted opacity-25 my-4" />

                            {/* Variants Selection */}
                            {variants.length > 0 && (
                                <div className="mb-5">
                                    <label className="d-block text-uppercase text-secondary fw-bold small mb-3" style={{ letterSpacing: '1px' }}>
                                        Color: <span className="text-dark">{product.specifications?.['Frame Colour'] || 'Selected'}</span>
                                    </label>
                                    <div className="d-flex gap-3 flex-wrap">
                                        {/* Current (Active) */}
                                        <div className="border border-2 border-dark rounded p-1" style={{ width: '70px', height: '50px' }}>
                                            <img src={images[0]} className="w-100 h-100 object-fit-contain" alt="Selected" />
                                        </div>

                                        {/* Others */}
                                        {variants.map(variant => (
                                            <div
                                                key={variant.productId}
                                                className="border rounded p-1 cursor-pointer hover-border-dark opacity-75 hover-opacity-100 transition-all"
                                                style={{ width: '70px', height: '50px' }}
                                                onClick={() => navigate(`/product/${variant.productId}`)}
                                                title={variant.name}
                                            >
                                                {variant.images?.[0] ?
                                                    <img src={`http://localhost:8080${variant.images[0]}`} className="w-100 h-100 object-fit-contain" alt={variant.name} />
                                                    : <div className="w-100 h-100 bg-light"></div>
                                                }
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="d-grid gap-3 d-md-flex mb-5">
                                <button className="btn btn-dark btn-lg flex-grow-1 py-3 px-4 rounded-0 text-uppercase fw-bold d-flex align-items-center justify-content-center gap-2 hover-shadow transition-all" style={{ letterSpacing: '1px' }}>
                                    <ShoppingBag size={20} />
                                    Add to Cart
                                </button>
                                <button className="btn btn-outline-dark btn-lg flex-grow-1 py-3 px-4 rounded-0 text-uppercase fw-bold hover-bg-dark hover-text-white transition-all" style={{ letterSpacing: '1px' }}>
                                    Buy Now
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className="row g-0 border rounded-3 overflow-hidden text-center mb-5 bg-light">
                                <div className="col-4 border-end p-3 hover-bg-white transition-all">
                                    <Truck size={24} className="mb-2 text-dark" strokeWidth={1.5} />
                                    <small className="d-block fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Free Delivery</small>
                                </div>
                                <div className="col-4 border-end p-3 hover-bg-white transition-all">
                                    <RefreshCw size={24} className="mb-2 text-dark" strokeWidth={1.5} />
                                    <small className="d-block fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>14 Day Returns</small>
                                </div>
                                <div className="col-4 p-3 hover-bg-white transition-all">
                                    <ShieldCheck size={24} className="mb-2 text-dark" strokeWidth={1.5} />
                                    <small className="d-block fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>1 Year Warranty</small>
                                </div>
                            </div>

                            {/* Custom Accordion (React State) */}
                            <div className="mt-auto border-top">
                                {/* Specs */}
                                <div className="border-bottom">
                                    <button
                                        className="w-100 py-3 bg-transparent border-0 d-flex justify-content-between align-items-center fw-bold text-uppercase text-dark"
                                        onClick={() => toggleSection('specs')}
                                        style={{ letterSpacing: '1px', fontSize: '0.85rem' }}
                                    >
                                        <span>Product Specifications</span>
                                        {openSection === 'specs' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </button>

                                    {openSection === 'specs' && (
                                        <div className="pb-3 text-secondary animate-slide-down">
                                            {product.specifications && Object.keys(product.specifications).length > 0 ? (
                                                <div className="row g-3">
                                                    <div className="col-6 mb-2 pb-2 border-bottom">
                                                        <small className="d-block text-secondary text-uppercase mb-1" style={{ fontSize: '0.7rem' }}>Model Number</small>
                                                        <span className="fw-bold text-dark">OP-{product.productId}</span>
                                                    </div>
                                                    {Object.entries(product.specifications).map(([key, value]) => (
                                                        <div key={key} className="col-6 mb-2 pb-2 border-bottom">
                                                            <small className="d-block text-secondary text-uppercase mb-1" style={{ fontSize: '0.7rem' }}>{key}</small>
                                                            <span className="fw-bold text-dark">{value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-muted small">No specific technical details available.</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="border-bottom">
                                    <button
                                        className="w-100 py-3 bg-transparent border-0 d-flex justify-content-between align-items-center fw-bold text-uppercase text-dark"
                                        onClick={() => toggleSection('desc')}
                                        style={{ letterSpacing: '1px', fontSize: '0.85rem' }}
                                    >
                                        <span>Description</span>
                                        {openSection === 'desc' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </button>

                                    {openSection === 'desc' && (
                                        <div className="pb-3 text-secondary lh-lg animate-slide-down" style={{ fontSize: '0.95rem' }}>
                                            {product.description || "No description available for this product."}
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <style>
                {`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hover-scale:hover {
                    transform: scale(1.1);
                }
                .hover-shadow:hover {
                    box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
                }
                .hover-bg-dark:hover {
                    background-color: #212529;
                }
                .hover-text-white:hover {
                    color: #fff;
                }
                .hover-opacity-100:hover {
                    opacity: 1 !important;
                }
                .hover-bg-white:hover {
                    background-color: #fff !important;
                }
                .cursor-pointer {
                    cursor: pointer;
                }
                .transition-all {
                    transition: all 0.3s ease;
                }
                .animate-slide-down {
                    animation: slideDown 0.3s ease-out;
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                `}
            </style>
        </div>
    );
}

export default ProductDetails;
