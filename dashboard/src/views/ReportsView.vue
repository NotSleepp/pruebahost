<template>
  <div class="reports-view">
    <div class="reports-header">
      <h1>Panel de Reportes</h1>
      <div class="reports-actions">
        <button class="btn btn-outline btn-sm" @click="refreshData">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
            <path fill="none" d="M0 0h24v24H0z"/>
            <path d="M5.463 4.433A9.961 9.961 0 0 1 12 2c5.523 0 10 4.477 10 10 0 2.136-.67 4.116-1.81 5.74L17 12h3A8 8 0 0 0 6.46 6.228l-.997-1.795zm13.074 15.134A9.961 9.961 0 0 1 12 22C6.477 22 2 17.523 2 12c0-2.136.67-4.116 1.81-5.74L7 12H4a8 8 0 0 0 13.54 5.772l.997 1.795z" fill="currentColor"/>
          </svg>
          Actualizar
        </button>
      </div>
    </div>

    <div class="reports-content">
      <!-- Router view para rutas anidadas -->
      <router-view v-if="remoteModuleAvailable" />

      <!-- Estado de carga -->
      <div v-else-if="isLoading" class="reports-loading">
        <div class="spinner"></div>
        <p>Cargando módulo de reportes...</p>
      </div>

      <!-- Error de carga -->
      <div v-else-if="error" class="reports-error">
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
      <div v-else class="reports-fallback">
        <div class="fallback-content">
          <div class="fallback-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
              <path fill="none" d="M0 0h24v24H0z"/>
              <path d="M5 8v12h14V8H5zm0-2h14V4H5v2zm15 16H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1zM7 15h10v2H7v-2zm0-4h10v2H7v-2z" fill="currentColor"/>
            </svg>
          </div>
          <h2>Módulo de reportes</h2>
          <p>El módulo de reportes no está disponible actualmente. Puede que esté en desarrollo o no se haya configurado correctamente.</p>
          
          <div class="fallback-navigation">
            <h3>Navegación</h3>
            <ul class="fallback-menu">
              <li>
                <router-link to="/reports" class="fallback-link">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                    <path fill="none" d="M0 0h24v24H0z"/>
                    <path d="M11 7h2v10h-2V7zm4 4h2v6h-2v-6zm-8 2h2v4H7v-4zm8-9H5v16h14V4h-6zM3 2.992C3 2.444 3.447 2 3.999 2H16l5 5v13.993A1 1 0 0 1 20.007 22H3.993A1 1 0 0 1 3 21.008V2.992z" fill="currentColor"/>
                  </svg>
                  Panel de Reportes
                </router-link>
              </li>
              <li>
                <router-link to="/reports/sales" class="fallback-link">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                    <path fill="none" d="M0 0h24v24H0z"/>
                    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-3.5-6H14a.5.5 0 1 0 0-1h-4a2.5 2.5 0 1 1 0-5h1V6h2v2h2.5v2H10a.5.5 0 1 0 0 1h4a2.5 2.5 0 1 1 0 5h-1v2h-2v-2H8.5v-2z" fill="currentColor"/>
                  </svg>
                  Reporte de Ventas
                </router-link>
              </li>
              <li>
                <router-link to="/reports/user-activity" class="fallback-link">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                    <path fill="none" d="M0 0h24v24H0z"/>
                    <path d="M12 14v2a6 6 0 0 0-6 6H4a8 8 0 0 1 8-8zm0-1c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm9 6h1v5h-8v-5h1v-1a3 3 0 0 1 6 0v1zm-2 0v-1a1 1 0 0 0-2 0v1h2z" fill="currentColor"/>
                  </svg>
                  Actividad de Usuarios
                </router-link>
              </li>
              <li>
                <router-link to="/reports/custom" class="fallback-link">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                    <path fill="none" d="M0 0h24v24H0z"/>
                    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm2-1.645V14h-2v-1.5a1 1 0 0 1 1-1 1.5 1.5 0 1 0-1.471-1.794l-1.962-.393A3.501 3.501 0 1 1 13 13.355z" fill="currentColor"/>
                  </svg>
                  Reportes Personalizados
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { useAppStore } from '@/store';
import { isRemoteModuleAvailable } from '@/utils/remoteLoader';
import { REMOTE_MODULES } from '@/utils/constants';
import { emitRemoteModuleLoaded, emitRemoteModuleError } from '@/utils/events';

export default {
  name: 'ReportsView',
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
        // Comprobar si el módulo de reportes está disponible
        const available = await isRemoteModuleAvailable('reports-module');
        remoteModuleAvailable.value = available;

        if (!available) {
          console.warn('Módulo de reportes no disponible, usando fallback');
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
        emitRemoteModuleLoaded('reports-module', { refresh: true });
      } else {
        // Si no está disponible, reintentar carga
        retryLoading();
      }
    };

    // Manejar eventos de módulo remoto
    const handleRemoteModuleEvent = (event) => {
      const { moduleName, data } = event.detail;
      
      if (moduleName === 'reports-module') {
        console.log('Evento recibido del módulo de reportes:', data);
        // Aquí puedes manejar eventos específicos del módulo
      }
    };

    onMounted(() => {
      checkModuleAvailability();
      window.addEventListener('remote-module-event', handleRemoteModuleEvent);
    });

    onUnmounted(() => {
      window.removeEventListener('remote-module-event', handleRemoteModuleEvent);
    });

    return {
      isLoading,
      error,
      remoteModuleAvailable,
      retryLoading,
      refreshData
    };
  }
};
</script>

<style scoped>
.reports-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem;
}

.reports-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.reports-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.reports-actions {
  display: flex;
  gap: 0.5rem;
}

.reports-content {
  flex: 1;
  position: relative;
}

.reports-loading,
.reports-error,
.reports-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--color-primary);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon,
.fallback-icon {
  margin-bottom: 1rem;
  color: var(--color-error);
}

.fallback-icon {
  color: var(--color-primary);
}

.fallback-content {
  max-width: 600px;
  margin: 0 auto;
}

.fallback-navigation {
  margin-top: 2rem;
  text-align: left;
  width: 100%;
}

.fallback-menu {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
}

.fallback-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  color: var(--color-text);
  text-decoration: none;
  transition: background-color 0.2s;
}

.fallback-link:hover {
  background-color: var(--color-bg-hover);
}

.fallback-link svg {
  margin-right: 0.75rem;
}

/* Tema oscuro */
:root.dark .spinner {
  border-color: rgba(255, 255, 255, 0.1);
  border-top-color: var(--color-primary);
}
</style>