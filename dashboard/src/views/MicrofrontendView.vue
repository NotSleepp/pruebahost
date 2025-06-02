<template>
  <div class="microfrontend-view">
    <div v-if="isLoading" class="microfrontend-loading">
      <div class="spinner"></div>
      <p>Cargando módulo {{ moduleName }}...</p>
    </div>
    
    <div v-else-if="error" class="microfrontend-error">
      <div class="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
          <path fill="none" d="M0 0h24v24H0z"/>
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" fill="currentColor"/>
        </svg>
      </div>
      <h2>Error al cargar el módulo</h2>
      <p>{{ error }}</p>
      <button class="btn btn-primary" @click="retryLoading">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
          <path fill="none" d="M0 0h24v24H0z"/>
          <path d="M5.463 4.433A9.961 9.961 0 0 1 12 2c5.523 0 10 4.477 10 10 0 2.136-.67 4.116-1.81 5.74L17 12h3A8 8 0 0 0 6.46 6.228l-.997-1.795zm13.074 15.134A9.961 9.961 0 0 1 12 22C6.477 22 2 17.523 2 12c0-2.136.67-4.116 1.81-5.74L7 12H4a8 8 0 0 0 13.54 5.772l.997 1.795z" fill="currentColor"/>
        </svg>
        Reintentar
      </button>
    </div>
    
    <div v-else-if="!remoteModuleAvailable" class="microfrontend-fallback">
      <div class="fallback-content">
        <div class="fallback-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
            <path fill="none" d="M0 0h24v24H0z"/>
            <path d="M5 8v12h14V8H5zm0-2h14V4H5v2zm15 16H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1zM7 15h10v2H7v-2zm0-4h10v2H7v-2z" fill="currentColor"/>
          </svg>
        </div>
        <h2>Módulo {{ moduleDisplayName }}</h2>
        <p>El módulo {{ moduleDisplayName }} no está disponible actualmente. Puede que esté en desarrollo o no se haya configurado correctamente.</p>
        
        <div v-if="fallbackNavigation && fallbackNavigation.length > 0" class="fallback-navigation">
          <h3>Navegación</h3>
          <ul class="fallback-menu">
            <li v-for="(item, index) in fallbackNavigation" :key="index">
              <router-link :to="item.path" class="fallback-link">
                <span v-html="item.icon"></span>
                {{ item.label }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    
    <div v-else class="microfrontend-container">
      <component :is="remoteComponent" />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, defineComponent, markRaw } from 'vue';
import { useRoute } from 'vue-router';
import { loadRemoteComponent, isRemoteModuleAvailable } from '@/utils/remoteLoader';
import { REMOTE_MODULES } from '@/utils/constants';
import { emitRemoteModuleLoaded, emitRemoteModuleError } from '@/utils/events';

