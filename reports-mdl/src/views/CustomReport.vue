<script setup>
import { ref, reactive, computed } from 'vue';

// Estado para la configuración del informe
const reportConfig = reactive({
  title: 'Informe Personalizado',
  description: '',
  dateRange: {
    start: '',
    end: ''
  },
  metrics: [],
  dimensions: [],
  filters: [],
  sortBy: '',
  sortDirection: 'desc',
  limit: 10,
  chartType: 'bar'
});

// Opciones disponibles para métricas
const availableMetrics = ref([
  { id: 'sales', name: 'Ventas' },
  { id: 'revenue', name: 'Ingresos' },
  { id: 'orders', name: 'Pedidos' },
  { id: 'customers', name: 'Clientes' },
  { id: 'avg_order_value', name: 'Valor Medio de Pedido' },
  { id: 'conversion_rate', name: 'Tasa de Conversión' },
  { id: 'cart_abandonment', name: 'Abandono de Carrito' },
  { id: 'profit_margin', name: 'Margen de Beneficio' }
]);

// Opciones disponibles para dimensiones
const availableDimensions = ref([
  { id: 'date', name: 'Fecha' },
  { id: 'product', name: 'Producto' },
  { id: 'category', name: 'Categoría' },
  { id: 'region', name: 'Región' },
  { id: 'customer', name: 'Cliente' },
  { id: 'payment_method', name: 'Método de Pago' },
  { id: 'shipping_method', name: 'Método de Envío' },
  { id: 'campaign', name: 'Campaña' }
]);

