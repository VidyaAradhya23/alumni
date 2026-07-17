import api from './api';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const getDashboardStats = async (institution) => {
    const url = institution && institution !== 'All' 
        ? `/admin/stats?institution=${encodeURIComponent(institution)}` 
        : '/admin/stats';
    const { data } = await api.get(url);
    return data;
};

export const approveUser = async (userId) => {
    const { data } = await api.put(`/admin/users/${userId}/approve`);
    return data;
};

export const getPendingUsers = async (institution = undefined) => {
  // Option B: Mock Demo Data if local bypass is active
  try {
    const userInfoStr = await AsyncStorage.getItem('userInfo');
    if (userInfoStr) {
      const userInfo = JSON.parse(userInfoStr);
      if (userInfo.token === 'dummy_token') {
        return [
          {
            _id: 'test-user-123',
            name: 'Newly Registered User',
            email: 'newuser@mediacell.com',
            institution: 'Media Cell Institution',
            department: 'Computer Science',
            batchYear: '2024',
            joiningYear: '2020',
            is_approved: false
          }
        ];
      }
    }
  } catch (e) {
    // Ignore AsyncStorage errors
  }

  const url = institution && institution !== 'All' 
      ? `/admin/pending-users?institution=${encodeURIComponent(institution)}` 
      : '/admin/pending-users';
  const { data } = await api.get(url);
  return data;
};

export const rejectUser = async (userId) => {
    const { data } = await api.delete(`/admin/users/${userId}/reject`);
    return data;
};

export const updateUserRole = async (userId, role) => {
    const { data } = await api.put(`/admin/users/${userId}/role`, { role });
    return data;
};

// Admin report operations
export const getReports = async () => {
    const { data } = await api.get('/reports');
    return data;
};

export const updateReportStatus = async (reportId, status) => {
    const { data } = await api.put(`/reports/${reportId}/status`, { status });
    return data;
};

export const getAllUsers = async () => {
    // This uses the auth endpoint that returns all users
    const { data } = await api.get('/auth/users');
    return data;
};
