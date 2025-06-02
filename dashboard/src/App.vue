<template>
  <div :class="['app', { 'dark-theme': isDarkTheme }]">
    <!-- Layout normal con sidebar y navbar para rutas autenticadas -->
    <template v-if="!isBlankLayout">
      <Sidebar 
        :remote-menu-items="menuItems" 
        :class="{ 'sidebar--collapsed': sidebarCollapsed }"
        ref="sidebar"
      />
      
      <div :class="['app__content', { 'app__content--sidebar-collapsed': sidebarCollapsed }]">
        <Navbar @toggle-sidebar="toggleSidebar" />
        
        <main class="app__main">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </main>
      </div>
    </template>
    
    <!-- Layout en blanco para login y otras páginas que lo requieran -->
    <template v-else>
      <div class="app__content app__content--full">
        <main class="app__main app__main--full">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </main>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted, defineComponent, watch } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from '@/components/Sidebar.vue';
import Navbar from '@/components/Navbar.vue';

export default defineComponent({
  name: 'App',
  components: {
    Sidebar,
    Navbar
  },
  setup() {
    const route = useRoute();
    const sidebarCollapsed = ref(false);
    const isDarkTheme = ref(false);
    const menuItems = ref([]);
    const sidebar = ref(null);
    
    // Determinar si se debe usar el layout en blanco
    const isBlankLayout = computed(() => {
      return route.meta.layout === 'blank';
    });
    
    // Función para cargar los elementos del menú desde los módulos remotos
    const loadRemoteMenuItems = async () => {
      try {
        // Intentar cargar primero el menú del módulo reports ya que sabemos que está disponible
        try {
          console.log('Intentando cargar el menú de reports-module...');
          const reportsModule = await import('reports-module/menu');
          if (reportsModule && reportsModule.default) {
            console.log('Menú de reports-module cargado correctamente');
            menuItems.value = reportsModule.default;
            return;
          }
        } catch (reportsError) {
          console.warn('No se pudo cargar el menú de reports-module:', reportsError);
          // Si falla reports, intentamos con admin
        }
        
        // Intentar cargar el menú del módulo admin solo si reports falló
        try {
          console.log('Intentando cargar el menú de admin-module...');
          const adminModule = await import('admin-module/menu');
          if (adminModule && adminModule.default) {
            console.log('Menú de admin-module cargado correctamente');
            menuItems.value = adminModule.default;
            return; 
          }
        } catch (adminError) {
          console.warn('No se pudo cargar el menú de admin-module:', adminError);
        }
        
        // Si llegamos aquí, ninguno de los módulos remotos funcionó
        throw new Error('No se pudo cargar ningún menú remoto');
      } catch (error) {
        console.error('Error al cargar los elementos del menú remoto:', error);
        // Fallback a elementos de menú locales si falla la carga remota
        menuItems.value = [
          { label: 'Dashboard', path: '/' },
          { label: 'Administración', path: '/admin', children: [
            { label: 'Gestión de Usuarios', path: '/admin/users' },
            { label: 'Configuración del Menú', path: '/admin/menu-config' }
          ]},
          { label: 'Reportes', path: '/reports', children: [
            { label: 'Panel de Reportes', path: '/reports' },
            { label: 'Reporte de Ventas', path: '/reports/sales' },
            { label: 'Actividad de Usuarios', path: '/reports/user-activity' },
            { label: 'Reportes Personalizados', path: '/reports/custom' }
          ]}
        ];
      }
    };
    
    const toggleSidebar = () => {
      sidebarCollapsed.value = !sidebarCollapsed.value;
      localStorage.setItem('sidebar_collapsed', sidebarCollapsed.value);
    };
    
    onMounted(async () => {
      // Cargar estado del sidebar desde localStorage
      const savedCollapsed = localStorage.getItem('sidebar_collapsed');
      if (savedCollapsed !== null) {
        sidebarCollapsed.value = savedCollapsed === 'true';
      }
      
      // Cargar tema desde localStorage
      const savedTheme = localStorage.getItem('dark_theme');
      if (savedTheme !== null) {
        isDarkTheme.value = savedTheme === 'true';
        document.body.classList.toggle('dark-theme', isDarkTheme.value);
      } else {
        // Detectar preferencia del sistema
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        isDarkTheme.value = prefersDark;
        document.body.classList.toggle('dark-theme', prefersDark);
      }
      
      // Cargar elementos del menú remoto
      await loadRemoteMenuItems();
    });
    
    return {
      sidebarCollapsed,
      isDarkTheme,
      menuItems,
      sidebar,
      toggleSidebar,
      isBlankLayout
    };
  }
});
</script>

<style>
/* Estilos globales ya están en style.css */

.app {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

.app__content {
  flex: 1;
  margin-left: 250px; /* Ancho del sidebar */
  transition: margin-left var(--transition-normal);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app__content--sidebar-collapsed {
  margin-left: 70px; /* Ancho del sidebar colapsado */
}

.app__main {
  padding: var(--spacing-lg);
  margin-top: 64px; /* Altura del navbar */
  flex: 1;
}

.app__content--full {
  margin-left: 0;
  width: 100%;
}

.app__main--full {
  margin-top: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

/* Transiciones de página */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-normal);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .app__content {
    margin-left: 0;
  }
  
  .app__content--sidebar-collapsed {
    margin-left: 0;
  }
}
</style>
