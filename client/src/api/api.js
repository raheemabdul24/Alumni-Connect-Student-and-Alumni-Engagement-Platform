import axios from 'axios'
import { API_BASE } from '../config'

const api = axios.create({ baseURL: API_BASE })

// Setup interceptor with Clerk token (called from useApi hook in components)
export const setupAuthInterceptor = (getToken) => {
  api.interceptors.request.use(async (cfg) => {
    try {
      const token = await getToken();
      if (token) {
        cfg.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error('Error getting Clerk token:', err);
    }
    return cfg;
  }, (err) => Promise.reject(err));
};

export default api
