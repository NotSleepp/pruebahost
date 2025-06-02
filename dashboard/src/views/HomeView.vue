<template>
  <div class="home-view">
    <div class="dashboard-header">
      <h1>Dashboard</h1>
      <div class="dashboard-actions">
        <button class="btn btn-primary" @click="refreshData">
          <span class="icon">↻</span> Actualizar
        </button>
      </div>
    </div>

    <!-- Estadísticas rápidas -->
    <div class="stats-container">
      <div class="stat-card" v-for="(stat, index) in stats" :key="index">
        <div class="stat-icon" :class="stat.color">
          <span v-html="stat.icon"></span>
        </div>
        <div class="stat-content">
          <h3 class="stat-value">{{ stat.value }}</h3>
          <p class="stat-label">{{ stat.label }}</p>
        </div>
        <div class="stat-change" :class="stat.trend === 'up' ? 'trend-up' : 'trend-down'">
          <span class="trend-icon">{{ stat.trend === 'up' ? '↑' : '↓' }}</span>
          <span class="trend-value">{{ stat.changePercent }}</span>
        </div>
      </div>
    </div>

    <!-- Gráficos y tablas -->
    <div class="dashboard-content">
      <div class="dashboard-row">
        <!-- Gráfico principal -->
        <div class="dashboard-card chart-card">
          <div class="card-header">
            <h2>Rendimiento</h2>
            <div class="card-actions">
              <select v-model="chartPeriod" class="select-sm">
                <option value="day">Hoy</option>
                <option value="week">Esta semana</option>
                <option value="month">Este mes</option>
                <option value="year">Este año</option>
              </select>
            </div>
          </div>
          <div class="card-body">
            <div class="chart-container" ref="chartContainer">
              <canvas ref="performanceChart"></canvas>
              <div v-if="isLoading" class="loading-overlay">
                <div class="spinner"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actividades recientes -->
        <div class="dashboard-card">
          <div class="card-header">
            <h2>Actividades recientes</h2>
            <div class="card-actions">
              <button class="btn btn-text" @click="loadMoreActivities">
                Ver todas
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="activity-list">
              <div v-if="isLoading" class="loading-state">
                <div class="spinner"></div>
                <p>Cargando actividades...</p>
              </div>
              <div v-else-if="activities.length === 0" class="empty-state">
                <p>No hay actividades recientes</p>
              </div>
              <div v-else class="activity-item" v-for="(activity, index) in activities" :key="index">
                <div class="activity-icon" :class="activity.type">
                  <span v-html="getActivityIcon(activity.type)"></span>
                </div>
                <div class="activity-content">
                  <p class="activity-text">{{ activity.text }}</p>
                  <p class="activity-time">{{ formatTime(activity.time) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-row">
        <!-- Tareas pendientes -->
        <div class="dashboard-card">
          <div class="card-header">
            <h2>Tareas pendientes</h2>
            <div class="card-actions">
              <button class="btn btn-primary btn-sm" @click="showNewTaskModal = true">
                <span class="icon">+</span> Nueva tarea
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="table-container">
              <table class="table">
                <thead>
                  <tr>
                    <th>Tarea</th>
                    <th>Prioridad</th>
                    <th>Fecha límite</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="isLoading">
                    <td colspan="4" class="loading-state">
                      <div class="spinner"></div>
                      <p>Cargando tareas...</p>
                    </td>
                  </tr>
                  <tr v-else-if="tasks.length === 0">
                    <td colspan="4" class="empty-state">
                      <p>No hay tareas pendientes</p>
                    </td>
                  </tr>
                  <tr v-else v-for="(task, index) in tasks" :key="index">
                    <td>
                      <div class="task-title">
                        <input type="checkbox" :checked="task.completed" @change="toggleTaskStatus(index)">
                        <span :class="{ 'completed': task.completed }">{{ task.title }}</span>
                      </div>
                    </td>
                    <td>
                      <span class="badge" :class="getPriorityClass(task.priority)">
                        {{ task.priority }}
                      </span>
                    </td>
                    <td>{{ formatDate(task.dueDate) }}</td>
                    <td>
                      <div class="table-actions">
                        <button class="btn btn-icon btn-sm" @click="editTask(index)">
                          <span class="icon">✏️</span>
                        </button>
                        <button class="btn btn-icon btn-sm btn-danger" @click="deleteTask(index)">
                          <span class="icon">🗑️</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para nueva tarea -->
    <div class="modal" :class="{ 'modal-open': showNewTaskModal }">
      <div class="modal-backdrop" @click="showNewTaskModal = false"></div>
      <div class="modal-container">
        <div class="modal-header">
          <h3>{{ editingTask !== null ? 'Editar tarea' : 'Nueva tarea' }}</h3>
          <button class="btn btn-icon" @click="showNewTaskModal = false">
            <span class="icon">×</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveTask">
            <div class="form-group">
              <label for="taskTitle">Título</label>
              <input 
                type="text" 
                id="taskTitle" 
                v-model="newTask.title" 
                class="form-control" 
                required
              >
            </div>
            <div class="form-group">
              <label for="taskPriority">Prioridad</label>
              <select id="taskPriority" v-model="newTask.priority" class="form-control">
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
            <div class="form-group">
              <label for="taskDueDate">Fecha límite</label>
              <input 
                type="date" 
                id="taskDueDate" 
                v-model="newTask.dueDate" 
                class="form-control" 
                required
              >
            </div>
            <div class="form-group">
              <label for="taskDescription">Descripción</label>
              <textarea 
                id="taskDescription" 
                v-model="newTask.description" 
                class="form-control"
                rows="3"
              ></textarea>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-text" @click="showNewTaskModal = false">Cancelar</button>
              <button type="submit" class="btn btn-primary">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue';
import { formatDate as formatDateUtil } from '@/utils/formatters';

export default {
  name: 'HomeView',
  setup() {
    const isLoading = ref(false);
    const chartPeriod = ref('week');
    const showNewTaskModal = ref(false);
    const editingTask = ref(null);
    const chartContainer = ref(null);
    const performanceChart = ref(null);
    let chart = null;

    // Datos simulados para estadísticas
    const stats = ref([
      {
        label: 'Usuarios',
        value: '1,234',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 2a5 5 0 0 1 5 5v2a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v2a3 3 0 0 0 6 0V7a3 3 0 0 0-3-3zm9 9v6a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3zm-2 0a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6z"/></svg>',
        color: 'color-blue',
        trend: 'up',
        changePercent: '12%'
      },
      {
        label: 'Ingresos',
        value: '$8,540',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-3.5-6H14a.5.5 0 1 0 0-1h-4a2.5 2.5 0 1 1 0-5h1V6h2v2h2.5v2H10a.5.5 0 1 0 0 1h4a2.5 2.5 0 1 1 0 5h-1v2h-2v-2H8.5v-2z"/></svg>',
        color: 'color-green',
        trend: 'up',
        changePercent: '8.5%'
      },
      {
        label: 'Pedidos',
        value: '356',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M4 6.414L.757 3.172l1.415-1.415L5.414 5h15.242a1 1 0 0 1 .958 1.287l-2.4 8a1 1 0 0 1-.958.713H6v2h11v2H5a1 1 0 0 1-1-1V6.414zM6 7v6h11.512l1.8-6H6zm-.5 16a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm12 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/></svg>',
        color: 'color-purple',
        trend: 'up',
        changePercent: '5.2%'
      },
      {
        label: 'Visitas',
        value: '12,543',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 3a3 3 0 0 1 3 3v1h1v5H8v-5h1v-1a3 3 0 0 1 3-3zm0 2a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1z"/></svg>',
        color: 'color-orange',
        trend: 'down',
        changePercent: '3.1%'
      }
    ]);

    // Datos simulados para actividades
    const activities = ref([
      {
        text: 'Juan Pérez ha iniciado sesión',
        time: new Date(Date.now() - 15 * 60000),
        type: 'login'
      },
      {
        text: 'María García ha creado un nuevo usuario',
        time: new Date(Date.now() - 45 * 60000),
        type: 'create'
      },
      {
        text: 'Carlos López ha actualizado la configuración',
        time: new Date(Date.now() - 120 * 60000),
        type: 'update'
      },
      {
        text: 'Ana Martínez ha eliminado un registro',
        time: new Date(Date.now() - 240 * 60000),
        type: 'delete'
      },
      {
        text: 'Pedro Sánchez ha exportado un informe',
        time: new Date(Date.now() - 360 * 60000),
        type: 'export'
      }
    ]);

    // Datos simulados para tareas
    const tasks = ref([
      {
        title: 'Actualizar documentación',
        priority: 'Alta',
        dueDate: '2023-12-15',
        completed: false,
        description: 'Actualizar la documentación del proyecto con los últimos cambios.'
      },
      {
        title: 'Revisar pull requests',
        priority: 'Media',
        dueDate: '2023-12-18',
        completed: false,
        description: 'Revisar y aprobar los pull requests pendientes.'
      },
      {
        title: 'Preparar presentación',
        priority: 'Alta',
        dueDate: '2023-12-20',
        completed: false,
        description: 'Preparar la presentación para la reunión con el cliente.'
      },
      {
        title: 'Optimizar rendimiento',
        priority: 'Baja',
        dueDate: '2023-12-25',
        completed: false,
        description: 'Optimizar el rendimiento de la aplicación.'
      },
      {
        title: 'Actualizar dependencias',
        priority: 'Media',
        dueDate: '2023-12-28',
        completed: true,
        description: 'Actualizar las dependencias del proyecto a las últimas versiones.'
      }
    ]);

    // Tarea nueva o en edición
    const newTask = ref({
      title: '',
      priority: 'Media',
      dueDate: '',
      completed: false,
      description: ''
    });

    // Formatear fecha
    const formatDate = (date) => {
      return formatDateUtil(date);
    };

    // Formatear tiempo relativo
    const formatTime = (time) => {
      const now = new Date();
      const diff = Math.floor((now - new Date(time)) / 60000); // diferencia en minutos
      
      if (diff < 1) return 'Justo ahora';
      if (diff < 60) return `Hace ${diff} minutos`;
      if (diff < 1440) {
        const hours = Math.floor(diff / 60);
        return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
      }
      
      const days = Math.floor(diff / 1440);
      return `Hace ${days} ${days === 1 ? 'día' : 'días'}`;
    };

    // Obtener clase CSS según prioridad
    const getPriorityClass = (priority) => {
      switch (priority) {
        case 'Alta': return 'badge-error';
        case 'Media': return 'badge-warning';
        case 'Baja': return 'badge-info';
        default: return '';
      }
    };

    // Obtener icono según tipo de actividad
    const getActivityIcon = (type) => {
      switch (type) {
        case 'login': return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M10 11V8l5 4-5 4v-3H1v-2h9zm-7.542 4h2.124A8.003 8.003 0 0 0 20 12 8 8 0 0 0 4.582 9H2.458C3.732 4.943 7.522 2 12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10c-4.478 0-8.268-2.943-9.542-7z"/></svg>';
        case 'create': return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>';
        case 'update': return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M5.463 4.433A9.961 9.961 0 0 1 12 2c5.523 0 10 4.477 10 10 0 2.136-.67 4.116-1.81 5.74L17 12h3A8 8 0 0 0 6.46 6.228l-.997-1.795zm13.074 15.134A9.961 9.961 0 0 1 12 22C6.477 22 2 17.523 2 12c0-2.136.67-4.116 1.81-5.74L7 12H4a8 8 0 0 0 13.54 5.772l.997 1.795z"/></svg>';
        case 'delete': return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-9 3h2v6H9v-6zm4 0h2v6h-2v-6zM9 4v2h6V4H9z"/></svg>';
        case 'export': return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M13 10h5l-6 6-6-6h5V3h2v7zm-9 9h16v-7h2v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-8h2v7z"/></svg>';
        default: return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z"/></svg>';
      }
    };

    // Cargar más actividades
    const loadMoreActivities = () => {
      // Simulación de carga
      isLoading.value = true;
      setTimeout(() => {
        // Añadir más actividades simuladas
        activities.value.push(
          {
            text: 'Roberto Díaz ha actualizado su perfil',
            time: new Date(Date.now() - 480 * 60000),
            type: 'update'
          },
          {
            text: 'Laura Gómez ha creado un nuevo proyecto',
            time: new Date(Date.now() - 600 * 60000),
            type: 'create'
          },
          {
            text: 'Javier Ruiz ha enviado un mensaje',
            time: new Date(Date.now() - 720 * 60000),
            type: 'message'
          }
        );
        isLoading.value = false;
      }, 1000);
    };

    // Cambiar estado de una tarea
    const toggleTaskStatus = (index) => {
      tasks.value[index].completed = !tasks.value[index].completed;
    };

    // Editar una tarea
    const editTask = (index) => {
      editingTask.value = index;
      newTask.value = { ...tasks.value[index] };
      showNewTaskModal.value = true;
    };

    // Eliminar una tarea
    const deleteTask = (index) => {
      if (confirm('¿Está seguro de que desea eliminar esta tarea?')) {
        tasks.value.splice(index, 1);
      }
    };

    // Guardar una tarea (nueva o editada)
    const saveTask = () => {
      if (editingTask.value !== null) {
        // Actualizar tarea existente
        tasks.value[editingTask.value] = { ...newTask.value };
        editingTask.value = null;
      } else {
        // Añadir nueva tarea
        tasks.value.push({ ...newTask.value });
      }
      
      // Resetear formulario y cerrar modal
      newTask.value = {
        title: '',
        priority: 'Media',
        dueDate: '',
        completed: false,
        description: ''
      };
      showNewTaskModal.value = false;
    };

    // Actualizar datos
    const refreshData = () => {
      isLoading.value = true;
      setTimeout(() => {
        // Simular actualización de datos
        stats.value[0].value = '1,256';
        stats.value[1].value = '$8,720';
        stats.value[2].value = '362';
        stats.value[3].value = '12,678';
        
        // Actualizar gráfico
        updateChart();
        
        isLoading.value = false;
      }, 1000);
    };

    // Inicializar y actualizar gráfico
    const initChart = () => {
      if (!chartContainer.value) return;
      
      // Importar Chart.js dinámicamente para evitar problemas de SSR
      import('chart.js').then((ChartModule) => {
        // Verificar que ChartModule no sea undefined
        if (!ChartModule) {
          console.error('No se pudo cargar Chart.js');
          return;
        }
        
        try {
          // Acceder a Chart y los componentes necesarios
          const { 
            Chart, 
            LineController, 
            CategoryScale, 
            LinearScale, 
            PointElement, 
            LineElement, 
            Title, 
            Tooltip, 
            Legend 
          } = ChartModule;
          
          // Registrar los componentes necesarios
          Chart.register(
            LineController,
            CategoryScale, 
            LinearScale, 
            PointElement, 
            LineElement, 
            Title,
            Tooltip,
            Legend
          );
          
          // Crear el gráfico
          const ctx = performanceChart.value.getContext('2d');
          
          chart = new Chart(ctx, {
            type: 'line',
            data: getChartData(),
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            },
          });
        } catch (error) {
          console.error('Error al inicializar Chart.js:', error);
        }
      }).catch(error => {
        console.error('Error al cargar el módulo Chart.js:', error);
      });
    };

    // Actualizar datos del gráfico
    const updateChart = () => {
      if (!chart) return;
      
      chart.data = getChartData();
      chart.update();
    };

    // Obtener datos para el gráfico según el período seleccionado
    const getChartData = () => {
      let labels, data1, data2;
      
      switch (chartPeriod.value) {
        case 'day':
          labels = ['8am', '10am', '12pm', '2pm', '4pm', '6pm'];
          data1 = [30, 45, 60, 75, 65, 55];
          data2 = [20, 35, 40, 60, 75, 80];
          break;
        case 'week':
          labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
          data1 = [65, 59, 80, 81, 56, 55, 40];
          data2 = [28, 48, 40, 19, 86, 27, 90];
          break;
        case 'month':
          labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
          data1 = [65, 59, 80, 81];
          data2 = [28, 48, 40, 19];
          break;
        case 'year':
          labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
          data1 = [65, 59, 80, 81, 56, 55, 40, 45, 60, 70, 75, 80];
          data2 = [28, 48, 40, 19, 86, 27, 90, 65, 59, 80, 81, 56];
          break;
        default:
          labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
          data1 = [65, 59, 80, 81, 56, 55, 40];
          data2 = [28, 48, 40, 19, 86, 27, 90];
      }
      
      return {
        labels,
        datasets: [
          {
            label: 'Usuarios',
            data: data1,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.4
          },
          {
            label: 'Ventas',
            data: data2,
            borderColor: 'rgb(153, 102, 255)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            tension: 0.4
          }
        ]
      };
    };

    // Observar cambios en el período del gráfico
    watch(chartPeriod, () => {
      updateChart();
    });

    // Inicializar al montar el componente
    onMounted(() => {
      // Simular carga inicial
      isLoading.value = true;
      setTimeout(() => {
        isLoading.value = false;
        // Inicializar gráfico después de que el DOM esté listo
        initChart();
      }, 1000);
    });

    return {
      isLoading,
      stats,
      activities,
      tasks,
      chartPeriod,
      showNewTaskModal,
      newTask,
      editingTask,
      chartContainer,
      performanceChart,
      formatDate,
      formatTime,
      getPriorityClass,
      getActivityIcon,
      loadMoreActivities,
      toggleTaskStatus,
      editTask,
      deleteTask,
      saveTask,
      refreshData
    };
  }
};
</script>

<style>
/* Estilos específicos para HomeView */
.home-view {
  padding: 1.5rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.dashboard-header h1 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
}

.dashboard-actions {
  display: flex;
  gap: 0.5rem;
}

/* Estadísticas */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 1.25rem;
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  margin-right: 1rem;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
  fill: white;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0;
}

