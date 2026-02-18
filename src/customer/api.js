import { apiClient } from "../common/api";

// Get All Products
export const getAllProducts = (params = {}) => {
    const query = new URLSearchParams();
    Object.keys(params).forEach(key => {
        if (Array.isArray(params[key])) {
            params[key].forEach(val => query.append(key, val));
        } else if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
            query.append(key, params[key]);
        }
    });
    return apiClient.get(`/products?${query.toString()}`);
}

// Get Product By Id
export const getProductById = (id) => {
    return apiClient.get(`/products/${id}`);
}

// Get Product Variants by Model Number
export const getProductVariants = (modelNumber) => {
    return apiClient.get(`/products/variants/${modelNumber}`);
}