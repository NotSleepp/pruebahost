<template>
  <div class="admin-view">
    <div class="admin-header">
      <h1>Panel de Administración</h1>
      <div class="admin-actions">
        <button class="btn btn-outline btn-sm" @click="refreshData">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
            <path fill="none" d="M0 0h24v24H0z"/>
            <path d="M5.463 4.433A9.961 9.961 0 0 1 12 2c5.523 0 10 4.477 10 10 0 2.136-.67 4.116-1.81 5.74L17 12h3A8 8 0 0 0 6.46 6.228l-.997-1.795zm13.074 15.134A9.961 9.961 0 0 1 12 22C6.477 22 2 17.523 2 12c0-2.136.67-4.116 1.81-5.74L7 12H4a8 8 0 0 0 13.54 5.772l.997 1.795z" fill="currentColor"/>
          </svg>
          Actualizar
        </button>
      </div>
    </div>

    <div class="admin-content">
      <!-- Cargador de módulo remoto -->
      <RemoteLoader 
        v-if="remoteModuleAvailable" 
        remote="admin-module" 
        module="./AdminApp" 
        @loaded="handleModuleLoaded"
        @error="handleModuleError"
      />

      <!-- Estado de carga -->
      <div v-else-if="isLoading" class="admin-loading">
        <div class="spinner"></div>
        <p>Cargando módulo de administración...</p>
      </div>

      <!-- Error de carga -->
      <div v-else-if="error" class="admin-error">
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

      <!-- Fallback cuando el módulo no está disponible -->
      <div v-else class="admin-fallback">
        <div class="fallback-content">
          <div class="fallback-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
              <path fill="none" d="M0 0h24v24H0z"/>
              <path d="M5 8v12h14V8H5zm0-2h14V4H5v2zm15 16H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1zM7 15h10v2H7v-2zm0-4h10v2H7v-2z" fill="currentColor"/>
            </svg>
          </div>
          <h2>Módulo de administración</h2>
          <p>El módulo de administración no está disponible actualmente. Puede que esté en desarrollo o no se haya configurado correctamente.</p>
          
          <div class="fallback-navigation">
            <h3>Navegación</h3>
            <ul class="fallback-menu">
              <li>
                <router-link to="/admin/users" class="fallback-link">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                    <path fill="none" d="M0 0h24v24H0z"/>
                    <path d="M4 22a8 8 0 1 1 16 0h-2a6 6 0 1 0-12 0H4zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" fill="currentColor"/>
                  </svg>
                  Gestión de Usuarios
                </router-link>
              </li>
              <li>
                <router-link to="/admin/menu-config" class="fallback-link">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                    <path fill="none" d="M0 0h24v24H0z"/>
                    <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" fill="currentColor"/>
                  </svg>
                  Configuración de Menú
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Router view para rutas anidadas -->
    <router-view v-if="remoteModuleAvailable" />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { useAppStore } from '@/store';
import RemoteLoader from '@/components/RemoteLoader.vue';
import { isRemoteModuleAvailable } from '@/utils/remoteLoader';
import { REMOTE_MODULES } from '@/utils/constants';
import { emitRemoteModuleLoaded, emitRemoteModuleError } from '@/utils/events';

export default {
  name: 'AdminView',
  components: {
    RemoteLoader
  },
  setup() {
    const appStore = useAppStore();
    const isLoading = ref(true);
    const error = ref(null);
    const remoteModuleAvailable = ref(false);

    // Comprobar si el módulo remoto está disponible
    const checkModuleAvailability = async () => {
      isLoading.value = true;
      error.value = null;

      try {
        // Comprobar si el módulo admin está disponible
        const available = await isRemoteModuleAvailable('admin-module');
        remoteModuleAvailable.value = available;

        if (!available) {
          console.warn('Módulo de administración no disponible, usando fallback');
        }
      } catch (err) {
        error.value = err.message || 'Error al verificar disponibilidad del módulo';
        console.error('Error al verificar módulo:', err);
      } finally {
        isLoading.value = false;
      }
    };

    // Reintentar carga del módulo
    const retryLoading = () => {
      checkModuleAvailability();
    };

    // Actualizar datos
    const refreshData = () => {
      if (remoteModuleAvailable.value) {
        // Emitir evento para que el módulo remoto actualice sus datos
        emitRemoteModuleLoaded('admin-module', { refresh: true });
      } else {
        // Si no está disponible, reintentar carga
        retryLoading();
      }
    };

    // Manejar carga exitosa del módulo
    const handleModuleLoaded = (module) => {
      console.log('Módulo de administración cargado correctamente');
      // Emitir evento para notificar que el módulo ha sido cargado
      emitRemoteModuleLoaded('admin-module', module);
    };

    // Manejar error de carga del módulo
    const handleModuleError = (err) => {
      error.value = err.message || 'Error al cargar el módulo de administración';
      console.error('Error al cargar módulo de administración:', err);
      // Emitir evento de error
      emitRemoteModuleError('admin-module', err);
    };

    onMounted(() => {
      checkModuleAvailability();
    });

    return {
      isLoading,
      error,
      remoteModuleAvailable,
      retryLoading,
      refreshData,
      handleModuleLoaded,
      handleModuleError
    };
  }
};
</script>

<style>
.admin-view {
  padding: 1.5rem;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.admin-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.admin-actions {
  display: flex;
  gap: 0.5rem;
}

.admin-content {
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  min-height: 400px;
}

.admin-loading,
.admin-error,
.admin-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  min-height: 400px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(var(--primary-rgb), 0.3);
  border-radius: 50%;
  border-top-color: var(--primary);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.admin-loading p {
  color: var(--text-muted);
  font-size: 0.9375rem;
}

.error-icon,
.fallback-icon {
  margin-bottom: 1rem;
  color: var(--error);
}

.fallback-icon {
  color: var(--text-muted);
}

.admin-error h2,
.admin-fallback h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.admin-error p,
.admin-fallback p {
  color: var(--text-muted);
  margin-bottom: 1.5rem;
  max-width: 500px;
}

.fallback-content {
  max-width: 600px;
}

.fallback-navigation {
  margin-top: 2rem;
  text-align: left;
  width: 100%;
}

.fallback-navigation h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.fallback-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.fallback-menu li {
  margin-bottom: 0.5rem;
}

.fallback-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  color: var(--text-color);
  text-decoration: none;
  transition: background-color 0.2s;
}

.fallback-link:hover {
  background-color: var(--bg-color-light);
}

.fallback-link.router-link-active {
  background-color: var(--primary-light);
  color: var(--primary);
}
</style>