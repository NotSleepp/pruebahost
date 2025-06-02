<template>
  <aside :class="['sidebar', { 'sidebar--collapsed': collapsed }]">
    <div class="sidebar__header">
      <div class="sidebar__logo">
        <img v-if="!collapsed" src="@/assets/logo.svg" alt="Logo" class="sidebar__logo-img" />
        <img v-else src="@/assets/logo-small.svg" alt="Logo" class="sidebar__logo-img sidebar__logo-img--small" />
      </div>
      <button @click="toggleCollapse" class="sidebar__toggle btn btn-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path v-if="collapsed" d="M13 17l5-5-5-5"></path>
          <path v-else d="M11 17l-5-5 5-5"></path>
        </svg>
      </button>
    </div>

    <div class="sidebar__content">
      <nav class="sidebar__nav">
        <ul class="sidebar__menu">
          <li class="sidebar__menu-item">
            <router-link to="/" class="sidebar__menu-link" active-class="sidebar__menu-link--active">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span v-if="!collapsed">Inicio</span>
            </router-link>
          </li>

          <!-- Menú dinámico desde los módulos remotos -->
          <li v-for="(item, index) in menuItems" :key="index" class="sidebar__menu-item">
            <router-link :to="item.path" class="sidebar__menu-link" active-class="sidebar__menu-link--active">
              <svg v-if="item.icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <component :is="getIconComponent(item.icon)" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              <span v-if="!collapsed">{{ item.label }}</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </div>

    <div class="sidebar__footer">
      <div class="sidebar__theme-toggle">
        <button @click="toggleTheme" class="btn btn-sm btn-outline">
          <svg v-if="isDarkTheme" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
          <span v-if="!collapsed">{{ isDarkTheme ? 'Modo Claro' : 'Modo Oscuro' }}</span>
        </button>
      </div>

      <div v-if="user" class="sidebar__user">
        <div v-if="!collapsed" class="sidebar__user-info">
          <span class="sidebar__user-name">{{ user.name }}</span>
          <span class="sidebar__user-role">{{ user.role }}</span>
        </div>
        <button @click="logout" class="btn btn-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span v-if="!collapsed">Cerrar sesión</span>
        </button>
      </div>
    </div>
  </aside>
</template>

<script>
import { ref, computed, onMounted, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store';

export default defineComponent({
  name: 'Sidebar',
  props: {
    // Elementos del menú que vienen de los módulos remotos
    remoteMenuItems: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const router = useRouter();
    const authStore = useAuthStore();
    
    const collapsed = ref(false);
    const isDarkTheme = ref(false);
    
    // Combinar elementos de menú locales con los remotos
    const menuItems = computed(() => {
      return props.remoteMenuItems;
    });

    const user = computed(() => authStore.user);

    const toggleCollapse = () => {
      collapsed.value = !collapsed.value;
      localStorage.setItem('sidebar_collapsed', collapsed.value);
    };

    const toggleTheme = () => {
      isDarkTheme.value = !isDarkTheme.value;
      document.body.classList.toggle('dark-theme', isDarkTheme.value);
      localStorage.setItem('dark_theme', isDarkTheme.value ? 'true' : 'false');
    };

    const logout = () => {
      authStore.logout();
      router.push('/login');
    };

    // Función para obtener el componente de icono basado en el nombre
    const getIconComponent = (iconName) => {
      // Esta función podría expandirse para manejar diferentes iconos
      // Por ahora, simplemente devuelve un círculo como fallback
      return {
        template: `<circle cx="12" cy="12" r="10"></circle>`
      };
    };

    onMounted(() => {
      // Restaurar estado del sidebar desde localStorage
      const savedCollapsed = localStorage.getItem('sidebar_collapsed');
      if (savedCollapsed !== null) {
        collapsed.value = savedCollapsed === 'true';
      }

      // Restaurar tema desde localStorage
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
    });

    return {
      collapsed,
      isDarkTheme,
      menuItems,
      user,
      toggleCollapse,
      toggleTheme,
      logout,
      getIconComponent
    };
  }
});
</script>

<style>
.sidebar {
  display: flex;
  flex-direction: column;
  width: 250px;
  height: 100vh;
  background-color: var(--color-surface);
  border-right: var(--border-width) solid rgba(0, 0, 0, 0.1);
  transition: width var(--transition-normal);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-sm);
}

.sidebar--collapsed {
  width: 70px;
}

.sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  height: 64px;
  border-bottom: var(--border-width) solid rgba(0, 0, 0, 0.1);
}

.sidebar__logo {
  display: flex;
  align-items: center;
  overflow: hidden;
}

.sidebar__logo-img {
  height: 32px;
  width: auto;
  transition: all var(--transition-normal);
}

.sidebar__logo-img--small {
  height: 24px;
}

.sidebar__toggle {
  padding: var(--spacing-xs);
  background: transparent;
  color: var(--color-text);
}

.sidebar__content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md) 0;
}

.sidebar__menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar__menu-item {
  margin-bottom: var(--spacing-xs);
}

.sidebar__menu-link {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--color-text);
  text-decoration: none;
  border-radius: var(--border-radius-sm);
  transition: all var(--transition-fast);
  margin: 0 var(--spacing-sm);
}

.sidebar__menu-link:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--color-primary);
  text-decoration: none;
}

.sidebar__menu-link--active {
  background-color: var(--color-primary);
  color: white;
}

.sidebar__menu-link--active:hover {
  background-color: var(--color-primary-dark);
  color: white;
}

.sidebar__menu-link svg {
  margin-right: var(--spacing-md);
  flex-shrink: 0;
}

.sidebar--collapsed .sidebar__menu-link svg {
  margin-right: 0;
}

.sidebar__footer {
  padding: var(--spacing-md);
  border-top: var(--border-width) solid rgba(0, 0, 0, 0.1);
}

.sidebar__theme-toggle {
  margin-bottom: var(--spacing-md);
}

.sidebar__theme-toggle button {
  width: 100%;
  justify-content: flex-start;
}

.sidebar__theme-toggle svg {
  margin-right: var(--spacing-md);
}

.sidebar--collapsed .sidebar__theme-toggle svg {
  margin-right: 0;
}

.sidebar__user {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar__user-info {
  display: flex;
  flex-direction: column;
}

.sidebar__user-name {
  font-weight: 500;
  font-size: var(--font-size-sm);
}

.sidebar__user-role {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
}

/* Estilos para tema oscuro */
.dark-theme .sidebar {
  background-color: var(--color-surface-dark);
  border-right-color: rgba(255, 255, 255, 0.1);
}

.dark-theme .sidebar__header {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.dark-theme .sidebar__toggle {
  color: var(--color-text-dark);
}

.dark-theme .sidebar__menu-link {
  color: var(--color-text-dark);
}

.dark-theme .sidebar__menu-link:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.dark-theme .sidebar__footer {
  border-top-color: rgba(255, 255, 255, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    position: fixed;
    z-index: 1000;
  }
  
  .sidebar--open {
    transform: translateX(0);
  }
  
  .sidebar-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
}
</style>