import React, { useState } from 'react';
import { updateShop } from '../api';

function SettingsTab({ shop, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    // Using default values from shop object safely
    const [formData, setFormData] = useState({
        shopName: shop.shopName || '',
        businessType: shop.businessType || '', // Ensure this maps to backend field
        description: shop.description || shop.shopDescription || '',
        phone: shop.phone || '',
        email: shop.email || '',
        shopAddress: shop.shopAddress || '',
        city: shop.city || '',
        state: shop.state || '',
        pinCode: shop.pinCode || '',
        country: shop.country || '',
        // Removed shopCategory as it doesn't exist in backend
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const updated = await updateShop(shop.shopId, {
                ...formData,
                shopDescription: formData.description
            });

            alert('✅ Shop details updated successfully! Your application has been resubmitted for approval.');

            if (onUpdate) onUpdate(updated);
            setIsEditing(false);
        } catch (err) {
            console.error("Update failed", err);
            alert('❌ Failed to update shop: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    // --- VIEW MODE ---
    if (!isEditing) {
        return (
            <div className="container px-0">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold text-dark mb-0">Shop Profile</h5>
                    <button className="btn btn-sm btn-outline-secondary px-3" onClick={() => setIsEditing(true)}>Edit Details</button>
                </div>

                <div className="card shadow-sm border-0">
                    <div className="card-body p-4">
                        <div className="row g-4">
                            {/* Left Column: Basic & Legal */}
                            <div className="col-md-6 border-end">
                                <h6 className="text-uppercase text-muted fw-bold small mb-3">General Information</h6>
                                <InfoField label="Shop Name" value={shop.shopName} />
                                <InfoField label="Business Type" value={shop.businessType} />
                                <InfoField label="Description" value={shop.description || shop.shopDescription} />

                                <h6 className="text-uppercase text-muted fw-bold small mb-3 mt-4">Legal Identities</h6>
                                <div className="row g-2">
                                    <div className="col-12"><InfoField label="GSTIN" value={shop.gstNumber} /></div>
                                    <div className="col-6"><InfoField label="PAN" value={shop.panNumber} /></div>
                                    <div className="col-6"><InfoField label="Aadhaar" value={shop.aadhaarNumber} /></div>
                                </div>
                            </div>

                            {/* Right Column: Contact */}
                            <div className="col-md-6 ps-md-4">
                                <h6 className="text-uppercase text-muted fw-bold small mb-3">Contact Details</h6>
                                <InfoField label="Phone" value={shop.phone} />
                                <InfoField label="Email" value={shop.email} />

                                <h6 className="text-uppercase text-muted fw-bold small mb-3 mt-4">Registered Address</h6>
                                <InfoField label="Address" value={shop.shopAddress} />
                                <div className="row g-2">
                                    <div className="col-6"><InfoField label="City" value={shop.city} /></div>
                                    <div className="col-6"><InfoField label="State" value={shop.state} /></div>
                                    <div className="col-6"><InfoField label="Pin Code" value={shop.pinCode} /></div>
                                    <div className="col-6"><InfoField label="Country" value={shop.country} /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- EDIT MODE ---
    return (
        <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
                <div className="d-flex justify-content-between mb-4">
                    <h5 className="fw-bold">Edit Details</h5>
                    <button className="btn btn-sm btn-light" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label small text-muted">Shop Name</label>
                            <input type="text" name="shopName" value={formData.shopName} onChange={handleChange} className="form-control form-control-sm" required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small text-muted">Business Type</label>
                            <select name="businessType" value={formData.businessType} onChange={handleChange} className="form-select form-select-sm">
                                <option value="">Select Type</option>
                                <option value="RETAIL">Retail</option>
                                <option value="WHOLESALE">Wholesale</option>
                                <option value="MANUFACTURING">Manufacturing</option>
                                <option value="SERVICE">Service</option>
                            </select>
                        </div>
                        <div className="col-12">
                            <label className="form-label small text-muted">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} className="form-control form-control-sm" rows="2"></textarea>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label small text-muted">Phone</label>
                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="form-control form-control-sm" />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small text-muted">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control form-control-sm" />
                        </div>

                        <div className="col-12">
                            <label className="form-label small text-muted">Address</label>
                            <input type="text" name="shopAddress" value={formData.shopAddress} onChange={handleChange} className="form-control form-control-sm" />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small text-muted">City</label>
                            <input type="text" name="city" value={formData.city} onChange={handleChange} className="form-control form-control-sm" />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small text-muted">State</label>
                            <input type="text" name="state" value={formData.state} onChange={handleChange} className="form-control form-control-sm" />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small text-muted">Pin Code</label>
                            <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} className="form-control form-control-sm" />
                        </div>

                        {/* LEGAL INFO SECTION */}
                        <div className="col-12 mt-3">
                            <h6 className="small text-muted fw-bold text-uppercase border-bottom pb-2">Legal Information</h6>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small text-muted">GST Number</label>
                            <input type="text" name="gstNumber" value={formData.gstNumber || ''} onChange={handleChange} className="form-control form-control-sm" maxLength="15" />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small text-muted">PAN Number</label>
                            <input type="text" name="panNumber" value={formData.panNumber || ''} onChange={handleChange} className="form-control form-control-sm" maxLength="10" />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small text-muted">Aadhaar Number</label>
                            <input type="text" name="aadhaarNumber" value={formData.aadhaarNumber || ''} onChange={handleChange} className="form-control form-control-sm" maxLength="12" />
                        </div>
                    </div>
                    <div className="mt-4 text-end">
                        <button type="submit" className="btn btn-dark btn-sm px-4" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Updates'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function InfoField({ label, value }) {
    // Ensuring value is treated as string to avoid rendering issues
    const displayValue = value && String(value).trim() !== '' ? value : '-';
    return (
        <div className="mb-2">
            <span className="text-secondary small d-block" style={{ fontSize: '0.75rem' }}>{label}</span>
            <span className="fw-medium text-dark">{displayValue}</span>
        </div>
    );
}

export default SettingsTab;
