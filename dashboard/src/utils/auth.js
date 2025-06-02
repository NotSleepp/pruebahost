import axios from 'axios';
import { API_URL } from './constants';

// Crear una instancia de axios con configuración base
const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para añadir el token a las peticiones
authApi.interceptors.request.use(
  config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Interceptor para manejar errores de respuesta
authApi.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Si el error es 401 (Unauthorized) y no es un reintento de refresh token
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
      originalRequest._retry = true;
      
      try {
        // Intentar refrescar el token
        const token = localStorage.getItem('auth_token');
        const response = await authApi.post('/auth/refresh', { token });
        
        // Si se obtiene un nuevo token, actualizar localStorage y reintentar la petición
        if (response.data.token) {
          localStorage.setItem('auth_token', response.data.token);
          authApi.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
          return authApi(originalRequest);
        }
      } catch (refreshError) {
        // Si falla el refresh, limpiar la sesión
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Función para iniciar sesión
 * @param {Object} credentials - Credenciales del usuario (email, password)
 * @returns {Promise} - Promesa con la respuesta del servidor
 */
export async function login(credentials) {
  try {
    // En un entorno real, esto sería una llamada a la API
    // const response = await authApi.post('/auth/login', credentials);
    // return response.data;
    
    // Para desarrollo, simulamos una respuesta exitosa
    return simulateSuccessfulLogin(credentials);
  } catch (error) {
    console.error('Error en login:', error);
    throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
  }
}

/**
 * Función para cerrar sesión
 * @param {string} token - Token de autenticación
 * @returns {Promise} - Promesa con la respuesta del servidor
 */
export async function logout(token) {
  try {
    // En un entorno real, esto sería una llamada a la API
    // const response = await authApi.post('/auth/logout');
    // return response.data;
    
    // Para desarrollo, simulamos una respuesta exitosa
    return { success: true };
  } catch (error) {
    console.error('Error en logout:', error);
    throw new Error(error.response?.data?.message || 'Error al cerrar sesión');
  }
}

/**
 * Función para refrescar el token
 * @param {string} token - Token actual
 * @returns {Promise<string>} - Promesa con el nuevo token
 */
export async function refreshToken(token) {
  try {
    // En un entorno real, esto sería una llamada a la API
    // const response = await authApi.post('/auth/refresh', { token });
    // return response.data.token;
    
    // Para desarrollo, simulamos un nuevo token
    return `refreshed-${token}-${Date.now()}`;
  } catch (error) {
    console.error('Error al refrescar token:', error);
    throw new Error(error.response?.data?.message || 'Error al refrescar la sesión');
  }
}

/**
 * Función para obtener el perfil del usuario
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} - Promesa con los datos del usuario
 */
export async function getUserProfile(token) {
  try {
    // En un entorno real, esto sería una llamada a la API
    // const response = await authApi.get('/auth/profile');
    // return response.data;
    
    // Para desarrollo, simulamos datos de usuario
    return {
      id: 1,
      name: 'Usuario de Prueba',
      email: 'usuario@ejemplo.com',
      role: 'admin',
      permissions: ['read', 'write', 'admin']
    };
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    throw new Error(error.response?.data?.message || 'Error al obtener información del usuario');
  }
}

/**
 * Función para verificar si el token es válido
 * @param {string} token - Token a verificar
 * @returns {Promise<boolean>} - Promesa que indica si el token es válido
 */
export async function verifyToken(token) {
  try {
    // En un entorno real, esto sería una llamada a la API
    // const response = await authApi.post('/auth/verify', { token });
    // return response.data.valid;
    
    // Para desarrollo, simulamos que el token es válido
    return true;
  } catch (error) {
    console.error('Error al verificar token:', error);
    return false;
  }
}

/**
 * Función para simular un login exitoso (solo para desarrollo)
 * @param {Object} credentials - Credenciales del usuario
 * @returns {Object} - Datos simulados de respuesta
 */
function simulateSuccessfulLogin(credentials) {
  // Verificar credenciales de prueba
  if (credentials.email === 'admin@ejemplo.com' && credentials.password === 'password') {
    return {
      token: `dummy-token-${Date.now()}`,
      user: {
        id: 1,
        name: 'Administrador',
        email: 'admin@ejemplo.com',
        role: 'admin'
      }
    };
  } else if (credentials.email === 'usuario@ejemplo.com' && credentials.password === 'password') {
    return {
      token: `dummy-token-${Date.now()}`,
      user: {
        id: 2,
        name: 'Usuario Regular',
        email: 'usuario@ejemplo.com',
        role: 'user'
      }
    };
  }
  
  // Si las credenciales no coinciden, simular error
  throw {
    response: {
      data: {
        message: 'Credenciales inválidas'
      }
    }
  };
}

export default authApi;