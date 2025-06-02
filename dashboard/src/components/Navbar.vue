<template>
  <header class="navbar">
    <div class="navbar__left">
      <button @click="toggleSidebar" class="navbar__menu-toggle d-md-none">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      <div class="navbar__breadcrumb">
        <h1 class="navbar__title">{{ pageTitle }}</h1>
      </div>
    </div>
    
    <div class="navbar__right">
      <div class="navbar__search">
        <div class="navbar__search-input-wrapper">
          <input 
            type="text" 
            class="navbar__search-input" 
            placeholder="Buscar..." 
            v-model="searchQuery"
            @focus="searchFocused = true"
            @blur="onSearchBlur"
          />
          <svg class="navbar__search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <div v-if="searchFocused && searchResults.length > 0" class="navbar__search-results">
          <ul class="navbar__search-results-list">
            <li 
              v-for="(result, index) in searchResults" 
              :key="index" 
              class="navbar__search-result-item"
              @click="navigateToResult(result)"
            >
              <div class="navbar__search-result-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <div class="navbar__search-result-content">
                <div class="navbar__search-result-title">{{ result.title }}</div>
                <div class="navbar__search-result-path">{{ result.path }}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      <div class="navbar__actions">
        <div class="navbar__notification">
          <button class="navbar__notification-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span v-if="notificationCount > 0" class="navbar__notification-badge">{{ notificationCount }}</span>
          </button>
        </div>
        
        <div class="navbar__user-dropdown">
          <button @click="toggleUserMenu" class="navbar__user-btn">
            <div class="navbar__user-avatar">
              <img v-if="user && user.avatar" :src="user.avatar" :alt="user.name" />
              <div v-else class="navbar__user-avatar-placeholder">{{ userInitials }}</div>
            </div>
          </button>
          
          <div v-if="userMenuOpen" class="navbar__user-menu">
            <div class="navbar__user-menu-header">
              <div class="navbar__user-menu-name">{{ user ? user.name : 'Usuario' }}</div>
              <div class="navbar__user-menu-email">{{ user ? user.email : 'usuario@ejemplo.com' }}</div>
            </div>
            <ul class="navbar__user-menu-list">
              <li class="navbar__user-menu-item">
                <router-link to="/profile" class="navbar__user-menu-link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>Mi Perfil</span>
                </router-link>
              </li>
              <li class="navbar__user-menu-item">
                <router-link to="/settings" class="navbar__user-menu-link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                  <span>Configuración</span>
                </router-link>
              </li>
              <li class="navbar__user-menu-divider"></li>
              <li class="navbar__user-menu-item">
                <button @click="logout" class="navbar__user-menu-link navbar__user-menu-link--danger">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <span>Cerrar sesión</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, computed, watch, onMounted, onBeforeUnmount, defineComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store';

export default defineComponent({
  name: 'Navbar',
  emits: ['toggle-sidebar'],
  setup(props, { emit }) {
    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();
    
    const searchQuery = ref('');
    const searchFocused = ref(false);
    const searchResults = ref([]);
    const userMenuOpen = ref(false);
    const notificationCount = ref(3); // Ejemplo estático
    
    // Título de la página basado en la ruta actual
    const pageTitle = computed(() => {
      return route.meta.title || 'Dashboard';
    });
    
    const user = computed(() => authStore.user);
    
    const userInitials = computed(() => {
      if (!user.value || !user.value.name) return 'U';
      return user.value.name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    });
    
    // Simulación de búsqueda
    watch(searchQuery, (newQuery) => {
      if (newQuery.length > 2) {
        // Aquí se podría implementar una búsqueda real
        searchResults.value = [
          { title: 'Dashboard', path: '/', description: 'Panel principal' },
          { title: 'Usuarios', path: '/admin/users', description: 'Gestión de usuarios' },
          { title: 'Configuración', path: '/admin/menu-config', description: 'Configuración del menú' }
        ].filter(item => 
          item.title.toLowerCase().includes(newQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(newQuery.toLowerCase())
        );
      } else {
        searchResults.value = [];
      }
    });
    
    const navigateToResult = (result) => {
      router.push(result.path);
      searchQuery.value = '';
      searchFocused.value = false;
    };
    
    const onSearchBlur = () => {
      // Pequeño retraso para permitir que el clic en los resultados funcione
      setTimeout(() => {
        searchFocused.value = false;
      }, 200);
    };
    
    const toggleUserMenu = () => {
      userMenuOpen.value = !userMenuOpen.value;
    };
    
    const toggleSidebar = () => {
      emit('toggle-sidebar');
    };
    
    const logout = () => {
      authStore.logout();
      router.push('/login');
    };
    
    // Cerrar menú de usuario al hacer clic fuera
    const handleClickOutside = (event) => {
      const userDropdown = document.querySelector('.navbar__user-dropdown');
      if (userMenuOpen.value && userDropdown && !userDropdown.contains(event.target)) {
        userMenuOpen.value = false;
      }
    };
    
    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });
    
    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside);
    });
    
    return {
      pageTitle,
      searchQuery,
      searchFocused,
      searchResults,
      userMenuOpen,
      notificationCount,
      user,
      userInitials,
      navigateToResult,
      onSearchBlur,
      toggleUserMenu,
      toggleSidebar,
      logout
    };
  }
});
</script>

