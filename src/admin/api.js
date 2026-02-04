import { apiClient } from '../common/api';

// Get All Users
export const getAllUsers = async () => {
  try {
    const response = await apiClient.get('/admin/users');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
};

// Get User By Id
export const getUserById = async (userId) => {
  try {
    const response = await apiClient.get(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch user ${userId}:`, error);
    throw error;
  }
};

// Delete User
export const deleteUser = async (userId) => {
  try {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    return response;
  } catch (error) {
    console.error(`Failed to delete user ${userId}:`, error);
    throw error;
  }
};

// Shop Managment

// Get all pending shops
export const getAllPendingShops = async () => {
  try {
    const response = await apiClient.get('/admin/shops/pending');
    return response;
  } catch (error) {
    console.error('Failed to fetch pending shops:', error);
    throw error;
  }
}

// Approve Shop
export const approveShop = async (shopId) => {
  try {
    const response = await apiClient.put(`/admin/shops/${shopId}/approve`);
    return response;
  } catch (error) {
    console.error(`Failed to approve shop ${shopId}:`, error);
    throw error;
  }
}

// Reject Shop
export const rejectShop = async (shopId, reason) => {
  try {
    const response = await apiClient.put(`/admin/shops/${shopId}/reject`, reason)
    return response;
  } catch (error) {
    console.error(`Failed to reject shop ${shopId}:`, error);
    throw err;
  }
}

// Get Shops by Status
export const getShopsByStatus = async (status) => {
  try {
    const response = await apiClient.get(`/admin/shops/status/${status}`);
    return response;
  } catch (error) {
    console.error(`Failed to fetch shops with status ${status}:`, error);
    throw error;
  }
}

// Get Shop Stats
export const getShopStats = async () => {
  try {
    const response = await apiClient.get('/admin/shops/stats');
    return response;
  } catch (error) {
    console.error('Failed to fetch shop stats:', error);
    throw error;
  }
}