import React from 'react';
import CheckboxFilterGroup from './CheckboxFilterGroup';
import PriceRangeFilter from './PriceRangeFilter';

const FilterSidebar = ({ filters, setFilters, categories, brands }) => {

    // Generic handler for array-based filters (toggle logic)
    const handleArrayFilterChange = (key, value) => {
        const currentValues = filters[key] || [];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(item => item !== value)
            : [...currentValues, value];

        setFilters({ ...filters, [key]: newValues });
    };

    const FRAME_TYPES = ['Full Rim', 'Half Rim', 'Rimless'];
    const FRAME_COLORS = ['Black', 'Crystal', 'Blue', 'Red', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Brown', 'Gray', 'White', 'Multicolor'];
    const FRAME_MATERIAL = ["Acetate","TR90","Stainless Steel","Titanium","Ultem","Mixed Material","Other"];
    const GENDER = ['Men', 'Women', 'Unisex', 'Kids'];
    const FRAME_SIZE = ['Extra Narrow', 'Narrow', 'Medium', 'Wide', 'Extra Wide'];
    const FRAME_SHAPE = ['Rectangle', 'Round', 'Square' , 'Aviator', 'Cat Eyes', 'Wayfarer'];

    return (
        <div className="h-100 p-4 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h6 className="mb-0 fw-bold text-uppercase text-dark" style={{ letterSpacing: '1px' }}>Filters</h6>
                <button
                    className="btn btn-link text-danger text-decoration-none p-0 fw-bold"
                    style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}
                    onClick={() => setFilters({ categories: [], brands: [], frameTypes: [], colors: [], minPrice: '', maxPrice: '' })}
                >
                    CLEAR ALL
                </button>
            </div>

            <CheckboxFilterGroup
                title="Categories"
                options={categories}
                selectedValues={filters.categories}
                onChange={(category) => handleArrayFilterChange('categories', category)}
                maxHeight="250px"
            />

            <PriceRangeFilter
                minPrice={filters.minPrice}
                maxPrice={filters.maxPrice}
                onMinChange={(val) => setFilters({ ...filters, minPrice: val })}
                onMaxChange={(val) => setFilters({ ...filters, maxPrice: val })}
            />

            <CheckboxFilterGroup
                title="Brands"
                options={brands}
                selectedValues={filters.brands}
                onChange={(brand) => handleArrayFilterChange('brands', brand)}
                maxHeight="250px"
            />

            <CheckboxFilterGroup
                title="Frame Type"
                options={FRAME_TYPES}
                selectedValues={filters.frameTypes || []}
                onChange={(type) => handleArrayFilterChange('frameTypes', type)}
            />

            <CheckboxFilterGroup
                title="Frame Colour"
                options={FRAME_COLORS}
                selectedValues={filters.colors || []}
                onChange={(color) => handleArrayFilterChange('colors', color)}
            />

            <CheckboxFilterGroup
                title="Frame Material"
                options={FRAME_MATERIAL}
                selectedValues={filters.frameMaterial || []}
                onChange={(Material) => handleArrayFilterChange('frameMaterial', Material)}
            />
            
            <CheckboxFilterGroup
                title="Gender"
                options={GENDER}
                selectedValues={filters.Gender || []}
                onChange={(Gender) => handleArrayFilterChange('Gender', Gender)}
            />
            
            <CheckboxFilterGroup
                title="Frame Size"
                options={FRAME_SIZE}
                selectedValues={filters.frameSize || []}
                onChange={(Size) => handleArrayFilterChange('frameSize', Size)}
            />

            
            <CheckboxFilterGroup
                title="Frame Shape"
                options={FRAME_SHAPE}
                selectedValues={filters.frameShape || []}
                onChange={(Shape) => handleArrayFilterChange('frameShape', Shape)}
            />

        </div>
    )
};

export default FilterSidebar;
