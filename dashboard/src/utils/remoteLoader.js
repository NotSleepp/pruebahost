import { defineAsyncComponent, h } from 'vue';
import { REMOTE_MODULES, LOADING_STATES } from './constants';
import { emitRemoteModuleLoaded, emitRemoteModuleError } from './events';

/**
 * Carga un componente remoto de forma dinámica
 * @param {string} moduleName - Nombre del módulo remoto (ej: 'admin-module')
 * @param {string} componentName - Nombre del componente a cargar (ej: 'AdminApp')
 * @param {Object} options - Opciones adicionales
 * @returns {Object} - Componente asíncrono de Vue
 */
export const loadRemoteComponent = (moduleName, componentName, options = {}) => {
  const moduleConfig = REMOTE_MODULES[moduleName.toUpperCase()];
  
  if (!moduleConfig) {
    console.error(`Módulo remoto no configurado: ${moduleName}`);
    return defineErrorComponent(`Módulo remoto no configurado: ${moduleName}`);
  }
  
  const componentPath = moduleConfig.components[componentName];
  
  if (!componentPath) {
    console.error(`Componente no configurado en el módulo ${moduleName}: ${componentName}`);
    return defineErrorComponent(`Componente no configurado en el módulo ${moduleName}: ${componentName}`);
  }
  
  // Opciones por defecto
  const defaultOptions = {
    timeout: 10000,
    retries: 3,
    retryDelay: 1000,
    loadingComponent: null,
    errorComponent: null,
    onSuccess: null,
    onError: null
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  return defineAsyncComponent({
    loader: async () => {
      let attempts = 0;
      let lastError = null;
      
      while (attempts < mergedOptions.retries) {
        try {
          attempts++;
          
          // Intentar cargar el módulo remoto
          const factory = await window[moduleConfig.name].get(componentPath);
          const Component = factory();
          
          // Emitir evento de éxito
          const moduleInfo = {
            moduleName,
            componentName,
            status: LOADING_STATES.SUCCESS
          };
          
          emitRemoteModuleLoaded(moduleInfo);
          
          if (mergedOptions.onSuccess) {
            mergedOptions.onSuccess(moduleInfo);
          }
          
          return Component;
        } catch (error) {
          console.error(`Error al cargar el componente remoto ${moduleName}/${componentName} (intento ${attempts}/${mergedOptions.retries}):`, error);
          
          lastError = error;
          
          // Si no es el último intento, esperar antes de reintentar
          if (attempts < mergedOptions.retries) {
            await new Promise(resolve => setTimeout(resolve, mergedOptions.retryDelay));
          }
        }
      }
      
      // Si llegamos aquí, todos los intentos fallaron
      const errorInfo = {
        moduleName,
        componentName,
        error: lastError,
        status: LOADING_STATES.ERROR
      };
      
      emitRemoteModuleError(errorInfo);
      
      if (mergedOptions.onError) {
        mergedOptions.onError(errorInfo);
      }
      
      throw new Error(`No se pudo cargar el componente remoto ${moduleName}/${componentName} después de ${mergedOptions.retries} intentos`);
    },
    timeout: mergedOptions.timeout,
    loadingComponent: mergedOptions.loadingComponent,
    errorComponent: mergedOptions.errorComponent,
    // Suspense en Vue 3
    suspensible: true,
    onError(error, retry, fail, attempts) {
      // Esta función se llama cuando falla la carga
      console.error(`Error al cargar el componente remoto ${moduleName}/${componentName}:`, error);
      
      if (attempts < mergedOptions.retries) {
        // Reintentar después de un retraso
        setTimeout(() => {
          retry();
        }, mergedOptions.retryDelay);
      } else {
        // Dejar que falle después de agotar los reintentos
        fail();
      }
    }
  });
};

/**
 * Carga un módulo remoto completo
 * @param {string} moduleName - Nombre del módulo remoto
 * @returns {Promise} - Promesa que se resuelve cuando el módulo está cargado
 */
export const loadRemoteModule = async (moduleName) => {
  const moduleConfig = REMOTE_MODULES[moduleName.toUpperCase()];
  
  if (!moduleConfig) {
    throw new Error(`Módulo remoto no configurado: ${moduleName}`);
  }
  
  try {
    // Verificar si el módulo ya está cargado
    if (window[moduleConfig.name]) {
      return window[moduleConfig.name];
    }
    
    // Cargar el script del módulo remoto
    await loadRemoteScript(moduleConfig.url);
    
    // Verificar que se haya cargado correctamente
    if (!window[moduleConfig.name]) {
      throw new Error(`El módulo ${moduleName} no se cargó correctamente`);
    }
    
    return window[moduleConfig.name];
  } catch (error) {
    console.error(`Error al cargar el módulo remoto ${moduleName}:`, error);
    throw error;
  }
};

/**
 * Carga un script remoto
 * @param {string} url - URL del script a cargar
 * @returns {Promise} - Promesa que se resuelve cuando el script está cargado
 */
export const loadRemoteScript = (url) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.type = 'text/javascript';
    script.async = true;
    
    script.onload = () => {
      console.log(`Script remoto cargado: ${url}`);
      resolve();
    };
    
    script.onerror = (error) => {
      console.error(`Error al cargar el script remoto: ${url}`, error);
      reject(new Error(`Error al cargar el script remoto: ${url}`));
    };
    
    document.head.appendChild(script);
  });
};

/**
 * Crea un componente de error para mostrar cuando falla la carga
 * @param {string} message - Mensaje de error
 * @returns {Object} - Componente de Vue
 */
const defineErrorComponent = (message) => ({
  name: 'RemoteComponentError',
  setup() {
    return () => {
      return {
        render() {
          return h('div', { class: 'remote-error' }, [
            h('div', { class: 'remote-error-icon' }, '⚠️'),
            h('div', { class: 'remote-error-message' }, message),
            h('div', { class: 'remote-error-action' }, [
              h('button', { onClick: () => window.location.reload() }, 'Reintentar')
            ])
          ]);
        }
      };
    };
  }
});

/**
 * Verifica si un módulo remoto está disponible
 * @param {string} moduleName - Nombre del módulo remoto
 * @returns {Promise<boolean>} - Promesa que se resuelve con true si el módulo está disponible
 */
export const isRemoteModuleAvailable = async (moduleName) => {
  try {
    await loadRemoteModule(moduleName);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Precarga todos los módulos remotos configurados
 * @returns {Promise<Object>} - Promesa que se resuelve con un objeto de resultados
 */
export const preloadAllRemoteModules = async () => {
  const results = {};
  
  const moduleNames = Object.keys(REMOTE_MODULES);
  
  for (const moduleName of moduleNames) {
    try {
      await loadRemoteModule(moduleName.toLowerCase());
      results[moduleName] = { success: true };
    } catch (error) {
      results[moduleName] = { success: false, error };
    }
  }
  
  return results;
};

export default {
  loadRemoteComponent,
  loadRemoteModule,
  loadRemoteScript,
  isRemoteModuleAvailable,
  preloadAllRemoteModules
};