<script setup>
import { ref, onMounted } from 'vue';

// Estado para los filtros
const dateRange = ref({
  start: '2023-01-01',
  end: '2023-05-31'
});

// Datos de ejemplo para las tarjetas de resumen
const summaryData = ref({
  activeUsers: {
    value: 2450,
    change: 8,
    changeDirection: 'up',
    period: 'este mes'
  },
  newRegistrations: {
    value: 320,
    change: 12,
    changeDirection: 'up',
    period: 'este mes'
  },
  avgSessionTime: {
    value: '18:45',
    change: 5,
    changeDirection: 'up',
    period: 'este mes'
  },
  retentionRate: {
    value: 68,
    change: 3,
    changeDirection: 'down',
    period: 'este mes'
  }
});

// Datos de ejemplo para la tabla de actividad reciente
const recentActivity = ref([
  { id: 1, user: 'Juan Pérez', email: 'juan.perez@example.com', lastActive: '2023-05-15T14:30:00', sessionTime: '00:45:12', actions: 28, status: 'Online' },
  { id: 2, user: 'María García', email: 'maria.garcia@example.com', lastActive: '2023-05-15T12:15:00', sessionTime: '01:20:45', actions: 42, status: 'Offline' },
  { id: 3, user: 'Carlos López', email: 'carlos.lopez@example.com', lastActive: '2023-05-15T10:05:00', sessionTime: '00:30:18', actions: 15, status: 'Online' },
  { id: 4, user: 'Ana Martínez', email: 'ana.martinez@example.com', lastActive: '2023-05-14T18:45:00', sessionTime: '02:10:30', actions: 65, status: 'Offline' },
  { id: 5, user: 'Roberto Sánchez', email: 'roberto.sanchez@example.com', lastActive: '2023-05-14T16:20:00', sessionTime: '00:55:40', actions: 32, status: 'Offline' }
]);

// Función para aplicar filtros
const applyFilters = () => {
  // Aquí iría la lógica para filtrar los datos según los criterios seleccionados
  console.log('Aplicando filtros:', {
    dateRange: dateRange.value
  });
};

// Función para exportar datos
const exportReport = () => {
  // Aquí iría la lógica para exportar los datos a CSV o Excel
  alert('Exportando informe de actividad de usuarios...');
};

// Función para formatear fecha
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

onMounted(() => {
  // Aquí se cargarían los datos reales desde una API
  console.log('Componente UserActivityReport montado');
  applyFilters();
});
</script>

