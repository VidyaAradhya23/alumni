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

export const sendOtp = async (email) => {
    const { data } = await api.post('/auth/send-otp', { email });
    return data;
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

export const getSuggestions = async () => {
    const { data } = await api.get('/auth/suggestions');
    return data;
};

export const toggleFollowUser = async (userId) => {
    const { data } = await api.post(`/auth/follow/${userId}`);
    return data;
};

export const getFollowers = async () => {
    const { data } = await api.get('/auth/followers');
    return data;
};

export const getFollowing = async () => {
    const { data } = await api.get('/auth/following');
    return data;
};

export const getNotifications = async () => {
    const { data } = await api.get('/auth/notifications');
    return data;
};

export const markNotificationsRead = async (id = 'all') => {
    const { data } = await api.put(`/auth/notifications/${id}/read`);
    return data;
};

export const getPosts = async () => {
    const { data } = await api.get('/posts');
    return data;
};

export const toggleLikePost = async (postId) => {
    const { data } = await api.put(`/posts/${postId}/like`);
    return data;
};

export const getEvents = async () => {
    const { data } = await api.get('/events');
    return data;
};
