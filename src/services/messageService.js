import api from './api';

export const sendMessage = async (userId, text) => {
    const { data } = await api.post(`/messages/${userId}`, { text });
    return data;
};

export const getConversation = async (userId) => {
    const { data } = await api.get(`/messages/${userId}?_t=${Date.now()}`);
    return data;
};

export const getChatHistory = async () => {
    const { data } = await api.get(`/messages/history/recent?_t=${Date.now()}`);
    return data;
};
