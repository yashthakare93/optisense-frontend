import React, { useState } from 'react';
import { addProduct, updateProduct } from '../api';

const FRAME_TYPES = ['Full Rim', 'Half Rim', 'Rimless'];
const FRAME_COLORS = ['Black', 'Crystal', 'Blue', 'Navy Blue', 'Sky Blue', 'Red', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Brown', 'Gray', 'White', 'Multicolor'];
const FRAME_MATERIAL = ["Acetate", "TR90", "Stainless Steel", "Titanium", "Ultem", "Mixed Material", "Non-Metal", "Other"];
const GENDER = ['Men', 'Women', 'Unisex', 'Kids'];
const FRAME_SIZE = ['Extra Narrow', 'Narrow', 'Medium', 'Wide', 'Extra Wide'];
const FRAME_SHAPE = ['Rectangle', 'Round', 'Square', 'Aviator', 'Cat Eyes', 'Wayfarer'];

const PREMIUM_CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
    
    .modal-configurator {
        font-family: 'Outfit', sans-serif;
        background: #f8fafc;
        color: #1e293b;
        padding-top: 50px;
    }

    .glass-card {
        background: #ffffff;
        border: 1px solid rgba(0, 0, 0, 0.05);
        border-radius: 24px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
        transition: all 0.4s ease;
    }

    .premium-input {
        background: #ffffff !important;
        border: 1px solid #e2e8f0 !important;
        color: #1e293b !important;
        padding: 12px 20px;
        border-radius: 12px;
    }

    .premium-input:focus {
        background: #ffffff !important;
        border-color: #3b82f6 !important;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1) !important;
        outline: none;
    }

    .publish-btn {
        background: #0f172a;
        color: #ffffff;
        border: none;
        padding: 16px;
        border-radius: 14px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 2px;
        transition: all 0.3s ease;
    }

    .publish-btn:hover {
        background: #1e293b;
        transform: translateY(-2px);
    }
`;

function AddProductModal({ show, onClose, onProductAdded, shopId, initialData, initialGroup }) {
    const defaultCommonState = {
        name: '',
        brand: '',
        description: '',
        price: '',
        discount: 0,
        category: 'EYEGLASSES',
        specifications: {}
    };

    const defaultVariantState = {
        id: Date.now(),
        name: '',
        color: '',
        modelNo: '',
        stock: '',
        images: [],
        specifications: {},
        existingId: null
    };

    const [commonData, setCommonData] = useState(defaultCommonState);
    const [variants, setVariants] = useState([defaultVariantState]);
    const [loading, setLoading] = useState(false);
    const [expandedVariants, setExpandedVariants] = useState(new Set());
    const [currentStep, setCurrentStep] = useState(1);
    const [activePreviewVariantId, setActivePreviewVariantId] = useState(defaultVariantState.id);

    // Load initial data (Cloning or Editing)
    React.useEffect(() => {
        if (!show) return;

        if (initialGroup && initialGroup.length > 0) {
            // MANAGE EXISTING GROUP
            const mainProduct = initialGroup[0];
            const { productId, name, images, stockQuantity, specifications, ...rest } = mainProduct;
            const { 'Frame Colour': _, 'Model No.': __, ...restSpecs } = specifications || {};

            setCommonData({
                brand: mainProduct.brand,
                description: mainProduct.description,
                price: mainProduct.price !== undefined && mainProduct.price !== null ? mainProduct.price : '',
                category: mainProduct.category || 'EYEGLASSES',
                specifications: restSpecs
            });

            const existingVariants = initialGroup.map(p => ({
                id: Date.now() + Math.random(),
                existingId: p.productId,
                name: p.name,
                color: p.specifications?.['Frame Colour'] || '',
                modelNo: p.specifications?.['Model No.'] || '',
                stock: p.stockQuantity,
                images: [],
                existingImages: p.images,
                specifications: p.specifications || {}
            }));

            setVariants(existingVariants);

        } else if (initialData) {
            // CLONE OLD LOGIC (Fallback)
            const { productId, name, images, stockQuantity, specifications, ...rest } = initialData;
            const { 'Frame Colour': _, ...restSpecs } = specifications || {};

            setCommonData({
                brand: initialData.brand,
                description: initialData.description,
                price: initialData.price !== undefined && initialData.price !== null ? initialData.price : '',
                category: initialData.category || 'EYEGLASSES',
                specifications: restSpecs
            });
            setVariants([{ ...defaultVariantState, name: name || '' }]);
        } else {
            // FRESH ADD
            setCommonData(defaultCommonState);
            setVariants([defaultVariantState]);
        }
    }, [show, initialData, initialGroup]);

    if (!show) return null;

    // --- Handlers ---

    const handleCommonChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === 'discount') {
            newValue = Math.min(100, Math.max(0, parseInt(value) || 0));
        }

        if (name === 'category') {
            setCommonData({
                ...commonData,
                [name]: newValue,
                specifications: {}
            });
        } else {
            setCommonData({ ...commonData, [name]: newValue });
        }
    };

    const handleSpecChange = (e) => {
        const { name, value } = e.target;
        setCommonData({
            ...commonData,
            specifications: { ...commonData.specifications, [name]: value }
        });
    };

    const addVariant = () => {
        const newId = Date.now();
        setVariants([...variants, { ...defaultVariantState, id: newId, name: commonData.name || '' }]);
        setExpandedVariants(prev => new Set([...prev, newId]));
    };

    const removeVariant = (id) => {
        if (variants.length > 1) {
            setVariants(variants.filter(v => v.id !== id));
        }
    };

    const handleVariantChange = (id, field, value) => {
        setVariants(variants.map(v => v.id === id ? { ...v, [field]: value } : v));
    };

    const handleVariantFileChange = (id, files) => {
        setVariants(variants.map(v => v.id === id ? { ...v, images: Array.from(files) } : v));
    };

    const handleVariantSpecChange = (id, specKey, specValue) => {
        setVariants(variants.map(v =>
            v.id === id
                ? { ...v, specifications: { ...v.specifications, [specKey]: specValue } }
                : v
        ));
    };

    const toggleVariantExpand = (id) => {
        const newExpanded = new Set(expandedVariants);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedVariants(newExpanded);
    };

    // --- Submit ---

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            for (let i = 0; i < variants.length; i++) {
                const variant = variants[i];

                const productPayload = {
                    ...commonData,
                    name: variant.name || commonData.name,
                    shopId: shopId,
                    price: parseFloat(commonData.price),
                    discount: parseInt(commonData.discount || 0),
                    stockQuantity: parseInt(variant.stock || 0),
                    specifications: {
                        ...commonData.specifications, // Preserve Base Model etc.
                        ...variant.specifications,
                        'Frame Colour': variant.color,
                        'Model No.': variant.modelNo
                    }
                };

                if (variant.existingId) {
                    await updateProduct(variant.existingId, productPayload);
                } else {
                    const data = new FormData();
                    const jsonBlob = new Blob([JSON.stringify(productPayload)], { type: 'application/json' });
                    data.append('product', jsonBlob);
                    variant.images.forEach((file) => data.append('images', file));
                    await addProduct(data);
                }
            }

            onProductAdded();
            onClose();
        } catch (error) {
            console.error("Failed to save products", error);
            alert("Failed to save. Please check inputs.");
        } finally {
            setLoading(false);
        }
    };

    const FRAME_TYPES = ['Full Rim', 'Half Rim', 'Rimless'];
    const FRAME_COLORS = ['Black', 'Crystal', 'Blue', 'Navy Blue', 'Sky Blue', 'Red', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Brown', 'Gray', 'White', 'Multicolor'];
    const FRAME_MATERIAL = ["Acetate", "TR90", "Stainless Steel", "Titanium", "Ultem", "Mixed Material", "Non-Metal", "Other"];
    const GENDER = ['Men', 'Women', 'Unisex', 'Kids'];
    const FRAME_SIZE = ['Extra Narrow', 'Narrow', 'Medium', 'Wide', 'Extra Wide'];
    const FRAME_SHAPE = ['Rectangle', 'Round', 'Square', 'Aviator', 'Cat Eyes', 'Wayfarer'];

    const renderCommonSpecs = () => {
        return (
            <div className="row g-4 mt-2">
                <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold text-uppercase">Base Model ID</label>
                    <input
                        type="text"
                        className="form-control premium-input"
                        name="Base Model"
                        value={commonData.specifications['Base Model'] || ''}
                        onChange={handleSpecChange}
                        placeholder="e.g. VC E11797"
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold text-uppercase">Gender</label>
                    <select
                        className="form-select premium-input"
                        name="Gender"
                        onChange={handleSpecChange}
                        value={commonData.specifications['Gender'] || ''}
                    >
                        <option value="">Select Gender</option>
                        {GENDER.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>
            </div>
        );
    };

    // Get available spec options based on category
    const getAvailableSpecOptions = (category) => {
        switch (category) {
            case 'EYEGLASSES':
            case 'SUNGLASSES':
            case 'COMPUTER_GLASSES':
                return ['Frame Width', 'Dimensions', 'Weight', 'Frame Shape', 'Frame Type', 'Frame Size', 'Frame Material', 'Temple Length', 'Collection', 'Warranty'];
            case 'CONTACT_LENSES':
                return ['Water Content', 'Material', 'Base Curve', 'Diameter', 'Usage Duration', 'Pack Size'];
            case 'ACCESSORIES':
            case 'SOLUTIONS':
                return ['Type', 'Material', 'Volume', 'Warranty'];
            default:
                return [];
        }
    };

    const addSpecToVariant = (variantId, specName) => {
        if (!specName) return;

        const updatedVariants = variants.map(v => {
            if (v.id === variantId) {
                if (!v.specifications[specName]) {
                    return { ...v, specifications: { ...v.specifications, [specName]: '' } };
                }
            }
            return v;
        });
        setVariants(updatedVariants);
    };

    const removeSpecFromVariant = (variantId, specName) => {
        const updatedVariants = variants.map(v => {
            if (v.id === variantId) {
                const newSpecs = { ...v.specifications };
                delete newSpecs[specName];
                return { ...v, specifications: newSpecs };
            }
            return v;
        });
        setVariants(updatedVariants);
    };

    const renderVariantSpecs = (variant) => {
        const category = commonData.category;
        const specKeys = getAvailableSpecOptions(category);

        const handleSpecUpdate = (key, val) => {
            const newSpecs = { ...variant.specifications, [key]: val };
            handleVariantChange(variant.id, 'specifications', newSpecs);
        };

        const renderField = (key) => {
            const val = variant.specifications[key] || '';

            if (key === 'Frame Type') {
                return (
                    <select className="form-select premium-input" value={val} onChange={(e) => handleSpecUpdate(key, e.target.value)}>
                        <option value="">Select</option>
                        {FRAME_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                );
            }
            if (key === 'Frame Shape') {
                return (
                    <select className="form-select premium-input" value={val} onChange={(e) => handleSpecUpdate(key, e.target.value)}>
                        <option value="">Select</option>
                        {FRAME_SHAPE.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                );
            }
            if (key === 'Frame Size') {
                return (
                    <select className="form-select premium-input" value={val} onChange={(e) => handleSpecUpdate(key, e.target.value)}>
                        <option value="">Select</option>
                        {FRAME_SIZE.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                );
            }
            if (key === 'Frame Material' || (category === 'ACCESSORIES' && key === 'Material')) {
                return (
                    <select className="form-select premium-input" value={val} onChange={(e) => handleSpecUpdate(key, e.target.value)}>
                        <option value="">Select</option>
                        {FRAME_MATERIAL.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                );
            }
            if (key === 'Usage Duration') {
                return (
                    <select className="form-select premium-input" value={val} onChange={(e) => handleSpecUpdate(key, e.target.value)}>
                        <option value="">Select</option>
                        {['Daily', 'Monthly', 'Yearly', 'Bi-Weekly'].map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                );
            }
            if (key === 'Gender') {
                return (
                    <select className="form-select premium-input" value={val} onChange={(e) => handleSpecUpdate(key, e.target.value)}>
                        <option value="">Select</option>
                        {GENDER.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                );
            }

            return (
                <input
                    type="text"
                    className="form-control premium-input"
                    value={val}
                    onChange={(e) => handleSpecUpdate(key, e.target.value)}
                    placeholder={key === 'Dimensions' ? '54-18-142' : `Enter ${key}`}
                />
            );
        };

        return (
            <div className="p-0">
                <div className="row g-3">
                    {specKeys.map(key => (
                        <div key={key} className="col-md-6">
                            <label className="form-label text-muted small fw-bold text-uppercase">{key}</label>
                            {renderField(key)}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const calculateFinalPrice = () => {
        if (commonData.price && !isNaN(commonData.price)) {
            return Math.round(commonData.price * (1 - (commonData.discount || 0) / 100));
        }
        return 0;
    };

    const activePreviewVariant = variants.find(v => v.id === activePreviewVariantId) || variants[0];

    return (
        <div className="modal d-block modal-configurator" style={{ backgroundColor: 'rgba(0,0,0,0.5)', overflowY: 'auto' }}>
            <style dangerouslySetInnerHTML={{ __html: PREMIUM_CSS }} />
            <div className="modal-dialog modal-xl" style={{ margin: '2rem auto', maxWidth: '1400px' }}>
                <div className="modal-content bg-transparent border-0">
                    {/* Header */}
                    <div className="glass-card p-4 p-lg-5 mb-4 d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="gradient-text fw-bold mb-1">
                                {initialGroup ? 'Refine Collection' : 'New Configuration'}
                            </h2>
                            <p className="text-muted mb-0 small">Mastering the art of optical design</p>
                        </div>
                        <button type="button" className="btn btn-link text-muted p-0" onClick={onClose}>
                            <i className="bi bi-x-lg fs-3"></i>
                        </button>
                    </div>

                    <div className="row g-4">
                        {/* Form Section */}
                        <div className="col-lg-7">
                            <form onSubmit={handleSubmit}>
                                <div className="glass-card p-4 p-lg-5 mb-4">
                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <div className="rounded-circle bg-light text-primary d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                            <i className="bi bi-info-circle fs-5"></i>
                                        </div>
                                        <h5 className="mb-0 fw-bold">Primary Specs</h5>
                                    </div>

                                    <div className="row g-4 mb-5">
                                        <div className="col-12">
                                            <label className="form-label text-muted small fw-bold text-uppercase">Product Name <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                className="form-control premium-input"
                                                name="name"
                                                value={commonData.name}
                                                onChange={handleCommonChange}
                                                placeholder="e.g. Ray-Ban Wayfarer Classic"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted small fw-bold text-uppercase">Category</label>
                                            <select className="form-select premium-input" name="category" value={commonData.category} onChange={handleCommonChange}>
                                                <option value="EYEGLASSES">Eyeglasses</option>
                                                <option value="SUNGLASSES">Sunglasses</option>
                                                <option value="CONTACT_LENSES">Contact Lenses</option>
                                                <option value="COMPUTER_GLASSES">Computer Glasses</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted small fw-bold text-uppercase">Brand</label>
                                            <input type="text" className="form-control premium-input" name="brand" value={commonData.brand} onChange={handleCommonChange} placeholder="e.g. Ray-Ban" />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted small fw-bold text-uppercase">Price (₹)</label>
                                            <input type="number" className="form-control premium-input" name="price" value={commonData.price} onChange={handleCommonChange} placeholder="0" />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted small fw-bold text-uppercase">Discount (%)</label>
                                            <input type="number" className="form-control premium-input" name="discount" value={commonData.discount} onChange={handleCommonChange} placeholder="0" />
                                        </div>
                                    </div>

                                    {renderCommonSpecs()}
                                </div>

                                {/* Variants Section */}
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3 px-2">
                                        <h5 className="mb-0 fw-bold text-dark">Color Variants</h5>
                                        <button type="button" className="btn btn-sm btn-outline-primary rounded-pill px-3" onClick={addVariant}>
                                            <i className="bi bi-plus-lg me-2"></i>New Variant
                                        </button>
                                    </div>

                                    {variants.map((v, idx) => (
                                        <div key={v.id} className="glass-card p-4 mb-3">
                                            <div className="d-flex justify-content-between align-items-center cursor-pointer" onClick={() => toggleVariantExpand(v.id)}>
                                                <div className="d-flex align-items-center gap-3" onClick={(e) => { e.stopPropagation(); setActivePreviewVariantId(v.id); }}>
                                                    <div className={`rounded-circle ${activePreviewVariantId === v.id ? 'bg-primary text-white' : 'bg-light text-muted'} p-1 d-flex align-items-center justify-content-center`} style={{ width: '28px', height: '28px' }}>
                                                        {activePreviewVariantId === v.id && <i className="bi bi-eye-fill fs-6"></i>}
                                                    </div>
                                                    <span className="fw-bold">{v.name || `Variant ${idx + 1}`}</span>
                                                </div>
                                                <div className="d-flex gap-2">
                                                    <button type="button" className="btn btn-link text-danger p-0 me-3" onClick={(e) => { e.stopPropagation(); removeVariant(v.id); }}>
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                    <i className={`bi bi-chevron-${expandedVariants.has(v.id) ? 'up' : 'down'} text-muted`}></i>
                                                </div>
                                            </div>

                                            {expandedVariants.has(v.id) && (
                                                <div className="animate__animated animate__fadeIn">
                                                    <div className="row g-3 mb-4">
                                                        <div className="col-md-4">
                                                            <label className="form-label text-muted small fw-bold">Display Name</label>
                                                            <input type="text" className="form-control premium-input" value={v.name} onChange={(e) => handleVariantChange(v.id, 'name', e.target.value)} placeholder="e.g. Classic Black" />
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label className="form-label text-muted small fw-bold">Model Number</label>
                                                            <input type="text" className="form-control premium-input" value={v.modelNo} onChange={(e) => handleVariantChange(v.id, 'modelNo', e.target.value)} placeholder="e.g. VC E11797-C1" />
                                                        </div>
                                                        <div className="col-md-2">
                                                            <label className="form-label text-muted small fw-bold">Color</label>
                                                            <input type="text" className="form-control premium-input" value={v.color} onChange={(e) => handleVariantChange(v.id, 'color', e.target.value)} placeholder="Black" />
                                                        </div>
                                                        <div className="col-md-2">
                                                            <label className="form-label text-muted small fw-bold">Stock</label>
                                                            <input type="number" className="form-control premium-input" value={v.stock} onChange={(e) => handleVariantChange(v.id, 'stock', e.target.value)} placeholder="0" />
                                                        </div>
                                                        <div className="col-12">
                                                            <label className="form-label text-muted small fw-bold">Variant Images</label>
                                                            <input type="file" className="form-control premium-input" multiple onChange={(e) => handleVariantFileChange(v.id, e.target.files)} />
                                                        </div>
                                                    </div>
                                                    <div className="border-top border-secondary border-opacity-25 pt-4">
                                                        <h6 className="text-muted small fw-bold text-uppercase mb-3">Technical Specifications</h6>
                                                        {renderVariantSpecs(v)}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <button type="submit" className="publish-btn w-100 shadow" disabled={loading}>
                                    {loading ? 'Processing...' : (initialGroup ? 'Update Configuration' : 'Deploy Configuration')}
                                </button>
                            </form>
                        </div>

                        {/* Preview Section */}
                        <div className="col-lg-5 d-none d-lg-block">
                            <div className="glass-card p-5 h-100 d-flex flex-column align-items-center justify-content-center text-center border-2 border-primary border-opacity-10">
                                <div className="badge rounded-pill bg-primary bg-opacity-10 text-primary px-3 py-2 mb-5">LIVE PREVIEW</div>

                                <div className="mb-5">
                                    <i className="bi bi-box-seam text-primary" style={{ fontSize: '10rem', filter: 'drop-shadow(0 0 30px rgba(59, 130, 246, 0.2))' }}></i>
                                </div>

                                <div className="w-100">
                                    <h2 className="fw-bold mb-1 text-dark">{commonData.brand || 'BRAND'}</h2>
                                    <h5 className="text-muted mb-4">{activePreviewVariant.name || 'VARIANT'}</h5>

                                    <div className="d-flex justify-content-center align-items-baseline gap-3 mb-5">
                                        <span className="display-6 fw-bold text-dark">₹{Math.round(commonData.price * (1 - (commonData.discount || 0) / 100)) || '0'}</span>
                                        {commonData.discount > 0 && <span className="text-muted text-decoration-line-through">₹{commonData.price}</span>}
                                    </div>

                                    <div className="row g-3 text-start mb-5">
                                        <div className="col-6">
                                            <div className="p-3 rounded-4 bg-light border border-secondary border-opacity-10">
                                                <small className="text-muted d-block text-uppercase">Category</small>
                                                <span className="fw-bold text-dark">{commonData.category}</span>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="p-3 rounded-4 bg-light border border-secondary border-opacity-10">
                                                <small className="text-muted d-block text-uppercase">Inventory</small>
                                                <span className="fw-bold text-dark">{activePreviewVariant.stock || 0} Units</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddProductModal;