import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getAllProducts } from '../customer/api';
import FilterSidebar from './components/filters/FilterSidebar';

const CATEGORIES = ['Eyeglasses', 'Sunglasses', 'Contact Lenses'];
const BRANDS = ['RayBan', 'Oakley', 'Gucci', 'Persol'];

function Marketplace() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    const [filters, setFilters] = useState({
        categories: searchParams.get('category') && CATEGORIES.includes(decodeURIComponent(searchParams.get('category')))
            ? [decodeURIComponent(searchParams.get('category'))]
            : [],
        brands: [],
        frameTypes: [],
        minPrice: '',
        maxPrice: '',
        frameMaterial: [],
        frameSize: [],
        frameShape: [],
        Gender: [],
        search: searchParams.get('search') || '' // Init from URL
    });

    // Listen for URL changes (Navbar Search and Category Trigger)
    useEffect(() => {
        const searchQuery = searchParams.get('search') || '';
        const categoryQuery = searchParams.get('category');

        let newFilters = { ...filters };
        let hasChanges = false;

        if (searchQuery !== filters.search) {
            setSearchTerm(searchQuery);
            newFilters.search = searchQuery;
            hasChanges = true;
        }

        if (categoryQuery) {
            const categoryDecoded = decodeURIComponent(categoryQuery);
            // Ensure it's a valid category
            if (CATEGORIES.includes(categoryDecoded)) {
                // Check if we need to update (if not currently JUST this category)
                const isSame = filters.categories.length === 1 && filters.categories[0] === categoryDecoded;
                if (!isSame) {
                    newFilters.categories = [categoryDecoded];
                    hasChanges = true;
                }
            }
        }

        if (hasChanges) {
            setFilters(newFilters);
        }
    }, [searchParams]);

    // Observer for "Load More" trigger
    const observer = useRef();
    const lastProductRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    // Reset when filters change
    useEffect(() => {
        setProducts([]);
        setPage(0);
        setHasMore(true);
    }, [filters]);

    // Handle Search Submit
    const handleSearch = (e) => {
        e.preventDefault();
        setFilters(prev => ({ ...prev, search: searchTerm }));
    };

    // Fetch Products
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Formatting for Backend Enums (UPPERCASE)
                const formattedCategories = filters.categories.map(c =>
                    c.toUpperCase().replace(' ', '_')
                );

                const params = {
                    ...(formattedCategories.length > 0 && { categories: formattedCategories }),
                    ...(filters.brands.length > 0 && { brands: filters.brands }),
                    ...(filters.frameTypes?.length > 0 && { frameType: filters.frameTypes }),
                    ...(filters.colors?.length > 0 && { frameColour: filters.colors }),
                    ...(filters.minPrice && { minPrice: filters.minPrice }),
                    ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
                    ...(filters.frameMaterial?.length > 0 && { frameMaterial: filters.frameMaterial }),
                    ...(filters.frameSize?.length > 0 && { frameSize: filters.frameSize }),
                    ...(filters.frameShape?.length > 0 && { frameShape: filters.frameShape }),
                    ...(filters.Gender?.length > 0 && { Gender: filters.Gender }),
                    ...(filters.search && { search: filters.search }),
                    page: page,
                    size: 12
                };

                console.log("Fetching products with params:", params);

                const data = await getAllProducts(params);
                setProducts(prev => {
                    if (page === 0) return data.content || [];
                    return [...prev, ...(data.content || [])];
                });

                setHasMore(!(data.last));
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [page, filters]);

    // Layout Constants
    const NAVBAR_HEIGHT = '105px';

    return (
        <div className="container-fluid p-0" style={{ backgroundColor: '#f9f9f9', marginTop: NAVBAR_HEIGHT, height: `calc(100vh - ${NAVBAR_HEIGHT})`, overflow: 'hidden' }}>

            <div className="row g-0 h-100">
                {/* Sidebar - Independent Scroll */}
                <div className="col-md-3 col-lg-2 bg-white border-end d-none d-md-block h-100" style={{ overflowY: 'auto' }}>
                    <FilterSidebar
                        filters={filters} setFilters={setFilters}
                        categories={CATEGORIES} brands={BRANDS}
                    />
                </div>

                {/* Product Grid - Independent Scroll */}
                <div className="col-md-9 col-lg-10 p-4 h-100" style={{ overflowY: 'auto' }}>

                    {/* Results Header */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <span className="text-secondary small text-uppercase fw-bold">Showing {products.length} results</span>
                        {/* Sort Dropdown could go here */}
                    </div>

                    <div className="row g-4">
                        {products.map((product, index) => {
                            const isLast = products.length === index + 1;
                            return (
                                <div
                                    key={product.productId}
                                    ref={isLast ? lastProductRef : null}
                                    className="col-6 col-md-4 col-lg-3" // Responsive Grid
                                >
                                    <div className="card h-100 border-0 shadow-sm product-card"
                                        style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
                                        onClick={() => navigate(`/product/${product.productId}`)}
                                    >
                                        {/* Wishlist Icon */}
                                        <div className="position-absolute top-0 end-0 p-2 z-1">
                                            <button className="btn btn-light rounded-circle btn-sm shadow-sm">🖤</button>
                                        </div>

                                        {/* Image Area */}
                                        <div className="card-img-top bg-white d-flex align-items-center justify-content-center overflow-hidden position-relative" style={{ height: '240px' }}>
                                            {product.images?.[0] ?
                                                <img
                                                    src={`http://localhost:8080${product.images[0]}`}
                                                    className="img-fluid p-4"
                                                    style={{ transition: 'transform 0.5s ease', objectFit: 'contain', maxHeight: '100%' }}
                                                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1.0)'}
                                                    alt={product.name}
                                                    loading="lazy"
                                                    decoding="async"
                                                /> :
                                                <span className="text-muted small">No Image</span>
                                            }
                                        </div>

                                        {/* Details */}
                                        <div className="card-body p-3">
                                            {/* Brand & Name */}
                                            <small className="text-uppercase text-muted fw-bold" style={{ fontSize: '0.7rem' }}>{product.brand || 'Generic'}</small>
                                            <h6 className="card-title text-truncate fw-bold text-dark mb-1" title={product.name}>{product.name}</h6>

                                            {/* Stock Status */}
                                            <div className="mb-2">
                                                {product.stockQuantity < 5 ? (
                                                    <span className="badge bg-danger bg-opacity-10 text-danger border border-danger p-1" style={{ fontSize: '0.65rem' }}>Only {product.stockQuantity} Left!</span>
                                                ) : (
                                                    <span className="badge bg-success bg-opacity-10 text-success border border-success p-1" style={{ fontSize: '0.65rem' }}>In Stock</span>
                                                )}
                                            </div>

                                            {/* Price & Add */}
                                            <div className="d-flex justify-content-between align-items-center mt-3">
                                                <span className="text-dark fw-bold fs-5">₹{product.price}</span>
                                                <button className="btn btn-outline-primary btn-sm rounded-1 px-3">Add +</button>
                                            </div>

                                            {/* Dynamic Delivery */}
                                            <div className="mt-2 pt-2 border-top">
                                                <small className="text-success fw-bold d-flex align-items-center" style={{ fontSize: '0.75rem' }}>
                                                    <span className="me-1">🚚</span>
                                                    Get it by {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {loading && (
                        <div className="py-5 text-center">
                            <div className="spinner-border text-primary" role="status"></div>
                        </div>
                    )}

                    {!loading && !hasMore && products.length > 0 && (
                        <div className="py-5 text-center text-muted border-top mt-5">
                            <small>That's all folks! You've seen it all.</small>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Marketplace;