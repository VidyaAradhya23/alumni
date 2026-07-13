import api from './api';

export const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
};

export const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
};

export const checkEmailExists = async (email) => {
    const { data } = await api.post('/auth/check-email', { email });
    return data.exists; // returns boolean
};

export const getProfile = async () => {
    const { data } = await api.get('/auth/profile');
    return data;
};

export const updateProfile = async (profileData) => {
    const { data } = await api.put('/auth/profile', profileData);
    return data;
};

export const changePassword = async (passwordData) => {
    const { data } = await api.put('/auth/change-password', passwordData);
    return data;
};

export const forgotPassword = async (email) => {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
};

export const resetPassword = async (token, newPassword) => {
    const { data } = await api.post('/auth/reset-password', { token, newPassword });
    return data;
};

export const deleteAccount = async () => {
    const { data } = await api.delete('/auth/account');
    return data;
};

// Also adding block routes here or separate, but small enough for authService
export const blockUser = async (blockedId) => {
    const { data } = await api.post('/blocks', { blockedId });
    return data;
};

export const unblockUser = async (blockedId) => {
    const { data } = await api.delete(`/blocks/${blockedId}`);
    return data;
};
