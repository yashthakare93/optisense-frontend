import { apiClient } from '../common/api';

// Helper to notify Navbar to re-render
const notifyAuthChange = () => {
    window.dispatchEvent(new Event("authChange"));
};

export const signup = async (name, email, password, role = 'SELLER') => {
    const response = await apiClient.post('/auth/signup', { name, email, password, role });
    if (response && response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        if (response.data.token) localStorage.setItem('token', response.data.token);
        notifyAuthChange();
    }
    return response;
};

export const login = async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    console.log('Login response:', response); // Debug log
    if (response && response.data) {
        console.log('User data to store:', response.data); // Debug log
        // Store the full user object (includes role, name, email, token)
        localStorage.setItem('user', JSON.stringify(response.data));
        if (response.data.token) localStorage.setItem('token', response.data.token);
        notifyAuthChange();
    }
    return response; // Return full response so LoginPage can access response.data.role
};

export const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    notifyAuthChange();
};

// Helper to get current user
export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

// Helper to check if user is admin
export const isAdmin = () => {
    const user = getCurrentUser();
    return user && user.role === 'ADMIN';
};