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
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return 'https://backend-six-dusky-31.vercel.app/api';
    }
  }
  return 'http://192.168.30.142:5000/api';
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