export default defineComponent({
  name: 'MicrofrontendView',
  
  props: {
    moduleName: {
      type: String,
      required: true
    },
    componentName: {
      type: String,
      default: 'ReportsApp'
    },
    fallbackNavigation: {
      type: Array,
      default: () => []
    }
  },
  
  setup(props) {
    const route = useRoute();
    const isLoading = ref(true);
    const error = ref(null);
    const remoteModuleAvailable = ref(false);
    const remoteComponent = ref(null);
    
    // Nombre para mostrar del módulo (primera letra en mayúscula)
    const moduleDisplayName = computed(() => {
      const name = props.moduleName.replace('-module', '');
      return name.charAt(0).toUpperCase() + name.slice(1);
    });
    
    // Cargar el componente remoto
    const loadRemoteModule = async () => {
      isLoading.value = true;
      error.value = null;
      
      try {
        // Verificar si el módulo está disponible
        const available = await isRemoteModuleAvailable(props.moduleName);
        remoteModuleAvailable.value = available;
        
        if (available) {
          console.log(`Cargando componente ${props.componentName} desde ${props.moduleName}...`);
          
          // Convertir el nombre del módulo a la clave de REMOTE_MODULES
          const moduleKey = props.moduleName.replace('-module', '').toUpperCase();
          console.log(`Buscando configuración para el módulo: ${moduleKey} en`, REMOTE_MODULES);
          
          const moduleConfig = REMOTE_MODULES[moduleKey];
          
          if (!moduleConfig) {
            throw new Error(`Configuración no encontrada para el módulo ${props.moduleName}. Clave buscada: ${moduleKey}`);
          }
          
          // Obtener el nombre del componente a cargar
          const componentPath = moduleConfig.components[props.componentName];
          
          if (!componentPath) {
            throw new Error(`Componente ${props.componentName} no configurado en ${props.moduleName}`);
          }
          
          console.log(`Cargando componente desde ${props.moduleName}: ${componentPath}`);
          
          // Cargar el componente directamente via dynamic import
          try {
            console.log(`Intentando import directo de '${moduleConfig.name}${componentPath.startsWith('./') ? componentPath.substring(1) : componentPath}'`);
            const module = await import(`${moduleConfig.name}${componentPath.startsWith('./') ? componentPath.substring(1) : componentPath}`);
            const component = module.default || module;
            
            // Guardar el componente (usar markRaw para evitar que Vue lo haga reactivo)
            remoteComponent.value = markRaw(component);
            
            console.log(`Componente ${props.componentName} cargado correctamente desde ${props.moduleName}`);
            emitRemoteModuleLoaded(props.moduleName, { 
              route: route.fullPath,
              params: route.params 
            });
          } catch (importError) {
            console.error(`Error al importar directamente: ${importError}. Intentando con loadRemoteComponent`);
            
            // Fallback a loadRemoteComponent si el import directo falla
            try {
              const remoteComponent = await loadRemoteComponent(moduleConfig.name, componentPath, {
                onSuccess: (moduleInfo) => {
                  console.log(`Componente ${props.componentName} cargado correctamente desde ${props.moduleName}`);
                  emitRemoteModuleLoaded(props.moduleName, { 
                    route: route.fullPath,
                    params: route.params 
                  });
                },
                onError: (errorInfo) => {
                  console.error(`Error al cargar componente ${props.componentName} desde ${props.moduleName}:`, errorInfo);
                  emitRemoteModuleError(props.moduleName, { 
                    error: errorInfo.error,
                    route: route.fullPath 
                  });
                  error.value = `Error al cargar el componente: ${errorInfo.error.message || 'Error desconocido'}`;
                  remoteModuleAvailable.value = false;
                }
              });
              
              // Guardar el componente (usar markRaw para evitar que Vue lo haga reactivo)
              remoteComponent.value = markRaw(remoteComponent);
            } catch (remoteError) {
              console.error(`Error al cargar con loadRemoteComponent: ${remoteError}`);
              error.value = `Error al cargar el componente: ${remoteError.message || 'Error desconocido'}`;
              remoteModuleAvailable.value = false;
            }
          } // Añadiendo llave de cierre faltante aquí
          
        } else {
          console.warn(`Módulo ${props.moduleName} no disponible, usando fallback`);
        }
      } catch (err) {
        error.value = err.message || 'Error al cargar el módulo';
        remoteModuleAvailable.value = false;
        console.error(`Error al cargar el módulo ${props.moduleName}:`, err);
      } finally {
        isLoading.value = false;
      }
    };
    
    // Reintentar la carga del módulo
    const retryLoading = () => {
      loadRemoteModule();
    };
    
    // Actualizar datos del módulo remoto
    const refreshData = () => {
      if (remoteModuleAvailable.value) {
        // Emitir evento para que el módulo remoto actualice sus datos
        emitRemoteModuleLoaded(props.moduleName, { refresh: true });
      } else {
        // Si no está disponible, reintentar carga
        retryLoading();
      }
    };
    
    // Manejar eventos del módulo remoto
    const handleRemoteModuleEvent = (event) => {
      const { moduleName, data } = event.detail;
      
      if (moduleName === props.moduleName) {
        console.log(`Evento recibido del módulo ${moduleName}:`, data);
        // Aquí se pueden manejar eventos específicos del módulo
      }
    };
    
    onMounted(() => {
      loadRemoteModule();
      window.addEventListener('remote-module-event', handleRemoteModuleEvent);
    });
    
    onUnmounted(() => {
      window.removeEventListener('remote-module-event', handleRemoteModuleEvent);
    });
    
    return {
      isLoading,
      error,
      remoteModuleAvailable,
      remoteComponent,
      moduleDisplayName,
      retryLoading,
      refreshData
    };
  }
});
</script>

<style scoped>
.microfrontend-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.microfrontend-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.microfrontend-loading,
.microfrontend-error,
.microfrontend-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 2rem;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon, 
.fallback-icon {
  margin-bottom: 1rem;
  color: var(--primary);
}

.fallback-content {
  max-width: 600px;
}

.fallback-navigation {
  margin-top: 2rem;
  width: 100%;
  text-align: left;
}

.fallback-navigation h3 {
  margin-bottom: 1rem;
  font-size: 1rem;
  color: var(--text-muted);
}

.fallback-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.fallback-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  color: var(--text-primary);
  text-decoration: none;
  transition: background-color 0.2s;
}

.fallback-link:hover {
  background-color: var(--hover-bg);
}

.fallback-link span {
  margin-right: 0.75rem;
  display: flex;
  align-items: center;
}

.fallback-link svg {
  width: 18px;
  height: 18px;
}
</style>
