/**
 * Constantes de la aplicación
 */

// URL base de la API
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Configuración de módulos remotos
export const REMOTE_MODULES = {
  ADMIN: {
    name: 'admin-module',
    url: import.meta.env.VITE_ADMIN_MODULE_URL || 'http://localhost:5001/assets/remoteEntry.js',
    components: {
      AdminApp: './AdminApp',
      Menu: './menu'
    }
  },
  REPORTS: {
    name: 'reports-module',
    url: import.meta.env.VITE_REPORTS_MODULE_URL || 'http://localhost:5004/assets/remoteEntry.js',
    components: {
      ReportsApp: './ReportsApp',
      Menu: './menu'
    }
  }
};

// Configuración de temas
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

// Estados de carga
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

// Tipos de notificaciones
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
};

// Roles de usuario
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
};

// Permisos de usuario
export const PERMISSIONS = {
  READ: 'read',
  WRITE: 'write',
  ADMIN: 'admin'
};

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100]
};

// Configuración de tiempo
export const TIME = {
  // Tiempo de expiración del token en milisegundos (1 hora)
  TOKEN_EXPIRATION: 60 * 60 * 1000,
  // Tiempo de refresco del token en milisegundos (55 minutos)
  TOKEN_REFRESH: 55 * 60 * 1000,
  // Tiempo de inactividad antes de cerrar sesión (30 minutos)
  INACTIVITY_TIMEOUT: 30 * 60 * 1000,
  // Tiempo de duración de las notificaciones (5 segundos)
  NOTIFICATION_DURATION: 5000
};

// Configuración de almacenamiento local
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
  THEME: 'dark_theme',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
  LANGUAGE: 'language'
};

// Configuración de idiomas
export const LANGUAGES = {
  ES: 'es',
  EN: 'en'
};

// Configuración de rutas
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_MENU_CONFIG: '/admin/menu-config',
  NOT_FOUND: '/404'
};

// Configuración de eventos
export const EVENTS = {
  AUTH_LOGIN: 'auth:login',
  AUTH_LOGOUT: 'auth:logout',
  AUTH_REFRESH: 'auth:refresh',
  THEME_CHANGE: 'theme:change',
  SIDEBAR_TOGGLE: 'sidebar:toggle',
  NOTIFICATION_NEW: 'notification:new',
  REMOTE_MODULE_LOADED: 'remote:loaded',
  REMOTE_MODULE_ERROR: 'remote:error'
};