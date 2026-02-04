import React, { useState } from 'react';

function ShopDetailsModal({ shop, onClose, onApprove, onReject, isPending, isRejecting, setRejecting }) {
    const [reason, setReason] = useState('');

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fw-bold">Shop Details: {shop.shopName}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {/* 3. The "Rest Fields" displayed clearly */}
                        <div className="row g-3">
                            <div className="col-md-6">
                                <h6 className="text-muted small fw-bold">BASIC INFO</h6>
                                <p className="mb-1"><strong>Name:</strong> {shop.shopName}</p>
                                <p className="mb-1"><strong>Type:</strong> {shop.businessType}</p>
                                <p className="mb-1"><strong>Description:</strong> {shop.description || shop.shopDescription}</p>
                            </div>
                            <div className="col-md-6">
                                <h6 className="text-muted small fw-bold">CONTACT</h6>
                                <p className="mb-1"><strong>Phone:</strong> {shop.phone}</p>
                                <p className="mb-1"><strong>Email:</strong> {shop.email}</p>
                                <p className="mb-1"><strong>Address:</strong> {shop.shopAddress}, {shop.city}, {shop.pinCode}</p>
                            </div>
                            <div className="col-12 mt-3 p-3 bg-light rounded">
                                <h6 className="text-muted small fw-bold text-uppercase">Legal Verification 🛡️</h6>
                                <div className="row">
                                    <div className="col-md-4"><strong>GST:</strong> {shop.gstNumber || 'N/A'}</div>
                                    <div className="col-md-4"><strong>PAN:</strong> {shop.panNumber || 'N/A'}</div>
                                    <div className="col-md-4"><strong>Aadhaar:</strong> {shop.aadhaarNumber || 'N/A'}</div>
                                </div>
                            </div>
                        </div>

                        {/* REJECTION INPUT */}
                        {isRejecting && (
                            <div className="mt-4">
                                <label className="form-label text-danger fw-bold">Reason for Rejection:</label>
                                <textarea
                                    className="form-control"
                                    rows="2"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="e.g. Invalid GST Number..."
                                ></textarea>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>Close</button>

                        {/* Show Actions only if Pending */}
                        {isPending && !isRejecting && (
                            <>
                                <button className="btn btn-danger" onClick={() => setRejecting(true)}>Reject</button>
                                <button className="btn btn-success" onClick={onApprove}>Approve Shop</button>
                            </>
                        )}

                        {/* Confirm Reject Button */}
                        {isRejecting && (
                            <button className="btn btn-danger" onClick={() => onReject(reason)}>Confirm Rejection</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShopDetailsModal;
