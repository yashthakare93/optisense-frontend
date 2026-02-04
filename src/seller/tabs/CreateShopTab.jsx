import React, { useState } from 'react';
import { createShop } from '../api';

function CreateShopTab({ onShopCreated }) {
    const [formData, setFormData] = useState({
        shopName: '',
        businessType: '',
        description: '',
        phone: '',
        email: '',
        shopAddress: '',
        city: '',
        state: '',
        pinCode: '',
        country: '',
        gstNumber: '',
        panNumber: '',
        aadhaarNumber: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await createShop(formData);
            setSuccess('Shop created successfully!');
            // Notify parent to refresh dashboard
            if (onShopCreated) {
                // Short delay to let user see success message
                setTimeout(() => onShopCreated(response.data), 1500);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create shop.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4">
            <div className="card shadow-sm border-0 mx-auto" style={{ maxWidth: '800px' }}>
                <div className="card-body p-5">
                    <h2 className="card-title fw-bold mb-4 text-center">🚀 Register Your Shop</h2>

                    {loading && <div className="alert alert-info">Submitting application...</div>}
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    <form onSubmit={handleSubmit}>
                        {/* --- BASIC DETAILS --- */}
                        <h5 className="mb-3 text-primary fw-bold">1. Must Know Details</h5>
                        <div className="row g-3 mb-4">
                            <div className="col-md-6">
                                <label className="form-label">Shop Name <span className="text-danger">*</span></label>
                                <input type="text" name="shopName" value={formData.shopName} onChange={handleChange} className="form-control" required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Business Type <span className="text-muted">(Optional)</span></label>
                                <select name="businessType" value={formData.businessType} onChange={handleChange} className="form-select">
                                    <option value="">Select Type...</option>
                                    <option value="RETAIL">Retail</option>
                                    <option value="WHOLESALE">Wholesale</option>
                                    <option value="MANUFACTURING">Manufacturing</option>
                                    <option value="SERVICE">Service</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                            <div className="col-12">
                                <label className="form-label">Description <span className="text-danger">*</span></label>
                                <textarea name="description" value={formData.description} onChange={handleChange} className="form-control" rows="3" required></textarea>
                            </div>
                        </div>

                        {/* --- CONTACT INFO --- */}
                        <h5 className="mb-3 text-primary fw-bold">2. Contact Information</h5>
                        <div className="row g-3 mb-4">
                            <div className="col-md-6">
                                <label className="form-label">Phone Number <span className="text-danger">*</span></label>
                                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="form-control" maxLength="15" required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Email Address <span className="text-danger">*</span></label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" required />
                            </div>
                        </div>

                        {/* --- ADDRESS --- */}
                        <h5 className="mb-3 text-primary fw-bold">3. Shop Location</h5>
                        <div className="row g-3 mb-4">
                            <div className="col-12">
                                <label className="form-label">Full Address <span className="text-danger">*</span></label>
                                <textarea name="shopAddress" value={formData.shopAddress} onChange={handleChange} className="form-control" rows="2" required></textarea>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">City <span className="text-danger">*</span></label>
                                <input type="text" name="city" value={formData.city} onChange={handleChange} className="form-control" required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">State <span className="text-danger">*</span></label>
                                <input type="text" name="state" value={formData.state} onChange={handleChange} className="form-control" required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Pin Code <span className="text-danger">*</span></label>
                                <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} className="form-control" pattern="[0-9]{6}" title="Must be 6 digits" maxLength="6" required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Country</label>
                                <input type="text" name="country" value={formData.country} onChange={handleChange} className="form-control" defaultValue="India" />
                            </div>
                        </div>

                        {/* --- LEGAL DOCUMENTS --- */}
                        <h5 className="mb-3 text-primary fw-bold">4. Legal Documents</h5>
                        <div className="row g-3 mb-4">
                            <div className="col-md-4">
                                <label className="form-label">GST Number</label>
                                <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} className="form-control" maxLength="15" />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">PAN Number</label>
                                <input type="text" name="panNumber" value={formData.panNumber} onChange={handleChange} className="form-control" maxLength="10" />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Aadhaar Number</label>
                                <input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} className="form-control" maxLength="12" />
                            </div>
                        </div>

                        <div className="d-grid mt-5">
                            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                {loading ? 'Submitting Application...' : 'Create Shop'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateShopTab;
