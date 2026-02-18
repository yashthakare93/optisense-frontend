import React from 'react';

const CheckboxFilterGroup = ({ title, options, selectedValues = [], onChange, maxHeight }) => {
    return (
        <div className="mb-4">
            <h6 className="fw-bold text-uppercase text-muted border-bottom pb-2 mb-3" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
                {title}
            </h6>
            <div className="overflow-auto pe-2 thin-scrollbar" style={maxHeight ? { maxHeight } : {}}>
                {options.map((option) => (
                    <div key={option} className="form-check mb-2">
                        <input
                            className="form-check-input border-secondary"
                            type="checkbox"
                            id={`${title}-${option}`}
                            checked={selectedValues.includes(option)}
                            onChange={() => onChange(option)}
                            style={{ cursor: 'pointer' }}
                        />
                        <label
                            className="form-check-label text-dark small fw-medium ms-1"
                            htmlFor={`${title}-${option}`}
                            style={{ cursor: 'pointer', fontSize: '0.9rem' }}
                        >
                            {option}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CheckboxFilterGroup;
