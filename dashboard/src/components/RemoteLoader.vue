<template>
  <div class="remote-loader">
    <div v-if="loading" class="remote-loader__loading">
      <div class="spinner"></div>
      <p>Cargando componente...</p>
    </div>
    <div v-else-if="error" class="remote-loader__error alert alert-error">
      <p>{{ error }}</p>
      <button @click="retry" class="btn btn-sm mt-2">Reintentar</button>
    </div>
    <component v-else :is="remoteComponent" v-bind="props"></component>
  </div>
</template>

<script>
import { ref, defineComponent, shallowRef, onMounted } from 'vue';

export default defineComponent({
  name: 'RemoteLoader',
  props: {
    // Nombre del módulo remoto (ej: 'admin-module')
    module: {
      type: String,
      required: true
    },
    // Nombre del componente a cargar (ej: './AdminApp')
    component: {
      type: String,
      required: true
    },
    // Props a pasar al componente remoto
    props: {
      type: Object,
      default: () => ({})
    },
    // Tiempo máximo de espera en ms
    timeout: {
      type: Number,
      default: 10000
    }
  },
  emits: ['loaded', 'error'],
  setup(props, { emit }) {
    const loading = ref(true);
    const error = ref(null);
    const remoteComponent = shallowRef(null);
    let timeoutId = null;

    const loadRemoteComponent = async () => {
      loading.value = true;
      error.value = null;
      
      try {
        // Configurar un timeout para la carga
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error(`Tiempo de espera agotado al cargar ${props.module}/${props.component}`));
          }, props.timeout);
        });

        // Intentar cargar el componente remoto
        const loadComponentPromise = (async () => {
          // Importación dinámica del componente remoto
          const remote = await import(/* @vite-ignore */ props.module);
          
          // Verificar si el componente existe en el módulo
          if (!remote[props.component.replace('./', '')]) {
            throw new Error(`Componente ${props.component} no encontrado en el módulo ${props.module}`);
          }
          
          // Cargar el componente específico
          return await remote[props.component.replace('./', '')]();
        })();

        // Carrera entre el timeout y la carga del componente
        const component = await Promise.race([loadComponentPromise, timeoutPromise]);
        
        // Limpiar el timeout si la carga fue exitosa
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }

        // Asignar el componente cargado
        remoteComponent.value = component.default || component;
        emit('loaded', remoteComponent.value);
      } catch (err) {
        console.error('Error al cargar el componente remoto:', err);
        error.value = `Error al cargar el componente: ${err.message}`;
        emit('error', err);
      } finally {
        loading.value = false;
      }
    };

    const retry = () => {
      loadRemoteComponent();
    };

    onMounted(() => {
      loadRemoteComponent();
    });

    return {
      loading,
      error,
      remoteComponent,
      retry
    };
  }
});
</script>

<style>
.remote-loader {
  width: 100%;
  min-height: 100px;
}

.remote-loader__loading,
.remote-loader__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  margin-bottom: var(--spacing-md);
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.dark-theme .spinner {
  border-color: rgba(255, 255, 255, 0.1);
  border-left-color: var(--color-primary);
}
</style>