<template>
  <div class="login-view">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
              <path fill="none" d="M0 0h24v24H0z"/>
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-5-7h9v2h-4v3l-5-5zm5-4V6l5 5H8V9h4z" fill="currentColor"/>
            </svg>
          </div>
          <h1>Iniciar sesión</h1>
          <p>Ingrese sus credenciales para acceder al dashboard</p>
        </div>

        <div class="login-body">
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label for="email">Correo electrónico</label>
              <div class="input-group">
                <span class="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                    <path fill="none" d="M0 0h24v24H0z"/>
                    <path d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm17 4.238l-7.928 7.1L4 7.216V19h16V7.238zM4.511 5l7.55 6.662L19.502 5H4.511z" fill="currentColor"/>
                  </svg>
                </span>
                <input 
                  type="email" 
                  id="email" 
                  v-model="email" 
                  class="form-control" 
                  :class="{ 'is-invalid': errors.email }" 
                  placeholder="ejemplo@correo.com" 
                  required
                  autocomplete="email"
                >
              </div>
              <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
            </div>

            <div class="form-group">
              <div class="label-group">
                <label for="password">Contraseña</label>
                <a href="#" class="forgot-password" @click.prevent="forgotPassword">¿Olvidó su contraseña?</a>
              </div>
              <div class="input-group">
                <span class="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                    <path fill="none" d="M0 0h24v24H0z"/>
                    <path d="M18 8h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h2V7a6 6 0 1 1 12 0v1zm-2 0V7a4 4 0 1 0-8 0v1h8zm-5 6v2h2v-2h-2zm-4 0v2h2v-2H7zm8 0v2h2v-2h-2z" fill="currentColor"/>
                  </svg>
                </span>
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  id="password" 
                  v-model="password" 
                  class="form-control" 
                  :class="{ 'is-invalid': errors.password }" 
                  placeholder="••••••••" 
                  required
                  autocomplete="current-password"
                >
                <button 
                  type="button" 
                  class="password-toggle" 
                  @click="showPassword = !showPassword"
                  tabindex="-1"
                >
                  <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                    <path fill="none" d="M0 0h24v24H0z"/>
                    <path d="M12 3c5.392 0 9.878 3.88 10.819 9-.94 5.12-5.427 9-10.819 9-5.392 0-9.878-3.88-10.819-9C2.121 6.88 6.608 3 12 3zm0 16a9.005 9.005 0 0 0 8.777-7 9.005 9.005 0 0 0-17.554 0A9.005 9.005 0 0 0 12 19zm0-2.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9zm0-2a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" fill="currentColor"/>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                    <path fill="none" d="M0 0h24v24H0z"/>
                    <path d="M17.882 19.297A10.949 10.949 0 0 1 12 21c-5.392 0-9.878-3.88-10.819-9a10.982 10.982 0 0 1 3.34-6.066L1.392 2.808l1.415-1.415 19.799 19.8-1.415 1.414-3.31-3.31zM5.935 7.35A8.965 8.965 0 0 0 3.223 12a9.005 9.005 0 0 0 13.201 5.838l-2.028-2.028A4.5 4.5 0 0 1 8.19 9.604L5.935 7.35zm6.979 6.978l-3.242-3.242a2.5 2.5 0 0 0 3.241 3.241zm7.893 2.264l-1.431-1.43A8.935 8.935 0 0 0 20.777 12 9.005 9.005 0 0 0 9.552 5.338L7.974 3.76C9.221 3.27 10.58 3 12 3c5.392 0 9.878 3.88 10.819 9a10.947 10.947 0 0 1-2.012 4.592zm-9.084-9.084a4.5 4.5 0 0 1 4.769 4.769l-4.77-4.769z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
              <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
            </div>

            <div class="form-group remember-me">
              <label class="checkbox">
                <input type="checkbox" v-model="rememberMe">
                <span class="checkbox-label">Recordarme</span>
              </label>
            </div>

            <div class="form-group">
              <button 
                type="submit" 
                class="btn btn-primary btn-block" 
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="spinner-sm"></span>
                <span v-else>Iniciar sesión</span>
              </button>
            </div>
          </form>

          <div class="login-options">
            <p>O inicie sesión con:</p>
            <div class="social-buttons">
              <button class="btn btn-social btn-google" @click="socialLogin('google')">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                  <path fill="none" d="M0 0h24v24H0z"/>
                  <path d="M3.064 7.51A9.996 9.996 0 0 1 12 2c2.695 0 4.959.99 6.69 2.605l-2.867 2.868C14.786 6.482 13.468 5.977 12 5.977c-2.605 0-4.81 1.76-5.595 4.123-.2.6-.314 1.24-.314 1.9 0 .66.114 1.3.314 1.9.786 2.364 2.99 4.123 5.595 4.123 1.345 0 2.49-.355 3.386-.955a4.6 4.6 0 0 0 1.996-3.018H12v-3.868h9.418c.118.654.182 1.336.182 2.045 0 3.046-1.09 5.61-2.982 7.35C16.964 21.105 14.7 22 12 22A9.996 9.996 0 0 1 2 12c0-1.614.386-3.14 1.064-4.49z" fill="currentColor"/>
                </svg>
                Google
              </button>
              <button class="btn btn-social btn-github" @click="socialLogin('github')">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                  <path fill="none" d="M0 0h24v24H0z"/>
                  <path d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476 0-.237-.013-1.024-.013-1.862-2.512.463-3.162-.612-3.362-1.175-.113-.288-.6-1.175-1.025-1.413-.35-.187-.85-.65-.013-.662.788-.013 1.35.725 1.538 1.025.9 1.512 2.338 1.087 2.912.825.088-.65.35-1.087.638-1.337-2.225-.25-4.55-1.113-4.55-4.938 0-1.088.387-1.987 1.025-2.688-.1-.25-.45-1.275.1-2.65 0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337 1.912-1.3 2.75-1.024 2.75-1.024.55 1.375.2 2.4.1 2.65.637.7 1.025 1.587 1.025 2.687 0 3.838-2.337 4.688-4.562 4.938.362.312.675.912.675 1.85 0 1.337-.013 2.412-.013 2.75 0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z" fill="currentColor"/>
                </svg>
                GitHub
              </button>
            </div>
          </div>

          <div class="demo-accounts">
            <p>Cuentas de demostración:</p>
            <div class="demo-buttons">
              <button class="btn btn-sm btn-outline" @click="setDemoAccount('admin')">
                Admin
              </button>
              <button class="btn btn-sm btn-outline" @click="setDemoAccount('user')">
                Usuario
              </button>
            </div>
          </div>
        </div>

        <div class="login-footer">
          <p>¿No tiene una cuenta? <a href="#" @click.prevent="register">Regístrese</a></p>
        </div>
      </div>
    </div>

    <!-- Alerta de notificación -->
    <div class="alert" :class="[alertType, { 'alert-visible': showAlert }]">
      <div class="alert-icon">
        <svg v-if="alertType === 'alert-success'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="none" d="M0 0h24v24H0z"/>
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z" fill="currentColor"/>
        </svg>
        <svg v-else-if="alertType === 'alert-error'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="none" d="M0 0h24v24H0z"/>
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" fill="currentColor"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="none" d="M0 0h24v24H0z"/>
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z" fill="currentColor"/>
        </svg>
      </div>
      <div class="alert-content">
        {{ alertMessage }}
      </div>
      <button class="alert-close" @click="showAlert = false">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
          <path fill="none" d="M0 0h24v24H0z"/>
          <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" fill="currentColor"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store';
