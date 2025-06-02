import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAppStore = defineStore('app', () => {
  // Estado
  const sidebarCollapsed = ref(localStorage.getItem('sidebar_collapsed') === 'true');
  const darkMode = ref(localStorage.getItem('dark_theme') === 'true');
  const loading = ref(false);
  const notifications = ref([]);
  const remoteModules = ref({});
  const remoteModulesLoading = ref({});
  const remoteModulesError = ref({});

  // Getters
  const isDarkMode = computed(() => darkMode.value);
  const unreadNotificationsCount = computed(() => {
    return notifications.value.filter(n => !n.read).length;
  });

  // Acciones
  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value;
    localStorage.setItem('sidebar_collapsed', sidebarCollapsed.value);
  }

  function toggleDarkMode() {
    darkMode.value = !darkMode.value;
    localStorage.setItem('dark_theme', darkMode.value);
    document.body.classList.toggle('dark-theme', darkMode.value);
  }

  function setLoading(value) {
    loading.value = value;
  }

  function addNotification(notification) {
    notifications.value.unshift({
      id: Date.now(),
      timestamp: new Date(),
      read: false,
      ...notification
    });
  }

  function markNotificationAsRead(id) {
    const notification = notifications.value.find(n => n.id === id);
    if (notification) {
      notification.read = true;
    }
  }

  function markAllNotificationsAsRead() {
    notifications.value.forEach(n => n.read = true);
  }

  function clearNotifications() {
    notifications.value = [];
  }

  // Gestión de módulos remotos
  async function loadRemoteModule(moduleName, componentName) {
    if (remoteModules.value[`${moduleName}/${componentName}`]) {
      return remoteModules.value[`${moduleName}/${componentName}`];
    }

    remoteModulesLoading.value[`${moduleName}/${componentName}`] = true;
    remoteModulesError.value[`${moduleName}/${componentName}`] = null;

    try {
      // Importación dinámica del módulo remoto
      const module = await import(/* @vite-ignore */ moduleName);
      const component = await module[componentName.replace('./', '')]();

      remoteModules.value[`${moduleName}/${componentName}`] = component.default || component;
      return remoteModules.value[`${moduleName}/${componentName}`];
    } catch (error) {
      console.error(`Error al cargar el módulo remoto ${moduleName}/${componentName}:`, error);
      remoteModulesError.value[`${moduleName}/${componentName}`] = error.message;
      throw error;
    } finally {
      remoteModulesLoading.value[`${moduleName}/${componentName}`] = false;
    }
  }

  function isRemoteModuleLoading(moduleName, componentName) {
    return !!remoteModulesLoading.value[`${moduleName}/${componentName}`];
  }

  function getRemoteModuleError(moduleName, componentName) {
    return remoteModulesError.value[`${moduleName}/${componentName}`];
  }

  // Inicialización
  function initializeApp() {
    // Aplicar tema oscuro si está guardado en localStorage
    if (darkMode.value) {
      document.body.classList.add('dark-theme');
    }

    // Cargar notificaciones desde API o localStorage si es necesario
    // loadNotifications();
  }

  // Llamar a inicializar
  initializeApp();

  return {
    // Estado
    sidebarCollapsed,
    darkMode,
    loading,
    notifications,
    remoteModules,
    remoteModulesLoading,
    remoteModulesError,

    // Getters
    isDarkMode,
    unreadNotificationsCount,

    // Acciones
    toggleSidebar,
    toggleDarkMode,
    setLoading,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    loadRemoteModule,
    isRemoteModuleLoading,
    getRemoteModuleError,
    initializeApp
  };
});