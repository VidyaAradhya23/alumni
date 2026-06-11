import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// FOR PHYSICAL DEVICE TESTING: Replace 'localhost' with your machine's IP address (e.g. 192.168.x.x)
// FOR EMULATOR TESTING: Use 10.0.2.2 for Android
// FOR VERCEL DEPLOYMENT: Configure EXPO_PUBLIC_API_URL in Vercel settings
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.30.142:5000/api'; 

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
