import { apiClient } from '../common/api';

// Create Shop
export const createShop = async (shopData) => {
    return apiClient.post('/shop/create', shopData);
};

// Get My Shop
export const getMyShop = async () => {
    return apiClient.get('/shop/my-shop');
};

// Update Shop
export const updateShop = async (shopId, shopData) => {
    return apiClient.put(`/shop/update/${shopId}`, shopData);
};

// Add Product (FormData support)
export const addProduct = async (formData) => {
    // Axios determines content-type (multipart/form-data) when data is FormData
    const response = await apiClient.post("/products/add", formData);
    return response;
}

// Get Products by Shop
export const getProductsByShop = async (shopId) => {
    const response = await apiClient.get(`/products/shop/${shopId}`);
    return response;
}

// Update Product
export const updateProduct = async (productId, productData) => {
    const response = await apiClient.put(`/products/${productId}`, productData);
    return response;
}

// Delete Product
export const deleteProduct = async (productId) => {
    const response = await apiClient.delete(`/products/${productId}`);
    return response.data;
}