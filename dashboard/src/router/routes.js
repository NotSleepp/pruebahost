// Importación de vistas locales
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import NotFound from '@/views/NotFound.vue';
import MicrofrontendView from '@/views/MicrofrontendView.vue';

// Definición de rutas
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Dashboard',
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      title: 'Iniciar Sesión',
      layout: 'blank',
      guest: true
    }
  },
  {
    path: '/admin',
    name: 'admin',
    meta: {
      title: 'Administración',
      requiresAuth: true
    },
    // Uso del componente genérico para microfrontends
    component: MicrofrontendView,
    // Pasamos props como una función que devuelve un objeto
    props: () => ({
      moduleName: 'admin-module',
      componentName: 'AdminApp',
      fallbackNavigation: [
        { path: '/admin/users', label: 'Gestión de Usuarios', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path fill="none" d="M0 0h24v24H0z"/><path d="M4 22a8 8 0 1 1 16 0H4zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6z" fill="currentColor"/></svg>' },
        { path: '/admin/menu-config', label: 'Configuración del Menú', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path fill="none" d="M0 0h24v24H0z"/><path d="M3.34 17a10 10 0 1 1 17.32 0H3.34zm7.46-7.78a2.5 2.5 0 1 0-4.92 0h4.92zm5.25 0a2.5 2.5 0 1 0-4.92 0h4.92z" fill="currentColor"/></svg>' }
      ]
    }),

    // Rutas anidadas que serán manejadas por el módulo remoto
    children: [
      {
        path: 'users',
        name: 'admin-users',
        meta: {
          title: 'Gestión de Usuarios',
          requiresAuth: true
        },
        // Carga dinámica del componente remoto
        component: () => import('admin-module/AdminApp')
      },
      {
        path: 'menu-config',
        name: 'admin-menu-config',
        meta: {
          title: 'Configuración del Menú',
          requiresAuth: true
        },
        // Carga dinámica del componente remoto
        component: () => import('admin-module/AdminApp')
      }
    ]
  },
  {
    path: '/reports',
    name: 'reports',
    meta: {
      title: 'Reportes',
      requiresAuth: true
    },
    // Uso del componente genérico para microfrontends
    component: MicrofrontendView,
    // Pasamos props como una función que devuelve un objeto
    props: () => ({
      moduleName: 'reports-module',
      componentName: 'ReportsApp',
      fallbackNavigation: [
        { path: '/reports', label: 'Panel de Reportes', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path fill="none" d="M0 0h24v24H0z"/><path d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h16V5H4zm3 10.5h10v2H7v-2zm0-6h2v4H7v-4zm4 0h2v4h-2v-4zm4 0h2v4h-2v-4z" fill="currentColor"/></svg>' },
        { path: '/reports/sales', label: 'Reporte de Ventas', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-2.5-5.5l8.5-8.5-1.5-1.5-7 7-3-3-1.5 1.5 4.5 4.5z" fill="currentColor"/></svg>' },
        { path: '/reports/user-activity', label: 'Actividad de Usuarios', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path fill="none" d="M0 0h24v24H0z"/><path d="M2 13h6v8H2v-8zm14-5h6v13h-6V8zM9 3h6v18H9V3zM4 15v4h2v-4H4zm7-10v14h2V5h-2zm7 5v9h2v-9h-2z" fill="currentColor"/></svg>' },
        { path: '/reports/custom', label: 'Reportes Personalizados', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path fill="none" d="M0 0h24v24H0z"/><path d="M3 21a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3zm4-11h3v7H7v-7zm7-2h4v9h-4V8zm-7-4v2h12V4H7z" fill="currentColor"/></svg>' }
      ]
    }),

    // Rutas anidadas que serán manejadas por el módulo remoto
    children: [
      {
        path: '',
        name: 'reports-overview',
        meta: {
          title: 'Panel de Reportes',
          requiresAuth: true
        },
        // Carga dinámica del componente remoto
        component: () => import('reports-module/ReportsApp')
      },
      {
        path: 'sales',
        name: 'reports-sales',
        meta: {
          title: 'Reporte de Ventas',
          requiresAuth: true
        },
        // Carga dinámica del componente remoto
        component: () => import('reports-module/ReportsApp')
      },
      {
        path: 'user-activity',
        name: 'reports-user-activity',
        meta: {
          title: 'Actividad de Usuarios',
          requiresAuth: true
        },
        // Carga dinámica del componente remoto
        component: () => import('reports-module/ReportsApp')
      },
      {
        path: 'custom',
        name: 'reports-custom',
        meta: {
          title: 'Reportes Personalizados',
          requiresAuth: true
        },
        // Carga dinámica del componente remoto
        component: () => import('reports-module/ReportsApp')
      }
    ]
  },
  {
    // Ruta para manejar rutas no encontradas
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
    meta: {
      title: 'Página no encontrada'
    }
  }
];

export default routes;