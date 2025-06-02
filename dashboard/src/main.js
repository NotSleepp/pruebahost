import { createApp } from 'vue'
import pinia from './store'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)

// Configurar Pinia para la gestión de estado
app.use(pinia)

// Configurar Vue Router
app.use(router)

// Montar la aplicación
app.mount('#app')