.stat-change {
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.trend-icon {
  margin-right: 0.25rem;
}

.trend-up {
  color: var(--success);
}

.trend-down {
  color: var(--error);
}

/* Colores para los iconos de estadísticas */
.color-blue {
  background-color: var(--primary);
}

.color-green {
  background-color: var(--success);
}

.color-purple {
  background-color: var(--secondary);
}

.color-orange {
  background-color: var(--warning);
}

/* Contenido del dashboard */
.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dashboard-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.dashboard-card {
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
}

.card-header h2 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.card-body {
  padding: 1.25rem;
}

/* Gráfico */
.chart-card {
  min-height: 400px;
}

.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}

/* Actividades */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.activity-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.activity-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 0.75rem;
  background-color: var(--primary-light);
}

.activity-icon svg {
  width: 18px;
  height: 18px;
  fill: var(--primary);
}

.activity-icon.login {
  background-color: var(--primary-light);
}

.activity-icon.login svg {
  fill: var(--primary);
}

.activity-icon.create {
  background-color: var(--success-light);
}

.activity-icon.create svg {
  fill: var(--success);
}

.activity-icon.update {
  background-color: var(--warning-light);
}

.activity-icon.update svg {
  fill: var(--warning);
}

.activity-icon.delete {
  background-color: var(--error-light);
}

.activity-icon.delete svg {
  fill: var(--error);
}

.activity-icon.export {
  background-color: var(--secondary-light);
}

.activity-icon.export svg {
  fill: var(--secondary);
}

.activity-content {
  flex: 1;
}

.activity-text {
  margin: 0 0 0.25rem 0;
  font-size: 0.9375rem;
}

.activity-time {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--text-muted);
}

/* Tareas */
.task-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.task-title .completed {
  text-decoration: line-through;
  color: var(--text-muted);
}

/* Estados de carga y vacío */
.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  color: var(--text-muted);
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spinner 0.8s linear infinite;
  margin-bottom: 1rem;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

@keyframes spinner {
  to { transform: rotate(360deg); }
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s linear 0.2s, opacity 0.2s;
}

.modal-open {
  visibility: visible;
  opacity: 1;
  transition-delay: 0s;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-container {
  position: relative;
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 1;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.modal-body {
  padding: 1.25rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-row {
    grid-template-columns: 1fr;
  }
  
  .stats-container {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  
  .modal-container {
    max-width: 90%;
  }
}

@media (max-width: 576px) {
  .stats-container {
    grid-template-columns: 1fr;
  }
  
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .table-container {
    overflow-x: auto;
  }
}
</style>