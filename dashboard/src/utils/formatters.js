/**
 * Utilidades para formateo de datos
 */

/**
 * Formatea una fecha a formato local
 * @param {string|Date} date - Fecha a formatear
 * @param {Object} options - Opciones de formato
 * @returns {string} - Fecha formateada
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  const defaultOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString(undefined, mergedOptions);
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return '';
  }
};

/**
 * Formatea una fecha y hora a formato local
 * @param {string|Date} date - Fecha a formatear
 * @param {Object} options - Opciones de formato
 * @returns {string} - Fecha y hora formateada
 */
export const formatDateTime = (date, options = {}) => {
  if (!date) return '';
  
  const defaultOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleString(undefined, mergedOptions);
  } catch (error) {
    console.error('Error al formatear fecha y hora:', error);
    return '';
  }
};

/**
 * Formatea un número como moneda
 * @param {number} value - Valor a formatear
 * @param {string} currency - Código de moneda (USD, EUR, etc.)
 * @param {string} locale - Localización (es-ES, en-US, etc.)
 * @returns {string} - Valor formateado como moneda
 */
export const formatCurrency = (value, currency = 'USD', locale = 'es-ES') => {
  if (value === null || value === undefined) return '';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(value);
  } catch (error) {
    console.error('Error al formatear moneda:', error);
    return '';
  }
};

/**
 * Formatea un número con separadores de miles
 * @param {number} value - Valor a formatear
 * @param {number} decimals - Número de decimales
 * @param {string} locale - Localización (es-ES, en-US, etc.)
 * @returns {string} - Valor formateado
 */
export const formatNumber = (value, decimals = 2, locale = 'es-ES') => {
  if (value === null || value === undefined) return '';
  
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  } catch (error) {
    console.error('Error al formatear número:', error);
    return '';
  }
};

/**
 * Formatea un porcentaje
 * @param {number} value - Valor a formatear (0-1)
 * @param {number} decimals - Número de decimales
 * @param {string} locale - Localización (es-ES, en-US, etc.)
 * @returns {string} - Valor formateado como porcentaje
 */
export const formatPercent = (value, decimals = 2, locale = 'es-ES') => {
  if (value === null || value === undefined) return '';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  } catch (error) {
    console.error('Error al formatear porcentaje:', error);
    return '';
  }
};

/**
 * Trunca un texto a una longitud máxima
 * @param {string} text - Texto a truncar
 * @param {number} length - Longitud máxima
 * @param {string} suffix - Sufijo a añadir si se trunca
 * @returns {string} - Texto truncado
 */
export const truncateText = (text, length = 50, suffix = '...') => {
  if (!text) return '';
  
  if (text.length <= length) return text;
  
  return text.substring(0, length - suffix.length) + suffix;
};

/**
 * Capitaliza la primera letra de un texto
 * @param {string} text - Texto a capitalizar
 * @returns {string} - Texto capitalizado
 */
export const capitalize = (text) => {
  if (!text) return '';
  
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Convierte un texto a formato título (primera letra de cada palabra en mayúscula)
 * @param {string} text - Texto a convertir
 * @returns {string} - Texto en formato título
 */
export const titleCase = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Formatea un número de teléfono
 * @param {string} phone - Número de teléfono
 * @param {string} format - Formato (###-###-####, (###) ###-####, etc.)
 * @returns {string} - Número de teléfono formateado
 */
export const formatPhone = (phone, format = '###-###-####') => {
  if (!phone) return '';
  
  // Eliminar todos los caracteres no numéricos
  const cleaned = ('' + phone).replace(/\D/g, '');
  
  // Verificar si el número tiene la longitud correcta
  if (cleaned.length !== format.replace(/[^#]/g, '').length) {
    return phone; // Devolver el original si no coincide la longitud
  }
  
  let result = format;
  let index = 0;
  
  // Reemplazar cada # en el formato con el dígito correspondiente
  for (let i = 0; i < format.length; i++) {
    if (format[i] === '#') {
      result = result.substring(0, i) + cleaned[index++] + result.substring(i + 1);
    }
  }
  
  return result;
};

/**
 * Formatea bytes a una unidad legible (KB, MB, GB, etc.)
 * @param {number} bytes - Bytes a formatear
 * @param {number} decimals - Número de decimales
 * @returns {string} - Tamaño formateado
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

/**
 * Formatea una duración en segundos a formato hh:mm:ss
 * @param {number} seconds - Segundos totales
 * @returns {string} - Duración formateada
 */
export const formatDuration = (seconds) => {
  if (seconds === null || seconds === undefined) return '';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const parts = [];
  
  if (hours > 0) {
    parts.push(hours.toString().padStart(2, '0'));
  }
  
  parts.push(minutes.toString().padStart(2, '0'));
  parts.push(secs.toString().padStart(2, '0'));
  
  return parts.join(':');
};

/**
 * Formatea una dirección de correo electrónico para proteger la privacidad
 * @param {string} email - Correo electrónico
 * @returns {string} - Correo electrónico protegido
 */
export const maskEmail = (email) => {
  if (!email) return '';
  
  const [username, domain] = email.split('@');
  
  if (!username || !domain) return email;
  
  const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
  
  return `${maskedUsername}@${domain}`;
};

export default {
  formatDate,
  formatDateTime,
  formatCurrency,
  formatNumber,
  formatPercent,
  truncateText,
  capitalize,
  titleCase,
  formatPhone,
  formatFileSize,
  formatDuration,
  maskEmail
};