import { required, email as emailValidator, minLength } from '@/utils/validators';

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();

    // Estado del formulario
    const email = ref('');
    const password = ref('');
    const rememberMe = ref(false);
    const showPassword = ref(false);
    const isLoading = ref(false);
    const errors = reactive({});

    // Estado de la alerta
    const showAlert = ref(false);
    const alertMessage = ref('');
    const alertType = ref('alert-info');

    // Mostrar alerta
    const showNotification = (message, type = 'alert-info') => {
      alertMessage.value = message;
      alertType.value = type;
      showAlert.value = true;

      // Ocultar después de 5 segundos
      setTimeout(() => {
        showAlert.value = false;
      }, 5000);
    };

    // Validar formulario
    const validateForm = () => {
      errors.email = emailValidator(email.value) !== true ? emailValidator(email.value) : null;
      errors.password = minLength(6)(password.value) !== true ? minLength(6)(password.value) : null;

      return !errors.email && !errors.password;
    };

    // Manejar inicio de sesión
    const handleLogin = async () => {
      if (!validateForm()) return;

      isLoading.value = true;

      try {
        await authStore.login({
          email: email.value,
          password: password.value,
          remember: rememberMe.value
        });

        // Redirigir al dashboard o a la página anterior
        const redirectPath = router.currentRoute.value.query.redirect || '/';
        router.push(redirectPath);
      } catch (error) {
        showNotification(error.message || 'Error al iniciar sesión', 'alert-error');
      } finally {
        isLoading.value = false;
      }
    };

    // Iniciar sesión con redes sociales
    const socialLogin = async (provider) => {
      isLoading.value = true;

      try {
        // Simulación de inicio de sesión con redes sociales
        showNotification(`Inicio de sesión con ${provider} no implementado`, 'alert-info');
        isLoading.value = false;
      } catch (error) {
        showNotification(error.message || `Error al iniciar sesión con ${provider}`, 'alert-error');
        isLoading.value = false;
      }
    };

    // Olvidó contraseña
    const forgotPassword = () => {
      showNotification('Funcionalidad de recuperación de contraseña no implementada', 'alert-info');
    };

    // Registro
    const register = () => {
      showNotification('Funcionalidad de registro no implementada', 'alert-info');
    };

    // Establecer cuenta de demostración
    const setDemoAccount = (type) => {
      if (type === 'admin') {
        email.value = 'admin@example.com';
        password.value = 'admin123';
      } else {
        email.value = 'user@example.com';
        password.value = 'user123';
      }
    };

    return {
      email,
      password,
      rememberMe,
      showPassword,
      isLoading,
      errors,
      showAlert,
      alertMessage,
      alertType,
      handleLogin,
      socialLogin,
      forgotPassword,
      register,
      setDemoAccount
    };
  }
};
</script>

