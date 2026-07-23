import axios from 'axios';
import api, { API_URL } from './api';
import { Platform } from 'react-native';

/**
 * Resolves full qualified URL for image paths.
 * @param {string} url - Relative or absolute image URL
 * @returns {string|null} Full image URL
 */
export const getImageUrl = (url) => {
  if (!url) return null;
  if (typeof url !== 'string') return null;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  // Server origin (e.g., https://backend-pi-bice-97.vercel.app)
  const serverOrigin = API_URL.replace(/\/api\/?$/, '');
  if (url.startsWith('/')) {
    return `${serverOrigin}${url}`;
  }
  return `${serverOrigin}/${url}`;
};

/**
 * Uploads a file (like an image) to the backend.
 * @param {string} uri - The local file URI from expo-image-picker
 * @param {string} mimeType - The mime type of the file (e.g., 'image/jpeg')
 * @param {string} name - The file name
 * @returns {Promise<string>} The uploaded file URL
 */
export const uploadFile = async (uri, mimeType = 'image/jpeg', name = 'upload.jpg') => {
    try {
        const formData = new FormData();
        
        if (Platform.OS === 'web') {
            const response = await fetch(uri);
            const blob = await response.blob();
            formData.append('image', blob, name);
        } else {
            formData.append('image', {
                uri,
                name,
                type: mimeType
            });
        }

        // Use custom multipart/form-data headers
        const response = await api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Accept: 'application/json',
            },
        });

        if (response.data && response.data.url) {
            return getImageUrl(response.data.url);
        }
        throw new Error('Upload failed, no URL returned');
    } catch (error) {
        console.error('File upload error:', error);
        throw error;
    }
};
