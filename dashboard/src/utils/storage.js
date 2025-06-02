import { STORAGE_KEYS } from './constants';

/**
 * Clase para manejar el almacenamiento local
 */
class Storage {
  /**
   * Constructor
   * @param {string} prefix - Prefijo para las claves de almacenamiento
   * @param {Storage} storageType - Tipo de almacenamiento (localStorage o sessionStorage)
   */
  constructor(prefix = 'dashboard_', storageType = window.localStorage) {
    this.prefix = prefix;
    this.storage = storageType;
  }

  /**
   * Obtiene la clave con prefijo
   * @param {string} key - Clave original
   * @returns {string} - Clave con prefijo
   */
  getKey(key) {
    return `${this.prefix}${key}`;
  }

  /**
   * Guarda un valor en el almacenamiento
   * @param {string} key - Clave
   * @param {any} value - Valor a guardar
   * @returns {boolean} - true si se guardó correctamente
   */
  set(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      this.storage.setItem(this.getKey(key), serializedValue);
      return true;
    } catch (error) {
      console.error('Error al guardar en storage:', error);
      return false;
    }
  }

  /**
   * Obtiene un valor del almacenamiento
   * @param {string} key - Clave
   * @param {any} defaultValue - Valor por defecto si no existe
   * @returns {any} - Valor almacenado o valor por defecto
   */
  get(key, defaultValue = null) {
    try {
      const value = this.storage.getItem(this.getKey(key));
      
      if (value === null) {
        return defaultValue;
      }
      
      return JSON.parse(value);
    } catch (error) {
      console.error('Error al obtener de storage:', error);
      return defaultValue;
    }
  }

  /**
   * Elimina un valor del almacenamiento
   * @param {string} key - Clave
   * @returns {boolean} - true si se eliminó correctamente
   */
  remove(key) {
    try {
      this.storage.removeItem(this.getKey(key));
      return true;
    } catch (error) {
      console.error('Error al eliminar de storage:', error);
      return false;
    }
  }

  /**
   * Verifica si existe una clave en el almacenamiento
   * @param {string} key - Clave
   * @returns {boolean} - true si existe
   */
  has(key) {
    return this.storage.getItem(this.getKey(key)) !== null;
  }

  /**
   * Limpia todo el almacenamiento con el prefijo actual
   * @returns {boolean} - true si se limpió correctamente
   */
  clear() {
    try {
      // Solo eliminar las claves con el prefijo actual
      const keysToRemove = [];
      
      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i);
        
        if (key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        this.storage.removeItem(key);
      });
      
      return true;
    } catch (error) {
      console.error('Error al limpiar storage:', error);
      return false;
    }
  }

  /**
   * Obtiene todas las claves almacenadas con el prefijo actual
   * @returns {Array<string>} - Array de claves sin el prefijo
   */
  keys() {
    const keys = [];
    
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      
      if (key.startsWith(this.prefix)) {
        keys.push(key.substring(this.prefix.length));
      }
    }
    
    return keys;
  }

  /**
   * Obtiene todos los valores almacenados con el prefijo actual
   * @returns {Object} - Objeto con todas las claves y valores
   */
  getAll() {
    const result = {};
    const keys = this.keys();
    
    keys.forEach(key => {
      result[key] = this.get(key);
    });
    
    return result;
  }

  /**
   * Guarda múltiples valores en el almacenamiento
   * @param {Object} values - Objeto con claves y valores
   * @returns {boolean} - true si se guardaron correctamente
   */
  setMultiple(values) {
    try {
      Object.entries(values).forEach(([key, value]) => {
        this.set(key, value);
      });
      
      return true;
    } catch (error) {
      console.error('Error al guardar múltiples valores en storage:', error);
      return false;
    }
  }
}

// Crear instancias para localStorage y sessionStorage
const localStorage = new Storage('dashboard_', window.localStorage);
const sessionStorage = new Storage('dashboard_', window.sessionStorage);

// Funciones de ayuda para acceder a valores comunes

/**
 * Obtiene el token de autenticación
 * @returns {string|null} - Token o null si no existe
 */
export const getAuthToken = () => localStorage.get(STORAGE_KEYS.AUTH_TOKEN);

/**
 * Guarda el token de autenticación
 * @param {string} token - Token a guardar
 * @returns {boolean} - true si se guardó correctamente
 */
export const setAuthToken = (token) => localStorage.set(STORAGE_KEYS.AUTH_TOKEN, token);

/**
 * Elimina el token de autenticación
 * @returns {boolean} - true si se eliminó correctamente
 */
export const removeAuthToken = () => localStorage.remove(STORAGE_KEYS.AUTH_TOKEN);

/**
 * Obtiene los datos del usuario
 * @returns {Object|null} - Datos del usuario o null si no existe
 */
export const getUser = () => localStorage.get(STORAGE_KEYS.USER);

/**
 * Guarda los datos del usuario
 * @param {Object} user - Datos del usuario
 * @returns {boolean} - true si se guardó correctamente
 */
export const setUser = (user) => localStorage.set(STORAGE_KEYS.USER, user);

/**
 * Elimina los datos del usuario
 * @returns {boolean} - true si se eliminó correctamente
 */
export const removeUser = () => localStorage.remove(STORAGE_KEYS.USER);

/**
 * Obtiene la preferencia de tema
 * @returns {boolean} - true si el tema es oscuro
 */
export const getDarkTheme = () => localStorage.get(STORAGE_KEYS.THEME, false);

/**
 * Guarda la preferencia de tema
 * @param {boolean} isDark - true si el tema es oscuro
 * @returns {boolean} - true si se guardó correctamente
 */
export const setDarkTheme = (isDark) => localStorage.set(STORAGE_KEYS.THEME, isDark);

/**
 * Obtiene el estado de colapso del sidebar
 * @returns {boolean} - true si el sidebar está colapsado
 */
export const getSidebarCollapsed = () => localStorage.get(STORAGE_KEYS.SIDEBAR_COLLAPSED, false);

/**
 * Guarda el estado de colapso del sidebar
 * @param {boolean} isCollapsed - true si el sidebar está colapsado
 * @returns {boolean} - true si se guardó correctamente
 */
export const setSidebarCollapsed = (isCollapsed) => localStorage.set(STORAGE_KEYS.SIDEBAR_COLLAPSED, isCollapsed);

/**
 * Limpia todos los datos de autenticación
 * @returns {boolean} - true si se limpió correctamente
 */
export const clearAuthData = () => {
  removeAuthToken();
  removeUser();
  return true;
};

export { localStorage, sessionStorage };

export default {
  localStorage,
  sessionStorage,
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  getUser,
  setUser,
  removeUser,
  getDarkTheme,
  setDarkTheme,
  getSidebarCollapsed,
  setSidebarCollapsed,
  clearAuthData
};