import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store';
import routes from './routes';

// Creación del router
const router = createRouter({
  history: createWebHistory(),
  routes,
  // Scroll al inicio al cambiar de página
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// Guardias de navegación
router.beforeEach((to, from, next) => {
  // Actualizar el título de la página
  document.title = `${to.meta.title || 'Dashboard'} | Module Federation`;
  
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isGuestRoute = to.matched.some(record => record.meta.guest);
  
  // Verificar autenticación
  if (requiresAuth && !authStore.isAuthenticated) {
    // Guardar la ruta a la que se intentaba acceder para redireccionar después del login
    authStore.setRedirectPath(to.fullPath);
    next({ name: 'login' });
  } else if (isGuestRoute && authStore.isAuthenticated) {
    // Si el usuario ya está autenticado y trata de acceder a una ruta de invitado (como login)
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router;