// Opciones disponibles para filtros
const availableFilters = ref([
  { id: 'product_category', name: 'Categoría de Producto', type: 'select', options: ['Electrónica', 'Móviles', 'Periféricos', 'Audio', 'Tablets'] },
  { id: 'region', name: 'Región', type: 'select', options: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Málaga', 'Zaragoza', 'Murcia'] },
  { id: 'payment_method', name: 'Método de Pago', type: 'select', options: ['Tarjeta de Crédito', 'PayPal', 'Transferencia', 'Contra reembolso'] },
  { id: 'min_order_value', name: 'Valor Mínimo de Pedido', type: 'number' },
  { id: 'max_order_value', name: 'Valor Máximo de Pedido', type: 'number' },
  { id: 'customer_type', name: 'Tipo de Cliente', type: 'select', options: ['Nuevo', 'Recurrente'] }
]);

// Opciones disponibles para tipos de gráficos
const chartTypes = ref([
  { id: 'bar', name: 'Barras' },
  { id: 'line', name: 'Líneas' },
  { id: 'pie', name: 'Circular' },
  { id: 'area', name: 'Área' },
  { id: 'scatter', name: 'Dispersión' },
  { id: 'table', name: 'Tabla (sin gráfico)' }
]);

// Estado para el informe generado
const reportGenerated = ref(false);
const isGenerating = ref(false);
const reportData = ref(null);

// Validación del formulario
const formErrors = computed(() => {
  const errors = [];
  
  if (!reportConfig.title) {
    errors.push('El título del informe es obligatorio');
  }
  
  if (!reportConfig.dateRange.start || !reportConfig.dateRange.end) {
    errors.push('El rango de fechas es obligatorio');
  }
  
  if (reportConfig.metrics.length === 0) {
    errors.push('Debes seleccionar al menos una métrica');
  }
  
  if (reportConfig.dimensions.length === 0) {
    errors.push('Debes seleccionar al menos una dimensión');
  }
  
  return errors;
});

const isFormValid = computed(() => formErrors.value.length === 0);

// Función para añadir un filtro
const addFilter = () => {
  reportConfig.filters.push({
    field: '',
    operator: 'equals',
    value: ''
  });
};

// Función para eliminar un filtro
const removeFilter = (index) => {
  reportConfig.filters.splice(index, 1);
};

// Función para generar el informe
const generateReport = () => {
  if (!isFormValid.value) return;
  
  isGenerating.value = true;
  
  // Simulamos una llamada a API
  setTimeout(() => {
    // Datos de ejemplo para el informe generado
    reportData.value = {
      title: reportConfig.title,
      description: reportConfig.description,
      dateRange: reportConfig.dateRange,
      generatedAt: new Date().toISOString(),
      data: [
        { dimension: 'Electrónica', metric: 125000 },
        { dimension: 'Móviles', metric: 98000 },
        { dimension: 'Periféricos', metric: 45000 },
        { dimension: 'Audio', metric: 32000 },
        { dimension: 'Tablets', metric: 28000 }
      ]
    };
    
    reportGenerated.value = true;
    isGenerating.value = false;
  }, 1500);
};

// Función para guardar el informe
const saveReport = () => {
  // Aquí iría la lógica para guardar la configuración del informe
  alert('Informe guardado correctamente');
};

// Función para exportar el informe
const exportReport = () => {
  // Aquí iría la lógica para exportar el informe a CSV o Excel
  alert('Exportando informe...');
};

// Función para compartir el informe
const shareReport = () => {
  // Aquí iría la lógica para compartir el informe
  alert('Compartiendo informe...');
};

// Función para resetear el formulario
const resetForm = () => {
  Object.assign(reportConfig, {
    title: 'Informe Personalizado',
    description: '',
    dateRange: {
      start: '',
      end: ''
    },
    metrics: [],
    dimensions: [],
    filters: [],
    sortBy: '',
    sortDirection: 'desc',
    limit: 10,
    chartType: 'bar'
  });
  
  reportGenerated.value = false;
  reportData.value = null;
};
</script>

<template>
  <div class="custom-report">
    <div class="page-header">
      <h1>Crear Informe Personalizado</h1>
      <div class="actions">
        <button class="btn btn-secondary" @click="resetForm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
          Reiniciar
        </button>
        <button class="btn" @click="saveReport" :disabled="!isFormValid">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
          </svg>
          Guardar
        </button>
      </div>
    </div>

    <div class="report-builder-container">
      <div class="report-config-panel">
        <div class="card">
          <h2>Configuración del Informe</h2>
          
          <div v-if="formErrors.length > 0" class="error-messages">
            <p v-for="(error, index) in formErrors" :key="index" class="error-message">
              {{ error }}
            </p>
          </div>
          
          <div class="form-group">
            <label for="report-title">Título del Informe</label>
            <input type="text" id="report-title" v-model="reportConfig.title" class="form-control" placeholder="Introduce un título para el informe" />
          </div>
          
          <div class="form-group">
            <label for="report-description">Descripción (opcional)</label>
            <textarea id="report-description" v-model="reportConfig.description" class="form-control" rows="2" placeholder="Describe el propósito de este informe"></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="date-start">Fecha Inicio</label>
              <input type="date" id="date-start" v-model="reportConfig.dateRange.start" class="form-control" />
            </div>
            <div class="form-group">
              <label for="date-end">Fecha Fin</label>
              <input type="date" id="date-end" v-model="reportConfig.dateRange.end" class="form-control" />
            </div>
          </div>
          
          <div class="form-group">
            <label>Métricas</label>
            <div class="checkbox-group">
              <div v-for="metric in availableMetrics" :key="metric.id" class="checkbox-item">
                <input type="checkbox" :id="`metric-${metric.id}`" :value="metric.id" v-model="reportConfig.metrics" />
                <label :for="`metric-${metric.id}`">{{ metric.name }}</label>
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label>Dimensiones</label>
            <div class="checkbox-group">
              <div v-for="dimension in availableDimensions" :key="dimension.id" class="checkbox-item">
                <input type="checkbox" :id="`dimension-${dimension.id}`" :value="dimension.id" v-model="reportConfig.dimensions" />
                <label :for="`dimension-${dimension.id}`">{{ dimension.name }}</label>
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label>Filtros</label>
            <div v-if="reportConfig.filters.length === 0" class="empty-state">
              <p>No hay filtros configurados</p>
            </div>
            <div v-else class="filters-list">
              <div v-for="(filter, index) in reportConfig.filters" :key="index" class="filter-item">
                <select v-model="filter.field" class="form-control">
                  <option value="">Selecciona un campo</option>
                  <option v-for="f in availableFilters" :key="f.id" :value="f.id">{{ f.name }}</option>
                </select>
                <select v-model="filter.operator" class="form-control">
                  <option value="equals">Igual a</option>
                  <option value="not_equals">Diferente de</option>
                  <option value="greater_than">Mayor que</option>
                  <option value="less_than">Menor que</option>
                  <option value="contains">Contiene</option>
                </select>
                <input type="text" v-model="filter.value" class="form-control" placeholder="Valor" />
                <button class="btn btn-icon btn-error" @click="removeFilter(index)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>
            <button class="btn btn-secondary btn-sm" @click="addFilter">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Añadir Filtro
            </button>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="sort-by">Ordenar por</label>
              <select id="sort-by" v-model="reportConfig.sortBy" class="form-control">
                <option value="">Selecciona un campo</option>
                <option v-for="metric in availableMetrics" :key="metric.id" :value="metric.id">{{ metric.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label for="sort-direction">Dirección</label>
              <select id="sort-direction" v-model="reportConfig.sortDirection" class="form-control">
                <option value="asc">Ascendente</option>
                <option value="desc">Descendente</option>
              </select>
            </div>
            <div class="form-group">
              <label for="limit">Límite</label>
              <input type="number" id="limit" v-model.number="reportConfig.limit" class="form-control" min="1" max="100" />
            </div>
          </div>
          
          <div class="form-group">
            <label for="chart-type">Tipo de Gráfico</label>
            <select id="chart-type" v-model="reportConfig.chartType" class="form-control">
              <option v-for="chart in chartTypes" :key="chart.id" :value="chart.id">{{ chart.name }}</option>
            </select>
          </div>
          
          <div class="form-actions">
            <button class="btn btn-primary" @click="generateReport" :disabled="!isFormValid || isGenerating">
              <span v-if="isGenerating">Generando...</span>
              <span v-else>Generar Informe</span>
            </button>
          </div>
        </div>
      </div>
      
      <div class="report-preview-panel">
        <div class="card" v-if="!reportGenerated">
          <div class="empty-preview">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            <h3>Vista Previa del Informe</h3>
            <p>Configura y genera tu informe para ver una vista previa aquí</p>
          </div>
        </div>
        
        <div class="card" v-else>
          <div class="report-preview-header">
            <h2>{{ reportData.title }}</h2>
            <p v-if="reportData.description" class="report-description">{{ reportData.description }}</p>
            <div class="report-meta">
              <p>Periodo: {{ new Date(reportData.dateRange.start).toLocaleDateString() }} - {{ new Date(reportData.dateRange.end).toLocaleDateString() }}</p>
              <p>Generado: {{ new Date(reportData.generatedAt).toLocaleString() }}</p>
            </div>
          </div>
          
          <div class="report-preview-content">
            <div class="chart-container">
              <div class="chart-placeholder">
                <p>Aquí se mostraría el gráfico de tipo "{{ reportConfig.chartType }}" con los datos del informe</p>
              </div>
            </div>
            
            <div class="report-data-table">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Dimensión</th>
                    <th>Métrica</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in reportData.data" :key="index">
                    <td>{{ item.dimension }}</td>
                    <td>{{ item.metric.toLocaleString() }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="report-preview-actions">
            <button class="btn" @click="exportReport">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Exportar
            </button>
            <button class="btn" @click="shareReport">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              Compartir
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.custom-report {
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

.report-builder-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-lg);
}

@media (min-width: 1024px) {
  .report-builder-container {
    grid-template-columns: 1fr 1fr;
  }
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

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-group label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-xs);
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

.form-row {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

@media (min-width: 640px) {
  .form-row {
    grid-template-columns: repeat(3, 1fr);
  }
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--spacing-sm);
}

@media (min-width: 640px) {
  .checkbox-group {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .checkbox-group {
    grid-template-columns: repeat(3, 1fr);
  }
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.checkbox-item input[type="checkbox"] {
  margin: 0;
}

.empty-state {
  padding: var(--spacing-md);
  background-color: var(--color-background);
  border-radius: var(--border-radius-md);
  text-align: center;
  color: var(--color-text-light);
}

.filters-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.filter-item {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr auto;
  gap: var(--spacing-sm);
  align-items: center;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
}

.btn-sm {
  font-size: var(--font-size-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
}

.form-actions {
  margin-top: var(--spacing-lg);
}

.error-messages {
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-sm);
  background-color: rgba(var(--color-error-rgb), 0.1);
  border-radius: var(--border-radius-md);
  border-left: 3px solid var(--color-error);
}

.error-message {
  color: var(--color-error);
  font-size: var(--font-size-sm);
  margin: var(--spacing-xs) 0;
}

.empty-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl) 0;
  color: var(--color-text-light);
  text-align: center;
}

.empty-preview svg {
  margin-bottom: var(--spacing-md);
  opacity: 0.5;
}

.empty-preview h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-sm);
}

.report-preview-header {
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.report-description {
  color: var(--color-text-light);
  margin-bottom: var(--spacing-md);
}

.report-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
}

.report-preview-content {
  margin-bottom: var(--spacing-lg);
}

.chart-container {
  margin-bottom: var(--spacing-lg);
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

.report-preview-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}
</style>