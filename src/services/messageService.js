import api from './api';

export const sendMessage = async (userId, text, attachment = null, replyTo = null, isForwarded = false) => {
    const { data } = await api.post(`/messages/${userId}`, { text, attachment, replyTo, isForwarded });
    return data;
};

export const reactMessage = async (messageId, emoji) => {
    const { data } = await api.put(`/messages/${messageId}/react`, { emoji });
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