<template>
  <div class="user-activity-report">
    <div class="page-header">
      <h1>Informe de Actividad de Usuarios</h1>
      <div class="actions">
        <button class="btn btn-secondary" @click="applyFilters">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          Aplicar Filtros
        </button>
        <button class="btn" @click="exportReport">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Exportar
        </button>
      </div>
    </div>

    <section class="filters-section">
      <div class="card">
        <h2>Filtros</h2>
        <div class="filters-grid">
          <div class="filter-group">
            <label for="date-start">Fecha Inicio</label>
            <input type="date" id="date-start" v-model="dateRange.start" class="form-control" />
          </div>
          <div class="filter-group">
            <label for="date-end">Fecha Fin</label>
            <input type="date" id="date-end" v-model="dateRange.end" class="form-control" />
          </div>
        </div>
      </div>
    </section>

    <section class="summary-section">
      <div class="summary-card">
        <div class="summary-icon users-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div class="summary-content">
          <h3>Usuarios Activos</h3>
          <div class="summary-value">{{ summaryData.activeUsers.value }}</div>
          <div class="summary-change" :class="summaryData.activeUsers.changeDirection === 'up' ? 'positive' : 'negative'">
            <svg v-if="summaryData.activeUsers.changeDirection === 'up'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="18 15 12 9 6 15"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            {{ summaryData.activeUsers.change }}% {{ summaryData.activeUsers.period }}
          </div>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon registrations-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="8.5" cy="7" r="4"/>
            <line x1="20" y1="8" x2="20" y2="14"/>
            <line x1="23" y1="11" x2="17" y2="11"/>
          </svg>
        </div>
        <div class="summary-content">
          <h3>Nuevos Registros</h3>
          <div class="summary-value">{{ summaryData.newRegistrations.value }}</div>
          <div class="summary-change" :class="summaryData.newRegistrations.changeDirection === 'up' ? 'positive' : 'negative'">
            <svg v-if="summaryData.newRegistrations.changeDirection === 'up'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="18 15 12 9 6 15"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            {{ summaryData.newRegistrations.change }}% {{ summaryData.newRegistrations.period }}
          </div>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon session-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <div class="summary-content">
          <h3>Tiempo Medio de Sesión</h3>
          <div class="summary-value">{{ summaryData.avgSessionTime.value }}</div>
          <div class="summary-change" :class="summaryData.avgSessionTime.changeDirection === 'up' ? 'positive' : 'negative'">
            <svg v-if="summaryData.avgSessionTime.changeDirection === 'up'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="18 15 12 9 6 15"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            {{ summaryData.avgSessionTime.change }}% {{ summaryData.avgSessionTime.period }}
          </div>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon retention-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div class="summary-content">
          <h3>Tasa de Retención</h3>
          <div class="summary-value">{{ summaryData.retentionRate.value }}%</div>
          <div class="summary-change" :class="summaryData.retentionRate.changeDirection === 'up' ? 'positive' : 'negative'">
            <svg v-if="summaryData.retentionRate.changeDirection === 'up'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="18 15 12 9 6 15"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            {{ summaryData.retentionRate.change }}% {{ summaryData.retentionRate.period }}
          </div>
        </div>
      </div>
    </section>

    <section class="charts-section">
      <div class="chart-container">
        <h2>Usuarios Activos Diarios</h2>
        <div class="chart-placeholder">
          <p>Aquí iría un gráfico de líneas mostrando los usuarios activos diarios</p>
        </div>
      </div>

      <div class="chart-container">
        <h2>Usuarios Nuevos vs. Recurrentes</h2>
        <div class="chart-placeholder">
          <p>Aquí iría un gráfico de barras comparando usuarios nuevos y recurrentes</p>
        </div>
      </div>

      <div class="chart-container">
        <h2>Actividad por Hora</h2>
        <div class="chart-placeholder">
          <p>Aquí iría un gráfico de calor mostrando la actividad por hora del día</p>
        </div>
      </div>

      <div class="chart-container">
        <h2>Retención de Usuarios</h2>
        <div class="chart-placeholder">
          <p>Aquí iría un gráfico de cohorte mostrando la retención de usuarios</p>
        </div>
      </div>
    </section>

    <section class="recent-activity-section">
      <h2>Actividad Reciente</h2>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Última Actividad</th>
              <th>Tiempo de Sesión</th>
              <th>Acciones</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="activity in recentActivity" :key="activity.id">
              <td>{{ activity.user }}</td>
              <td>{{ activity.email }}</td>
              <td>{{ formatDate(activity.lastActive) }}</td>
              <td>{{ activity.sessionTime }}</td>
              <td>{{ activity.actions }}</td>
              <td>
                <span class="status-badge" :class="{
                  'status-online': activity.status === 'Online',
                  'status-offline': activity.status === 'Offline'
                }">
                  {{ activity.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<style>
.user-activity-report {
  width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.page-header h1 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  margin: 0;
}

.actions {
  display: flex;
  gap: var(--spacing-sm);
}

.actions button {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.filters-section {
  margin-bottom: var(--spacing-lg);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--spacing-md);
}

@media (min-width: 640px) {
  .filters-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.filter-group label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-light);
}

.form-control {
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  background-color: var(--color-background);
  color: var(--color-text);
  font-size: var(--font-size-sm);
  width: 100%;
}

.form-control:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
}

.summary-section {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

@media (min-width: 640px) {
  .summary-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .summary-section {
    grid-template-columns: repeat(4, 1fr);
  }
}

.summary-card {
  display: flex;
  align-items: center;
  padding: var(--spacing-md);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
}

.summary-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-full);
  margin-right: var(--spacing-md);
}

.users-icon {
  background-color: rgba(86, 11, 173, 0.1);
  color: var(--color-secondary);
}

.registrations-icon {
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--color-success);
}

.session-icon {
  background-color: rgba(33, 150, 243, 0.1);
  color: var(--color-info);
}

.retention-icon {
  background-color: rgba(255, 152, 0, 0.1);
  color: var(--color-warning);
}

.summary-content h3 {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-light);
  margin: 0 0 var(--spacing-xs) 0;
}

.summary-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-xs);
}

.summary-change {
  display: flex;
  align-items: center;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.summary-change svg {
  margin-right: var(--spacing-xs);
}

.positive {
  color: var(--color-success);
}

.negative {
  color: var(--color-error);
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

@media (min-width: 768px) {
  .charts-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

.chart-container {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-lg);
}

.chart-container h2 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-top: 0;
  margin-bottom: var(--spacing-md);
}

.chart-placeholder {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: var(--border-radius-sm);
  color: var(--color-text-light);
}

.dark-theme .chart-placeholder {
  background-color: rgba(255, 255, 255, 0.05);
}

.recent-activity-section {
  margin-bottom: var(--spacing-xl);
}

.recent-activity-section h2 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-md);
}

.table-container {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  overflow-x: auto;
}

.status-badge {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.status-online {
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--color-success);
}

.status-offline {
  background-color: rgba(158, 158, 158, 0.1);
  color: var(--color-text-light);
}

.card {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-lg);
}

.card h2 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-top: 0;
  margin-bottom: var(--spacing-md);
}
</style>