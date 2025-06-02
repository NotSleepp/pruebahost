/**
 * Utilidades para validación de datos
 */

/**
 * Valida si un valor es requerido (no vacío)
 * @param {any} value - Valor a validar
 * @returns {boolean|string} - true si es válido, mensaje de error si no
 */
export const required = (value) => {
  if (value === null || value === undefined || value === '') {
    return 'Este campo es requerido';
  }
  
  if (Array.isArray(value) && value.length === 0) {
    return 'Debe seleccionar al menos un elemento';
  }
  
  return true;
};

/**
 * Valida si un valor es un email válido
 * @param {string} value - Valor a validar
 * @returns {boolean|string} - true si es válido, mensaje de error si no
 */
export const email = (value) => {
  if (!value) return true;
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  return emailRegex.test(value) ? true : 'Debe ingresar un email válido';
};

/**
 * Valida si un valor tiene una longitud mínima
 * @param {number} min - Longitud mínima
 * @returns {Function} - Función de validación
 */
export const minLength = (min) => (value) => {
  if (!value) return true;
  
  return value.length >= min ? true : `Debe tener al menos ${min} caracteres`;
};

/**
 * Valida si un valor tiene una longitud máxima
 * @param {number} max - Longitud máxima
 * @returns {Function} - Función de validación
 */
export const maxLength = (max) => (value) => {
  if (!value) return true;
  
  return value.length <= max ? true : `Debe tener como máximo ${max} caracteres`;
};

/**
 * Valida si un valor es un número
 * @param {any} value - Valor a validar
 * @returns {boolean|string} - true si es válido, mensaje de error si no
 */
export const isNumber = (value) => {
  if (!value) return true;
  
  return !isNaN(Number(value)) ? true : 'Debe ser un número';
};

/**
 * Valida si un valor es un número entero
 * @param {any} value - Valor a validar
 * @returns {boolean|string} - true si es válido, mensaje de error si no
 */
export const isInteger = (value) => {
  if (!value) return true;
  
  return Number.isInteger(Number(value)) ? true : 'Debe ser un número entero';
};

/**
 * Valida si un valor es mayor o igual a un mínimo
 * @param {number} min - Valor mínimo
 * @returns {Function} - Función de validación
 */
export const min = (min) => (value) => {
  if (!value) return true;
  if (isNaN(Number(value))) return 'Debe ser un número';
  
  return Number(value) >= min ? true : `Debe ser mayor o igual a ${min}`;
};

/**
 * Valida si un valor es menor o igual a un máximo
 * @param {number} max - Valor máximo
 * @returns {Function} - Función de validación
 */
export const max = (max) => (value) => {
  if (!value) return true;
  if (isNaN(Number(value))) return 'Debe ser un número';
  
  return Number(value) <= max ? true : `Debe ser menor o igual a ${max}`;
};

/**
 * Valida si un valor coincide con una expresión regular
 * @param {RegExp} regex - Expresión regular
 * @param {string} message - Mensaje de error
 * @returns {Function} - Función de validación
 */
export const pattern = (regex, message = 'Formato inválido') => (value) => {
  if (!value) return true;
  
  return regex.test(value) ? true : message;
};

/**
 * Valida si un valor es una URL válida
 * @param {string} value - Valor a validar
 * @returns {boolean|string} - true si es válido, mensaje de error si no
 */
export const url = (value) => {
  if (!value) return true;
  
  try {
    new URL(value);
    return true;
  } catch (e) {
    return 'Debe ser una URL válida';
  }
};

/**
 * Valida si dos valores son iguales
 * @param {string} field - Campo a comparar
 * @param {string} fieldName - Nombre del campo a comparar
 * @returns {Function} - Función de validación
 */
export const sameAs = (field, fieldName) => (value, formData) => {
  if (!value) return true;
  
  return value === formData[field] ? true : `Debe coincidir con ${fieldName}`;
};

/**
 * Valida si un valor es una fecha válida
 * @param {string} value - Valor a validar
 * @returns {boolean|string} - true si es válido, mensaje de error si no
 */
export const isDate = (value) => {
  if (!value) return true;
  
  const date = new Date(value);
  return !isNaN(date.getTime()) ? true : 'Debe ser una fecha válida';
};

/**
 * Valida si una fecha es posterior a otra
 * @param {string} field - Campo de fecha a comparar
 * @param {string} fieldName - Nombre del campo a comparar
 * @returns {Function} - Función de validación
 */
export const dateAfter = (field, fieldName) => (value, formData) => {
  if (!value || !formData[field]) return true;
  
  const date = new Date(value);
  const compareDate = new Date(formData[field]);
  
  if (isNaN(date.getTime()) || isNaN(compareDate.getTime())) {
    return 'Fechas inválidas';
  }
  
  return date > compareDate ? true : `Debe ser posterior a ${fieldName}`;
};

/**
 * Valida si una fecha es anterior a otra
 * @param {string} field - Campo de fecha a comparar
 * @param {string} fieldName - Nombre del campo a comparar
 * @returns {Function} - Función de validación
 */
export const dateBefore = (field, fieldName) => (value, formData) => {
  if (!value || !formData[field]) return true;
  
  const date = new Date(value);
  const compareDate = new Date(formData[field]);
  
  if (isNaN(date.getTime()) || isNaN(compareDate.getTime())) {
    return 'Fechas inválidas';
  }
  
  return date < compareDate ? true : `Debe ser anterior a ${fieldName}`;
};

/**
 * Ejecuta múltiples validaciones en secuencia
 * @param {Array<Function>} validators - Array de funciones de validación
 * @returns {Function} - Función de validación combinada
 */
export const compose = (validators) => (value, formData) => {
  for (const validator of validators) {
    const result = validator(value, formData);
    if (result !== true) {
      return result;
    }
  }
  
  return true;
};

/**
 * Valida un objeto completo usando un esquema de validación
 * @param {Object} schema - Esquema de validación
 * @param {Object} data - Datos a validar
 * @returns {Object} - Objeto con errores de validación
 */
export const validateObject = (schema, data) => {
  const errors = {};
  
  Object.keys(schema).forEach(field => {
    const validators = schema[field];
    const value = data[field];
    
    if (Array.isArray(validators)) {
      // Si es un array de validadores, ejecutarlos en secuencia
      for (const validator of validators) {
        const result = validator(value, data);
        
        if (result !== true) {
          errors[field] = result;
          break;
        }
      }
    } else {
      // Si es un solo validador
      const result = validators(value, data);
      
      if (result !== true) {
        errors[field] = result;
      }
    }
  });
  
  return errors;
};

/**
 * Verifica si un objeto de errores está vacío
 * @param {Object} errors - Objeto de errores
 * @returns {boolean} - true si no hay errores
 */
export const isValid = (errors) => {
  return Object.keys(errors).length === 0;
};

export default {
  required,
  email,
  minLength,
  maxLength,
  isNumber,
  isInteger,
  min,
  max,
  pattern,
  url,
  sameAs,
  isDate,
  dateAfter,
  dateBefore,
  compose,
  validateObject,
  isValid
};