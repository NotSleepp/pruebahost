<template>
  <div class="not-found-view">
    <div class="not-found-container">
      <div class="not-found-content">
        <div class="error-code">404</div>
        <h1>Página no encontrada</h1>
        <p>Lo sentimos, la página que estás buscando no existe o ha sido movida.</p>
        <div class="actions">
          <router-link to="/" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
              <path fill="none" d="M0 0h24v24H0z"/>
              <path d="M19 20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9H0l10.327-9.388a1 1 0 0 1 1.346 0L22 11h-3v9zm-8-5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" fill="currentColor"/>
            </svg>
            Volver al inicio
          </router-link>
          <button @click="goBack" class="btn btn-outline">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
              <path fill="none" d="M0 0h24v24H0z"/>
              <path d="M7.828 11H20v2H7.828l5.364 5.364-1.414 1.414L4 12l7.778-7.778 1.414 1.414z" fill="currentColor"/>
            </svg>
            Volver atrás
          </button>
        </div>
      </div>
      <div class="not-found-illustration">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="300" height="300">
          <path fill="var(--primary-light)" d="M91.8 184.7c-14.9 89.8 29.4 193.4 96.6 227.4 67.2 33.9 157.2-1.8 215.5-48.1 58.3-46.3 84.9-103.1 70.1-183.2-14.8-80.2-70.9-183.7-151.2-189.4-80.2-5.7-216.1 103.5-231 193.3z"/>
          <path fill="var(--primary)" d="M177.4 217.4l-7.8-5.3c-2.5-1.7-3.2-5.1-1.5-7.6l14.6-21.4c1.7-2.5 5.1-3.2 7.6-1.5l7.8 5.3c2.5 1.7 3.2 5.1 1.5 7.6l-14.6 21.4c-1.7 2.5-5.1 3.2-7.6 1.5z"/>
          <path fill="var(--primary)" d="M306.9 217.4l7.8-5.3c2.5-1.7 3.2-5.1 1.5-7.6l-14.6-21.4c-1.7-2.5-5.1-3.2-7.6-1.5l-7.8 5.3c-2.5 1.7-3.2 5.1-1.5 7.6l14.6 21.4c1.7 2.5 5.1 3.2 7.6 1.5z"/>
          <path fill="var(--card-bg)" d="M242.5 358.4c-39.2 0-71-31.8-71-71v-71.8c0-39.2 31.8-71 71-71s71 31.8 71 71v71.8c0 39.2-31.8 71-71 71z"/>
          <path fill="none" stroke="var(--text-muted)" stroke-width="5" stroke-linecap="round" d="M217.5 272.4c10 10 25 10 35 0"/>
          <circle fill="var(--text-color)" cx="202.5" cy="232.4" r="7.5"/>
          <circle fill="var(--text-color)" cx="282.5" cy="232.4" r="7.5"/>
          <path fill="var(--primary-light)" d="M242.5 145.4v-35c0-5.5 4.5-10 10-10h60c5.5 0 10 4.5 10 10v35"/>
          <path fill="var(--primary-light)" d="M242.5 145.4v-35c0-5.5-4.5-10-10-10h-60c-5.5 0-10 4.5-10 10v35"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style>
.not-found-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: var(--bg-color);
}

.not-found-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1000px;
  width: 100%;
}

@media (min-width: 768px) {
  .not-found-container {
    flex-direction: row;
    justify-content: space-between;
  }
}

.not-found-content {
  text-align: center;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .not-found-content {
    text-align: left;
    margin-bottom: 0;
    margin-right: 2rem;
  }
}

.error-code {
  font-size: 6rem;
  font-weight: 700;
  line-height: 1;
  color: var(--primary);
  margin-bottom: 1rem;
}

.not-found-content h1 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.not-found-content p {
  font-size: 1.125rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
  max-width: 400px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

@media (min-width: 768px) {
  .actions {
    justify-content: flex-start;
  }
}

.actions .btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.not-found-illustration {
  flex-shrink: 0;
}
</style>