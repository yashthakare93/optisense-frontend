import React from 'react';

const PriceRangeFilter = ({ minPrice, maxPrice, onMinChange, onMaxChange }) => {
    return (
        <div className="mb-4">
            <h6 className="fw-bold text-uppercase text-muted border-bottom pb-2 mb-3" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
                Price Range
            </h6>
            <div className="input-group input-group-sm">
                <input
                    type="number"
                    className="form-control border-secondary"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => onMinChange(e.target.value)}
                />
                <span className="input-group-text bg-transparent border-0 fw-bold text-muted">-</span>
                <input
                    type="number"
                    className="form-control border-secondary"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => onMaxChange(e.target.value)}
                />
            </div>
        </div>
    );
};

export default PriceRangeFilter;
