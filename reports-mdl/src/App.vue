<script setup>
import { ref, onMounted } from 'vue';

// Estado para el tema
const isDarkTheme = ref(false);

// Función para cambiar el tema
const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value;
  document.body.classList.toggle('dark-theme', isDarkTheme.value);
  localStorage.setItem('reports-theme', isDarkTheme.value ? 'dark' : 'light');
  
  // Emitir evento para sincronizar con la aplicación principal
  window.dispatchEvent(new CustomEvent('reports-theme-change', { 
    detail: { theme: isDarkTheme.value ? 'dark' : 'light' } 
  }));
};

// Cargar tema desde localStorage si existe
onMounted(() => {
  const savedTheme = localStorage.getItem('reports-theme');
  if (savedTheme) {
    isDarkTheme.value = savedTheme === 'dark';
    document.body.classList.toggle('dark-theme', isDarkTheme.value);
  } else {
    // Detectar preferencia del sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    isDarkTheme.value = prefersDark;
    document.body.classList.toggle('dark-theme', prefersDark);
  }
});
</script>

<template>
  <div class="reports-module" :class="{ 'dark-theme': isDarkTheme }">
    <header class="header">
      <div class="header-content">
        <h1 class="header-title">Módulo de Reportes</h1>
        <button class="theme-toggle" @click="toggleTheme">
          <span v-if="isDarkTheme">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
            Modo Claro
          </span>
          <span v-else>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
            Modo Oscuro
          </span>
        </button>
      </div>
    </header>
    
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style>
.reports-module {
  width: 100%;
  min-height: 100vh;
}

.header {
  background-color: var(--color-surface);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.theme-toggle {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background-color: transparent;
  color: var(--color-text);
  border: var(--border-width) solid var(--color-border);
  padding: var(--spacing-xs) var(--spacing-sm);
}

.theme-toggle:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.dark-theme .theme-toggle:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.theme-toggle svg {
  margin-right: var(--spacing-xs);
}

.main-content {
  padding: var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;
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
</style>
