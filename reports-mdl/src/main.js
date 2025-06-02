import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'

// Importar vistas
const ReportsOverview = () => import('./views/ReportsOverview.vue')
const SalesReport = () => import('./views/SalesReport.vue')
const UserActivityReport = () => import('./views/UserActivityReport.vue')
const CustomReport = () => import('./views/CustomReport.vue')

// Configurar rutas
const routes = [
  {
    path: '/',
    redirect: '/reports'
  },
  {
    path: '/reports',
    name: 'reports-overview',
    component: ReportsOverview
  },
  {
    path: '/reports/sales',
    name: 'sales-report',
    component: SalesReport
  },
  {
    path: '/reports/user-activity',
    name: 'user-activity-report',
    component: UserActivityReport
  },
  {
    path: '/reports/custom',
    name: 'custom-report',
    component: CustomReport
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Crear la aplicación Vue
const app = createApp(App)
app.use(router)

// Montar la aplicación si no estamos en modo federación
if (!import.meta.env.PROD) {
  app.mount('#app')
}

// Importar el componente ReportsApp para federación de módulos
import ReportsApp from './ReportsApp.vue'

// Exportar componentes para federación de módulos
export { App, ReportsApp }
