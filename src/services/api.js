import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// FOR PHYSICAL DEVICE TESTING: Replace 'localhost' with your machine's IP address (e.g. 192.168.x.x)
// FOR EMULATOR TESTING: Use 10.0.2.2 for Android
// FOR VERCEL DEPLOYMENT: Configure EXPO_PUBLIC_API_URL in Vercel settings
import { Platform } from 'react-native';

const getApiUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  // Default to the live Vercel backend so physical devices work out of the box
  // without needing a local backend server running.
  return 'https://backend-pi-bice-97.vercel.app/api';
};

export const API_URL = getApiUrl();
const BASE_URL = API_URL;

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  async (config) => {
    const userInfo = await AsyncStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
