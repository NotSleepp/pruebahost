<script setup>
import { ref, onMounted } from 'vue';

// Estado para los filtros
const dateRange = ref({
  start: '2023-01-01',
  end: '2023-05-31'
});

const selectedPeriod = ref('monthly');
const selectedCategory = ref('all');
const selectedRegion = ref('all');

// Datos de ejemplo para el resumen de ventas
const salesSummary = ref({
  totalSales: 458750,
  averageOrderValue: 125.50,
  conversionRate: 3.2,
  topSellingProduct: 'Laptop Dell XPS 13',
  compareToLastPeriod: 15.8
});

// Datos de ejemplo para la tabla de ventas por producto
const productSales = ref([
  { id: 1, name: 'Laptop Dell XPS 13', category: 'Electrónica', sales: 125, revenue: 162375, growth: 12 },
  { id: 2, name: 'iPhone 13 Pro', category: 'Móviles', sales: 98, revenue: 117600, growth: 8 },
  { id: 3, name: 'Monitor Samsung 27"', category: 'Periféricos', sales: 76, revenue: 22800, growth: -3 },
  { id: 4, name: 'Teclado Mecánico Logitech', category: 'Periféricos', sales: 112, revenue: 13440, growth: 22 },
  { id: 5, name: 'Auriculares Sony WH-1000XM4', category: 'Audio', sales: 65, revenue: 22750, growth: 15 },
  { id: 6, name: 'iPad Air', category: 'Tablets', sales: 54, revenue: 32400, growth: 5 },
  { id: 7, name: 'Ratón Logitech MX Master', category: 'Periféricos', sales: 89, revenue: 8010, growth: 18 },
  { id: 8, name: 'MacBook Pro 14"', category: 'Electrónica', sales: 42, revenue: 92400, growth: 7 }
]);

// Datos de ejemplo para la tabla de ventas por región
const regionSales = ref([
  { id: 1, name: 'Madrid', sales: 245, revenue: 125750, growth: 15 },
  { id: 2, name: 'Barcelona', sales: 198, revenue: 102350, growth: 12 },
  { id: 3, name: 'Valencia', sales: 132, revenue: 68500, growth: 8 },
  { id: 4, name: 'Sevilla', sales: 98, revenue: 45250, growth: 5 },
  { id: 5, name: 'Bilbao', sales: 87, revenue: 42800, growth: 10 },
  { id: 6, name: 'Málaga', sales: 76, revenue: 38200, growth: 18 },
  { id: 7, name: 'Zaragoza', sales: 65, revenue: 32500, growth: 7 },
  { id: 8, name: 'Murcia', sales: 52, revenue: 25400, growth: 3 }
]);

// Función para formatear moneda
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
};

// Función para aplicar filtros
const applyFilters = () => {
  // Aquí iría la lógica para filtrar los datos según los criterios seleccionados
  console.log('Aplicando filtros:', {
    dateRange: dateRange.value,
    period: selectedPeriod.value,
    category: selectedCategory.value,
    region: selectedRegion.value
  });
};

// Función para exportar datos
const exportReport = () => {
  // Aquí iría la lógica para exportar los datos a CSV o Excel
  alert('Exportando informe de ventas...');
};

// Función para imprimir informe
const printReport = () => {
  // Aquí iría la lógica para imprimir el informe
  window.print();
};

onMounted(() => {
  // Aquí se cargarían los datos reales desde una API
  console.log('Componente SalesReport montado');
  applyFilters();
});
</script>

