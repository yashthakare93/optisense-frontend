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

