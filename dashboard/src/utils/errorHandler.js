import { NOTIFICATION_TYPES } from './constants';

/**
 * Clase para manejar errores de la aplicación
 */
class ErrorHandler {
  constructor() {
    this.errorListeners = [];
    this.setupGlobalHandlers();
  }

  /**
   * Configura los manejadores globales de errores
   */
  setupGlobalHandlers() {
    // Capturar errores no manejados en promesas
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, 'Unhandled Promise Rejection');
      // No prevenir el comportamiento por defecto para permitir que las herramientas de desarrollo lo muestren
    });

    // Capturar errores globales de JavaScript
    window.addEventListener('error', (event) => {
      this.handleError(event.error || new Error(event.message), 'Global Error', {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
      // No prevenir el comportamiento por defecto para permitir que las herramientas de desarrollo lo muestren
    });
  }

  /**
   * Maneja un error
   * @param {Error|string} error - Error o mensaje de error
   * @param {string} source - Fuente del error
   * @param {Object} metadata - Metadatos adicionales
   */
  handleError(error, source = 'Application', metadata = {}) {
    const errorObj = this.normalizeError(error);
    const errorInfo = {
      message: errorObj.message,
      stack: errorObj.stack,
      source,
      timestamp: new Date().toISOString(),
      metadata
    };

    // Registrar el error en la consola
    console.error(`[${source}] ${errorObj.message}`, errorObj, metadata);

    // Notificar a todos los listeners
    this.notifyListeners(errorInfo);

    // Aquí se podría enviar el error a un servicio de monitoreo como Sentry
    this.reportToMonitoringService(errorInfo);

    return errorInfo;
  }

  /**
   * Normaliza un error a un objeto Error
   * @param {Error|string|any} error - Error a normalizar
   * @returns {Error} - Objeto Error normalizado
   */
  normalizeError(error) {
    if (error instanceof Error) {
      return error;
    }

    if (typeof error === 'string') {
      return new Error(error);
    }

    try {
      // Intentar convertir el error a string para crear un mensaje
      const errorMessage = JSON.stringify(error);
      const normalizedError = new Error(errorMessage);
      normalizedError.originalError = error;
      return normalizedError;
    } catch (e) {
      return new Error('Unknown error');
    }
  }

  /**
   * Añade un listener para errores
   * @param {Function} listener - Función a llamar cuando ocurra un error
   * @returns {Function} - Función para eliminar el listener
   */
  addListener(listener) {
    this.errorListeners.push(listener);
    return () => this.removeListener(listener);
  }

  /**
   * Elimina un listener
   * @param {Function} listener - Listener a eliminar
   */
  removeListener(listener) {
    this.errorListeners = this.errorListeners.filter(l => l !== listener);
  }

  /**
   * Notifica a todos los listeners de un error
   * @param {Object} errorInfo - Información del error
   */
  notifyListeners(errorInfo) {
    this.errorListeners.forEach(listener => {
      try {
        listener(errorInfo);
      } catch (error) {
        console.error('Error en listener de errores:', error);
      }
    });
  }

  /**
   * Envía el error a un servicio de monitoreo
   * @param {Object} errorInfo - Información del error
   */
  reportToMonitoringService(errorInfo) {
    // Implementación simulada - en producción, aquí se enviaría a Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === 'production') {
      // Aquí iría la lógica para enviar a un servicio real
      console.log('[ErrorMonitoring] Error reported:', errorInfo);
    }
  }

  /**
   * Crea un objeto de notificación a partir de un error
   * @param {Error|string} error - Error o mensaje de error
   * @param {string} title - Título de la notificación
   * @returns {Object} - Objeto de notificación
   */
  createErrorNotification(error, title = 'Error') {
    const errorObj = this.normalizeError(error);
    
    return {
      id: Date.now().toString(),
      title,
      message: errorObj.message,
      type: NOTIFICATION_TYPES.ERROR,
      timestamp: new Date(),
      read: false,
      autoClose: true,
      duration: 5000
    };
  }

  /**
   * Maneja un error de API
   * @param {Error} error - Error de la API
   * @param {string} fallbackMessage - Mensaje por defecto si no se puede extraer del error
   * @returns {Object} - Información del error procesada
   */
  handleApiError(error, fallbackMessage = 'Error en la solicitud') {
    // Extraer información relevante del error
    const status = error.status || (error.response ? error.response.status : null);
    const message = error.message || (error.response && error.response.data ? error.response.data.message : fallbackMessage);
    
    // Manejar tipos específicos de errores según el código de estado
    let userMessage = message;
    let type = NOTIFICATION_TYPES.ERROR;
    
    switch (status) {
      case 401:
        userMessage = 'Sesión expirada o no autorizada. Por favor, inicie sesión nuevamente.';
        break;
      case 403:
        userMessage = 'No tiene permisos para realizar esta acción.';
        break;
      case 404:
        userMessage = 'El recurso solicitado no existe.';
        type = NOTIFICATION_TYPES.WARNING;
        break;
      case 422:
        userMessage = 'Los datos enviados no son válidos.';
        type = NOTIFICATION_TYPES.WARNING;
        break;
      case 429:
        userMessage = 'Demasiadas solicitudes. Por favor, inténtelo más tarde.';
        type = NOTIFICATION_TYPES.WARNING;
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        userMessage = 'Error en el servidor. Por favor, inténtelo más tarde.';
        break;
      default:
        if (!navigator.onLine) {
          userMessage = 'No hay conexión a Internet. Por favor, verifique su conexión e inténtelo nuevamente.';
          type = NOTIFICATION_TYPES.WARNING;
        }
        break;
    }
    
    // Registrar el error original
    this.handleError(error, 'API Error', { status, originalMessage: message });
    
    // Devolver información procesada para mostrar al usuario
    return {
      message: userMessage,
      type,
      status,
      originalError: error
    };
  }
}

// Crear una instancia única
const errorHandler = new ErrorHandler();

export default errorHandler;