<style>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 var(--spacing-md);
  background-color: var(--color-surface);
  border-bottom: var(--border-width) solid rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  right: 0;
  left: 250px; /* Ancho del sidebar */
  z-index: 90;
  transition: left var(--transition-normal);
}

.sidebar--collapsed + .navbar {
  left: 70px; /* Ancho del sidebar colapsado */
}

.navbar__left, .navbar__right {
  display: flex;
  align-items: center;
}

.navbar__menu-toggle {
  background: transparent;
  border: none;
  padding: var(--spacing-xs);
  margin-right: var(--spacing-md);
  cursor: pointer;
  color: var(--color-text);
}

.navbar__title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin: 0;
}

.navbar__search {
  position: relative;
  margin-right: var(--spacing-lg);
}

.navbar__search-input-wrapper {
  position: relative;
}

.navbar__search-input {
  padding: var(--spacing-sm) var(--spacing-md);
  padding-left: calc(var(--spacing-md) * 2 + 18px); /* Espacio para el icono */
  border-radius: var(--border-radius-md);
  border: var(--border-width) solid rgba(0, 0, 0, 0.1);
  background-color: rgba(0, 0, 0, 0.03);
  width: 250px;
  transition: all var(--transition-fast);
}

.navbar__search-input:focus {
  background-color: var(--color-surface);
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
}

.navbar__search-icon {
  position: absolute;
  left: var(--spacing-md);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-light);
}

.navbar__search-results {
  position: absolute;
  top: 100%;
  left: 0;
  width: 300px;
  margin-top: var(--spacing-xs);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  z-index: 100;
  max-height: 400px;
  overflow-y: auto;
}

.navbar__search-results-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.navbar__search-result-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.navbar__search-result-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.navbar__search-result-icon {
  margin-right: var(--spacing-md);
  color: var(--color-text-light);
}

.navbar__search-result-content {
  flex: 1;
}

.navbar__search-result-title {
  font-weight: 500;
}

.navbar__search-result-path {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
}

.navbar__actions {
  display: flex;
  align-items: center;
}

.navbar__notification {
  position: relative;
  margin-right: var(--spacing-md);
}

.navbar__notification-btn {
  background: transparent;
  border: none;
  padding: var(--spacing-xs);
  cursor: pointer;
  color: var(--color-text);
  position: relative;
}

.navbar__notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: var(--color-error);
  color: white;
  font-size: 10px;
  font-weight: 600;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.navbar__user-dropdown {
  position: relative;
}

.navbar__user-btn {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.navbar__user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  background-color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.navbar__user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.navbar__user-avatar-placeholder {
  color: white;
  font-weight: 600;
  font-size: var(--font-size-sm);
}

.navbar__user-menu {
  position: absolute;
  top: calc(100% + var(--spacing-xs));
  right: 0;
  width: 240px;
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  z-index: 100;
  overflow: hidden;
}

.navbar__user-menu-header {
  padding: var(--spacing-md);
  border-bottom: var(--border-width) solid rgba(0, 0, 0, 0.1);
}

.navbar__user-menu-name {
  font-weight: 600;
}

.navbar__user-menu-email {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
}

.navbar__user-menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.navbar__user-menu-item {
  display: block;
}

.navbar__user-menu-link {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--color-text);
  text-decoration: none;
  transition: background-color var(--transition-fast);
}

.navbar__user-menu-link:hover {
  background-color: rgba(0, 0, 0, 0.03);
  text-decoration: none;
}

.navbar__user-menu-link svg {
  margin-right: var(--spacing-sm);
}

.navbar__user-menu-link--danger {
  color: var(--color-error);
}

.navbar__user-menu-divider {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  margin: var(--spacing-xs) 0;
}

/* Estilos para tema oscuro */
.dark-theme .navbar {
  background-color: var(--color-surface-dark);
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.dark-theme .navbar__menu-toggle,
.dark-theme .navbar__notification-btn,
.dark-theme .navbar__user-btn {
  color: var(--color-text-dark);
}

.dark-theme .navbar__search-input {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: var(--color-text-dark);
}

.dark-theme .navbar__search-input:focus {
  background-color: rgba(255, 255, 255, 0.1);
}

.dark-theme .navbar__search-results,
.dark-theme .navbar__user-menu {
  background-color: var(--color-surface-dark);
  box-shadow: var(--shadow-lg);
}

.dark-theme .navbar__search-result-item:hover,
.dark-theme .navbar__user-menu-link:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.dark-theme .navbar__user-menu-header {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.dark-theme .navbar__user-menu-divider {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .navbar {
    left: 0;
  }
  
  .navbar__search-input {
    width: 180px;
  }
}

@media (max-width: 576px) {
  .navbar__search {
    display: none;
  }
}
</style>