import { createPinia } from 'pinia';
import { markRaw } from 'vue';
import router from '@/router';

// Crear la instancia de Pinia
const pinia = createPinia();

// Añadir el router a Pinia para poder usarlo en las stores
pinia.use(({ store }) => {
  store.router = markRaw(router);
});

// Exportar las stores individuales
export { useAuthStore } from './auth';
export { useAppStore } from './app';

export default pinia;