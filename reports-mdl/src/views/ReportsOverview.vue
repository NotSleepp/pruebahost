<script setup>
import { ref, onMounted } from 'vue';

// Datos de ejemplo para los reportes
const summaryData = ref({
  sales: {
    value: 125000,
    change: 15,
    changeDirection: 'up',
    period: 'este mes'
  },
  users: {
    value: 2450,
    change: 8,
    changeDirection: 'up',
    period: 'este mes'
  },
  orders: {
    value: 1280,
    change: 12,
    changeDirection: 'up',
    period: 'este mes'
  },
  revenue: {
    value: 98500,
    change: 5,
    changeDirection: 'down',
    period: 'esta semana'
  }
});

const recentSales = ref([
  { id: 1, date: '2023-05-15', customer: 'Juan Pérez', product: 'Laptop Dell XPS', amount: 1299, status: 'Completado' },
  { id: 2, date: '2023-05-14', customer: 'María García', product: 'iPhone 13', amount: 999, status: 'Completado' },
  { id: 3, date: '2023-05-14', customer: 'Carlos López', product: 'Monitor Samsung', amount: 349, status: 'Pendiente' },
  { id: 4, date: '2023-05-13', customer: 'Ana Martínez', product: 'Teclado Mecánico', amount: 129, status: 'Completado' },
  { id: 5, date: '2023-05-12', customer: 'Roberto Sánchez', product: 'Auriculares Sony', amount: 199, status: 'Cancelado' }
]);

// Función para formatear moneda
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
};

// Función para formatear fecha
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES').format(date);
};

// Función para refrescar datos
const refreshData = () => {
  // Aquí iría la lógica para actualizar los datos desde una API
  alert('Actualizando datos...');
};

// Función para exportar datos
const exportData = () => {
  // Aquí iría la lógica para exportar los datos a CSV o Excel
  alert('Exportando datos...');
};

onMounted(() => {
  // Aquí se cargarían los datos reales desde una API
  console.log('Componente ReportsOverview montado');
});
</script>

<template>
  <div class="reports-overview">
    <div class="page-header">
      <h1>Panel de Reportes</h1>
      <div class="actions">
        <button class="btn btn-secondary" @click="refreshData">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
          </svg>
          Actualizar
        </button>
        <button class="btn" @click="exportData">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Exportar
        </button>
      </div>
    </div>

    <section class="summary-section">
      <div class="summary-card">
        <div class="summary-icon sales-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        <div class="summary-content">
          <h3>Ventas Totales</h3>
          <div class="summary-value">{{ formatCurrency(summaryData.sales.value) }}</div>
          <div class="summary-change" :class="summaryData.sales.changeDirection === 'up' ? 'positive' : 'negative'">
            <svg v-if="summaryData.sales.changeDirection === 'up'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="18 15 12 9 6 15"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            {{ summaryData.sales.change }}% {{ summaryData.sales.period }}
          </div>
        </div>
      </div>

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
          <div class="summary-value">{{ summaryData.users.value }}</div>
          <div class="summary-change" :class="summaryData.users.changeDirection === 'up' ? 'positive' : 'negative'">
            <svg v-if="summaryData.users.changeDirection === 'up'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="18 15 12 9 6 15"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            {{ summaryData.users.change }}% {{ summaryData.users.period }}
          </div>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon orders-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </div>
        <div class="summary-content">
          <h3>Pedidos</h3>
          <div class="summary-value">{{ summaryData.orders.value }}</div>
          <div class="summary-change" :class="summaryData.orders.changeDirection === 'up' ? 'positive' : 'negative'">
            <svg v-if="summaryData.orders.changeDirection === 'up'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="18 15 12 9 6 15"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            {{ summaryData.orders.change }}% {{ summaryData.orders.period }}
          </div>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon revenue-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
          </svg>
        </div>
        <div class="summary-content">
          <h3>Ingresos</h3>
          <div class="summary-value">{{ formatCurrency(summaryData.revenue.value) }}</div>
          <div class="summary-change" :class="summaryData.revenue.changeDirection === 'up' ? 'positive' : 'negative'">
            <svg v-if="summaryData.revenue.changeDirection === 'up'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="18 15 12 9 6 15"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            {{ summaryData.revenue.change }}% {{ summaryData.revenue.period }}
          </div>
        </div>
      </div>
    </section>

    <section class="charts-section">
      <div class="chart-container">
        <h2>Tendencia de Ventas</h2>
        <div class="chart-placeholder">
          <p>Aquí iría un gráfico de líneas mostrando las ventas a lo largo del tiempo</p>
        </div>
      </div>

      <div class="chart-container">
        <h2>Distribución por Categoría</h2>
        <div class="chart-placeholder">
          <p>Aquí iría un gráfico circular mostrando la distribución de ventas por categoría</p>
        </div>
      </div>

      <div class="chart-container">
        <h2>Actividad de Usuarios</h2>
        <div class="chart-placeholder">
          <p>Aquí iría un gráfico de barras mostrando la actividad de usuarios por día</p>
        </div>
      </div>

      <div class="chart-container">
        <h2>Conversión de Ventas</h2>
        <div class="chart-placeholder">
          <p>Aquí iría un gráfico de embudo mostrando la conversión de ventas</p>
        </div>
      </div>
    </section>

    <section class="recent-sales-section">
      <h2>Ventas Recientes</h2>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Producto</th>
              <th>Importe</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sale in recentSales" :key="sale.id">
              <td>#{{ sale.id }}</td>
              <td>{{ formatDate(sale.date) }}</td>
              <td>{{ sale.customer }}</td>
              <td>{{ sale.product }}</td>
              <td>{{ formatCurrency(sale.amount) }}</td>
              <td>
                <span class="status-badge" :class="{
                  'status-completed': sale.status === 'Completado',
                  'status-pending': sale.status === 'Pendiente',
                  'status-canceled': sale.status === 'Cancelado'
                }">
                  {{ sale.status }}
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
.reports-overview {
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

.sales-icon {
  background-color: rgba(67, 97, 238, 0.1);
  color: var(--color-primary);
}

.users-icon {
  background-color: rgba(86, 11, 173, 0.1);
  color: var(--color-secondary);
}

.orders-icon {
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--color-success);
}

.revenue-icon {
  background-color: rgba(33, 150, 243, 0.1);
  color: var(--color-info);
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

.recent-sales-section {
  margin-bottom: var(--spacing-xl);
}

.recent-sales-section h2 {
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

.status-completed {
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--color-success);
}

.status-pending {
  background-color: rgba(255, 152, 0, 0.1);
  color: var(--color-warning);
}

.status-canceled {
  background-color: rgba(244, 67, 54, 0.1);
  color: var(--color-error);
}
</style>