<template>
  <div class="sales-report">
    <div class="page-header">
      <h1>Informe de Ventas</h1>
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
        <button class="btn" @click="printReport">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"/>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8"/>
          </svg>
          Imprimir
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
          <div class="filter-group">
            <label for="period">Periodo</label>
            <select id="period" v-model="selectedPeriod" class="form-control">
              <option value="daily">Diario</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensual</option>
              <option value="quarterly">Trimestral</option>
              <option value="yearly">Anual</option>
            </select>
          </div>
          <div class="filter-group">
            <label for="category">Categoría</label>
            <select id="category" v-model="selectedCategory" class="form-control">
              <option value="all">Todas las categorías</option>
              <option value="electronics">Electrónica</option>
              <option value="mobile">Móviles</option>
              <option value="peripherals">Periféricos</option>
              <option value="audio">Audio</option>
              <option value="tablets">Tablets</option>
            </select>
          </div>
          <div class="filter-group">
            <label for="region">Región</label>
            <select id="region" v-model="selectedRegion" class="form-control">
              <option value="all">Todas las regiones</option>
              <option value="madrid">Madrid</option>
              <option value="barcelona">Barcelona</option>
              <option value="valencia">Valencia</option>
              <option value="sevilla">Sevilla</option>
              <option value="bilbao">Bilbao</option>
              <option value="malaga">Málaga</option>
              <option value="zaragoza">Zaragoza</option>
              <option value="murcia">Murcia</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <section class="summary-section">
      <div class="card">
        <h2>Resumen de Ventas</h2>
        <div class="summary-grid">
          <div class="summary-item">
            <h3>Ventas Totales</h3>
            <div class="summary-value">{{ formatCurrency(salesSummary.totalSales) }}</div>
            <div class="summary-change positive">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="18 15 12 9 6 15"/>
              </svg>
              {{ salesSummary.compareToLastPeriod }}% vs periodo anterior
            </div>
          </div>
          <div class="summary-item">
            <h3>Valor Medio de Pedido</h3>
            <div class="summary-value">{{ formatCurrency(salesSummary.averageOrderValue) }}</div>
          </div>
          <div class="summary-item">
            <h3>Tasa de Conversión</h3>
            <div class="summary-value">{{ salesSummary.conversionRate }}%</div>
          </div>
          <div class="summary-item">
            <h3>Producto Más Vendido</h3>
            <div class="summary-value">{{ salesSummary.topSellingProduct }}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="charts-section">
      <div class="chart-container">
        <h2>Tendencia de Ventas</h2>
        <div class="chart-placeholder">
          <p>Aquí iría un gráfico de líneas mostrando la tendencia de ventas a lo largo del tiempo</p>
        </div>
      </div>

      <div class="chart-container">
        <h2>Ventas por Categoría</h2>
        <div class="chart-placeholder">
          <p>Aquí iría un gráfico circular mostrando la distribución de ventas por categoría</p>
        </div>
      </div>

      <div class="chart-container">
        <h2>Comparativa Mensual</h2>
        <div class="chart-placeholder">
          <p>Aquí iría un gráfico de barras comparando las ventas mensuales</p>
        </div>
      </div>

      <div class="chart-container">
        <h2>Ventas por Región</h2>
        <div class="chart-placeholder">
          <p>Aquí iría un mapa de calor mostrando las ventas por región</p>
        </div>
      </div>
    </section>

    <section class="tables-section">
      <div class="table-container">
        <h2>Ventas por Producto</h2>
        <table class="data-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Unidades</th>
              <th>Ingresos</th>
              <th>Crecimiento</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in productSales" :key="product.id">
              <td>{{ product.name }}</td>
              <td>{{ product.category }}</td>
              <td>{{ product.sales }}</td>
              <td>{{ formatCurrency(product.revenue) }}</td>
              <td>
                <span class="growth-indicator" :class="product.growth >= 0 ? 'positive' : 'negative'">
                  <svg v-if="product.growth >= 0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="18 15 12 9 6 15"/>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                  {{ Math.abs(product.growth) }}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="table-container">
        <h2>Ventas por Región</h2>
        <table class="data-table">
          <thead>
            <tr>
              <th>Región</th>
              <th>Unidades</th>
              <th>Ingresos</th>
              <th>Crecimiento</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="region in regionSales" :key="region.id">
              <td>{{ region.name }}</td>
              <td>{{ region.sales }}</td>
              <td>{{ formatCurrency(region.revenue) }}</td>
              <td>
                <span class="growth-indicator" :class="region.growth >= 0 ? 'positive' : 'negative'">
                  <svg v-if="region.growth >= 0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="18 15 12 9 6 15"/>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                  {{ Math.abs(region.growth) }}%
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
.sales-report {
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

@media (min-width: 1024px) {
  .filters-grid {
    grid-template-columns: repeat(5, 1fr);
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
  margin-bottom: var(--spacing-lg);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--spacing-md);
}

@media (min-width: 640px) {
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .summary-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.summary-item {
  padding: var(--spacing-md);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
}

.summary-item h3 {
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

.tables-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

@media (min-width: 1024px) {
  .tables-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

.table-container {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-lg);
  overflow-x: auto;
}

.table-container h2 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-top: 0;
  margin-bottom: var(--spacing-md);
}

.growth-indicator {
  display: flex;
  align-items: center;
  font-weight: var(--font-weight-medium);
}

.growth-indicator svg {
  margin-right: var(--spacing-xs);
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