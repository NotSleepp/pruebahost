import axios from 'axios';
import { API_URL, TIME } from './constants';
import { useAuthStore } from '@/store';

/**
 * Configuración de la instancia base de axios
 */
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Interceptor para añadir el token de autenticación a las peticiones
 */
api.interceptors.request.use(
  config => {
    const authStore = useAuthStore();
    const token = authStore.token;
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  error => Promise.reject(error)
);

/**
 * Interceptor para manejar respuestas y errores
 */
api.interceptors.response.use(
  response => response.data,
  async error => {
    const originalRequest = error.config;
    const authStore = useAuthStore();
    
    // Si el error es 401 (Unauthorized) y no es un reintento
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Intentar refrescar el token
        const refreshed = await authStore.refreshToken();
        
        if (refreshed) {
          // Si se refrescó correctamente, reintentar la petición original
          return api(originalRequest);
        } else {
          // Si no se pudo refrescar, cerrar sesión
          authStore.logout();
          return Promise.reject(new Error('Sesión expirada. Por favor, inicie sesión nuevamente.'));
        }
      } catch (refreshError) {
        // Si hay un error al refrescar, cerrar sesión
        authStore.logout();
        return Promise.reject(refreshError);
      }
    }
    
    // Formatear el mensaje de error para una mejor experiencia de usuario
    const errorMessage = error.response?.data?.message || error.message || 'Error en la solicitud';
    const formattedError = new Error(errorMessage);
    formattedError.status = error.response?.status;
    formattedError.data = error.response?.data;
    
    return Promise.reject(formattedError);
  }
);

/**
 * Funciones de ayuda para realizar peticiones HTTP
 */

/**
 * Realizar una petición GET
 * @param {string} url - URL de la petición
 * @param {Object} params - Parámetros de la petición
 * @param {Object} config - Configuración adicional
 * @returns {Promise} - Promesa con la respuesta
 */
export const get = (url, params = {}, config = {}) => {
  return api.get(url, { params, ...config });
};

/**
 * Realizar una petición POST
 * @param {string} url - URL de la petición
 * @param {Object} data - Datos a enviar
 * @param {Object} config - Configuración adicional
 * @returns {Promise} - Promesa con la respuesta
 */
export const post = (url, data = {}, config = {}) => {
  return api.post(url, data, config);
};

/**
 * Realizar una petición PUT
 * @param {string} url - URL de la petición
 * @param {Object} data - Datos a enviar
 * @param {Object} config - Configuración adicional
 * @returns {Promise} - Promesa con la respuesta
 */
export const put = (url, data = {}, config = {}) => {
  return api.put(url, data, config);
};

/**
 * Realizar una petición PATCH
 * @param {string} url - URL de la petición
 * @param {Object} data - Datos a enviar
 * @param {Object} config - Configuración adicional
 * @returns {Promise} - Promesa con la respuesta
 */
export const patch = (url, data = {}, config = {}) => {
  return api.patch(url, data, config);
};

/**
 * Realizar una petición DELETE
 * @param {string} url - URL de la petición
 * @param {Object} config - Configuración adicional
 * @returns {Promise} - Promesa con la respuesta
 */
export const del = (url, config = {}) => {
  return api.delete(url, config);
};

/**
 * Realizar múltiples peticiones en paralelo
 * @param {Array} requests - Array de peticiones
 * @returns {Promise} - Promesa con las respuestas
 */
export const all = (requests) => {
  return axios.all(requests);
};

/**
 * Crear un cancelToken para cancelar peticiones
 * @returns {Object} - Objeto con el token y la función para cancelar
 */
export const createCancelToken = () => {
  const source = axios.CancelToken.source();
  return {
    token: source.token,
    cancel: source.cancel
  };
};

export default {
  get,
  post,
  put,
  patch,
  delete: del,
  all,
  createCancelToken
};