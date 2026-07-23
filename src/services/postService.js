import api from './api';

export const getPosts = async () => {
    const { data } = await api.get('/posts');
    return data;
};

export const createPost = async (postData) => {
    const { data } = await api.post('/posts', postData);
    return data;
};

export const likePost = async (postId) => {
    const { data } = await api.put(`/posts/${postId}/like`);
    return data;
};

export const addComment = async (postId, text) => {
    const { data } = await api.post(`/posts/${postId}/comment`, { text });
    return data;
};

export const deletePost = async (postId) => {
    const { data } = await api.delete(`/posts/${postId}`);
    return data;
};

// Also adding report creation here since it's used in the EngageScreen
export const reportItem = async (reportData) => {
    const { data } = await api.post('/reports', reportData);
    return data;
};
