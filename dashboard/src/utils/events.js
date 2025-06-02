import { EVENTS } from './constants';

/**
 * Sistema de eventos para comunicación entre microfrontends
 * Permite la comunicación entre el dashboard principal y los módulos remotos
 * sin acoplamiento directo entre ellos.
 */
class EventBus {
  constructor() {
    this.events = {};
  }

  /**
   * Suscribirse a un evento
   * @param {string} event - Nombre del evento
   * @param {Function} callback - Función a ejecutar cuando ocurra el evento
   * @returns {Function} - Función para cancelar la suscripción
   */
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    
    this.events[event].push(callback);
    
    // Devolver función para cancelar la suscripción
    return () => this.off(event, callback);
  }

  /**
   * Cancelar suscripción a un evento
   * @param {string} event - Nombre del evento
   * @param {Function} callback - Función a eliminar
   */
  off(event, callback) {
    if (!this.events[event]) return;
    
    this.events[event] = this.events[event].filter(cb => cb !== callback);
    
    // Limpiar el array si no quedan callbacks
    if (this.events[event].length === 0) {
      delete this.events[event];
    }
  }

  /**
   * Suscribirse a un evento y cancelar después de la primera ejecución
   * @param {string} event - Nombre del evento
   * @param {Function} callback - Función a ejecutar cuando ocurra el evento
   */
  once(event, callback) {
    const onceCallback = (...args) => {
      this.off(event, onceCallback);
      callback(...args);
    };
    
    this.on(event, onceCallback);
  }

  /**
   * Emitir un evento
   * @param {string} event - Nombre del evento
   * @param {any} data - Datos a enviar con el evento
   */
  emit(event, data) {
    if (!this.events[event]) return;
    
    this.events[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error en callback de evento ${event}:`, error);
      }
    });
  }

  /**
   * Limpiar todos los eventos o un evento específico
   * @param {string} [event] - Nombre del evento a limpiar (opcional)
   */
  clear(event) {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
  }

  /**
   * Obtener la lista de eventos activos
   * @returns {Object} - Objeto con los eventos y el número de suscriptores
   */
  getActiveEvents() {
    const activeEvents = {};
    
    Object.keys(this.events).forEach(event => {
      activeEvents[event] = this.events[event].length;
    });
    
    return activeEvents;
  }
}

// Crear una instancia única del EventBus
const eventBus = new EventBus();

/**
 * Exponer métodos específicos para los eventos de la aplicación
 */

/**
 * Suscribirse al evento de inicio de sesión
 * @param {Function} callback - Función a ejecutar cuando un usuario inicie sesión
 * @returns {Function} - Función para cancelar la suscripción
 */
export const onLogin = (callback) => eventBus.on(EVENTS.AUTH_LOGIN, callback);

/**
 * Suscribirse al evento de cierre de sesión
 * @param {Function} callback - Función a ejecutar cuando un usuario cierre sesión
 * @returns {Function} - Función para cancelar la suscripción
 */
export const onLogout = (callback) => eventBus.on(EVENTS.AUTH_LOGOUT, callback);

/**
 * Suscribirse al evento de cambio de tema
 * @param {Function} callback - Función a ejecutar cuando cambie el tema
 * @returns {Function} - Función para cancelar la suscripción
 */
export const onThemeChange = (callback) => eventBus.on(EVENTS.THEME_CHANGE, callback);

/**
 * Suscribirse al evento de toggle del sidebar
 * @param {Function} callback - Función a ejecutar cuando se toggle el sidebar
 * @returns {Function} - Función para cancelar la suscripción
 */
export const onSidebarToggle = (callback) => eventBus.on(EVENTS.SIDEBAR_TOGGLE, callback);

/**
 * Suscribirse al evento de nueva notificación
 * @param {Function} callback - Función a ejecutar cuando llegue una nueva notificación
 * @returns {Function} - Función para cancelar la suscripción
 */
export const onNewNotification = (callback) => eventBus.on(EVENTS.NOTIFICATION_NEW, callback);

/**
 * Suscribirse al evento de carga de módulo remoto
 * @param {Function} callback - Función a ejecutar cuando se cargue un módulo remoto
 * @returns {Function} - Función para cancelar la suscripción
 */
export const onRemoteModuleLoaded = (callback) => eventBus.on(EVENTS.REMOTE_MODULE_LOADED, callback);

/**
 * Suscribirse al evento de error en módulo remoto
 * @param {Function} callback - Función a ejecutar cuando haya un error en un módulo remoto
 * @returns {Function} - Función para cancelar la suscripción
 */
export const onRemoteModuleError = (callback) => eventBus.on(EVENTS.REMOTE_MODULE_ERROR, callback);

/**
 * Emitir evento de inicio de sesión
 * @param {Object} userData - Datos del usuario que inició sesión
 */
export const emitLogin = (userData) => eventBus.emit(EVENTS.AUTH_LOGIN, userData);

/**
 * Emitir evento de cierre de sesión
 */
export const emitLogout = () => eventBus.emit(EVENTS.AUTH_LOGOUT);

/**
 * Emitir evento de cambio de tema
 * @param {string} theme - Nuevo tema ('light' o 'dark')
 */
export const emitThemeChange = (theme) => eventBus.emit(EVENTS.THEME_CHANGE, theme);

/**
 * Emitir evento de toggle del sidebar
 * @param {boolean} collapsed - Estado de colapso del sidebar
 */
export const emitSidebarToggle = (collapsed) => eventBus.emit(EVENTS.SIDEBAR_TOGGLE, collapsed);

/**
 * Emitir evento de nueva notificación
 * @param {Object} notification - Datos de la notificación
 */
export const emitNewNotification = (notification) => eventBus.emit(EVENTS.NOTIFICATION_NEW, notification);

/**
 * Emitir evento de carga de módulo remoto
 * @param {string} moduleName - Nombre del módulo cargado
 * @param {Object} data - Datos adicionales del módulo cargado
 */
export const emitRemoteModuleLoaded = (moduleName, data = {}) => {
  // Emitir evento de bus
  eventBus.emit(EVENTS.REMOTE_MODULE_LOADED, { moduleName, data });
  
  // Emitir evento DOM para comunicación con módulos remotos
  window.dispatchEvent(new CustomEvent('remote-module-event', { 
    detail: { type: 'loaded', moduleName, data }
  }));
};

/**
 * Emitir evento de error en módulo remoto
 * @param {string} moduleName - Nombre del módulo con error
 * @param {Object} error - Información del error
 */
export const emitRemoteModuleError = (moduleName, error = {}) => {
  // Emitir evento de bus
  eventBus.emit(EVENTS.REMOTE_MODULE_ERROR, { moduleName, error });
  
  // Emitir evento DOM para comunicación con módulos remotos
  window.dispatchEvent(new CustomEvent('remote-module-event', { 
    detail: { type: 'error', moduleName, error }
  }));
};

// Exportar la instancia del EventBus para casos de uso avanzados
export const eventBusInstance = eventBus;

export default {
  on: eventBus.on.bind(eventBus),
  off: eventBus.off.bind(eventBus),
  once: eventBus.once.bind(eventBus),
  emit: eventBus.emit.bind(eventBus),
  clear: eventBus.clear.bind(eventBus),
  getActiveEvents: eventBus.getActiveEvents.bind(eventBus),
  // Eventos específicos
  onLogin,
  onLogout,
  onThemeChange,
  onSidebarToggle,
  onNewNotification,
  onRemoteModuleLoaded,
  onRemoteModuleError,
  emitLogin,
  emitLogout,
  emitThemeChange,
  emitSidebarToggle,
  emitNewNotification,
  emitRemoteModuleLoaded,
  emitRemoteModuleError
};