<style>
/* Estilos específicos para LoginView */
.login-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-color);
  padding: 1rem;
}

.login-container {
  width: 100%;
  max-width: 420px;
}

.login-card {
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.login-header {
  padding: 2rem 2rem 1.5rem;
  text-align: center;
}

.logo {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.logo svg {
  color: var(--primary);
}

.login-header h1 {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.login-header p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.9375rem;
}

.login-body {
  padding: 1.5rem 2rem;
}

.login-footer {
  padding: 1.5rem 2rem;
  text-align: center;
  border-top: 1px solid var(--border-color);
  background-color: var(--bg-color-light);
}

.login-footer p {
  margin: 0;
  font-size: 0.9375rem;
}

.login-footer a {
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
}

.login-footer a:hover {
  text-decoration: underline;
}

.label-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.forgot-password {
  font-size: 0.8125rem;
  color: var(--primary);
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 0.75rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-control {
  padding-left: 2.5rem;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:hover {
  color: var(--text-color);
}

.remember-me {
  margin-bottom: 1.5rem;
}

.checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox input {
  margin-right: 0.5rem;
}

.checkbox-label {
  font-size: 0.9375rem;
}

.login-options {
  margin-top: 2rem;
  text-align: center;
}

.login-options p {
  margin: 0 0 1rem;
  font-size: 0.9375rem;
  color: var(--text-muted);
  position: relative;
}

.login-options p::before,
.login-options p::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 30%;
  height: 1px;
  background-color: var(--border-color);
}

.login-options p::before {
  left: 0;
}

.login-options p::after {
  right: 0;
}

.social-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.btn-social {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.9375rem;
  border-radius: var(--border-radius);
  transition: background-color 0.2s, color 0.2s;
}

.btn-google {
  background-color: #fff;
  color: #757575;
  border: 1px solid #ddd;
}

.btn-google:hover {
  background-color: #f1f1f1;
}

.btn-github {
  background-color: #24292e;
  color: #fff;
  border: 1px solid #24292e;
}

.btn-github:hover {
  background-color: #2f363d;
}

.demo-accounts {
  margin-top: 1.5rem;
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.demo-accounts p {
  margin: 0 0 0.75rem;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.demo-buttons {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

/* Alerta */
.alert {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  display: flex;
  align-items: center;
  padding: 1rem 1.25rem;
  border-radius: var(--border-radius);
  background-color: var(--bg-color-light);
  box-shadow: var(--shadow-lg);
  max-width: 400px;
  transform: translateX(calc(100% + 1.5rem));
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
}

.alert-visible {
  transform: translateX(0);
}

.alert-icon {
  margin-right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.alert-content {
  flex: 1;
  font-size: 0.9375rem;
}

.alert-close {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0;
  margin-left: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.alert-close:hover {
  color: var(--text-color);
}

.alert-success {
  background-color: var(--success-light);
  border-left: 4px solid var(--success);
}

.alert-success .alert-icon {
  color: var(--success);
}

.alert-error {
  background-color: var(--error-light);
  border-left: 4px solid var(--error);
}

.alert-error .alert-icon {
  color: var(--error);
}

.alert-info {
  background-color: var(--info-light);
  border-left: 4px solid var(--info);
}

.alert-info .alert-icon {
  color: var(--info);
}

/* Spinner */
.spinner-sm {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spinner 0.8s linear infinite;
  display: inline-block;
}

@keyframes spinner {
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 480px) {
  .login-container {
    max-width: 100%;
  }
  
  .login-header,
  .login-body,
  .login-footer {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  
  .social-buttons {
    flex-direction: column;
  }
  
  .alert {
    left: 1rem;
    right: 1rem;
    max-width: none;
    transform: translateY(calc(100% + 1.5rem));
  }
  
  .alert-visible {
    transform: translateY(0);
  }
}
</style>