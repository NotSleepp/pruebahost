import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { login, logout, refreshToken, getUserProfile } from '@/utils/auth';

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const user = ref(null);
  const token = ref(localStorage.getItem('auth_token') || null);
  const loading = ref(false);
  const error = ref(null);
  const redirectPath = ref('/');

  // Getters
  const isAuthenticated = computed(() => !!token.value);
  
  // Acciones
  async function loginUser(credentials) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await login(credentials);
      
      // Guardar token en localStorage y en el estado
      token.value = response.token;
      localStorage.setItem('auth_token', response.token);
      
      // Obtener información del usuario
      await fetchUserProfile();
      
      return true;
    } catch (err) {
      console.error('Error de autenticación:', err);
      error.value = err.message || 'Error al iniciar sesión';
      return false;
    } finally {
      loading.value = false;
    }
  }
  
  async function logoutUser() {
    try {
      // Llamar al endpoint de logout si es necesario
      if (token.value) {
        await logout(token.value);
      }
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    } finally {
      // Limpiar estado y localStorage independientemente del resultado
      clearAuthData();
    }
  }
  
  async function fetchUserProfile() {
    if (!token.value) return null;
    
    loading.value = true;
    
    try {
      const userProfile = await getUserProfile(token.value);
      user.value = userProfile;
      return userProfile;
    } catch (err) {
      console.error('Error al obtener perfil de usuario:', err);
      error.value = err.message || 'Error al obtener información del usuario';
      
      // Si hay un error de autenticación, limpiar los datos
      if (err.status === 401) {
        clearAuthData();
      }
      
      return null;
    } finally {
      loading.value = false;
    }
  }
  
  async function refreshUserToken() {
    if (!token.value) return false;
    
    try {
      const newToken = await refreshToken(token.value);
      token.value = newToken;
      localStorage.setItem('auth_token', newToken);
      return true;
    } catch (err) {
      console.error('Error al refrescar token:', err);
      clearAuthData();
      return false;
    }
  }
  
  function clearAuthData() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('auth_token');
  }
  
  function setRedirectPath(path) {
    redirectPath.value = path || '/';
  }
  
  // Para desarrollo/pruebas - Simular login
  function setDummyUser() {
    user.value = {
      id: 1,
      name: 'Usuario de Prueba',
      email: 'usuario@ejemplo.com',
      role: 'admin'
    };
    token.value = 'dummy-token-for-development';
    localStorage.setItem('auth_token', token.value);
  }

  // Inicializar - Verificar si hay un token guardado y obtener el perfil
  if (token.value) {
    fetchUserProfile();
  }

  return {
    // Estado
    user,
    token,
    loading,
    error,
    redirectPath,
    
    // Getters
    isAuthenticated,
    
    // Acciones
    login: loginUser,
    logout: logoutUser,
    fetchUserProfile,
    refreshToken: refreshUserToken,
    setRedirectPath,
    setDummyUser
  };
});