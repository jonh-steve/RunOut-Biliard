
/**
 * User Validation Utility
 * 
 * This module provides functions to validate user data including:
 * - Email validation
 * - Password strength validation
 * - Username validation
 * - Phone number validation
 * - Age validation
 */

/**
 * Validates a complete user object
 * @param {Object} user - The user object to validate
 * @returns {Object} - Validation result with isValid flag and errors array
 */
function validateUser(user) {
    const errors = [];
    
    // Check required fields
    if (!user) {
      return { isValid: false, errors: ['User object is required'] };
    }
    
    // Validate email
    if (user.email) {
      const emailValidation = validateEmail(user.email);
      if (!emailValidation.isValid) {
        errors.push(emailValidation.error);
      }
    } else {
      errors.push('Email is required');
    }
    
    // Validate password
    if (user.password) {
      const passwordValidation = validatePassword(user.password);
      if (!passwordValidation.isValid) {
        errors.push(passwordValidation.error);
      }
    } else {
      errors.push('Password is required');
    }
    
    // Validate username
    if (user.username) {
      const usernameValidation = validateUsername(user.username);
      if (!usernameValidation.isValid) {
        errors.push(usernameValidation.error);
      }
    } else {
      errors.push('Username is required');
    }
    
    // Validate phone (if provided)
    if (user.phone) {
      const phoneValidation = validatePhone(user.phone);
      if (!phoneValidation.isValid) {
        errors.push(phoneValidation.error);
      }
    }
    
    // Validate age (if provided)
    if (user.age !== undefined) {
      const ageValidation = validateAge(user.age);
      if (!ageValidation.isValid) {
        errors.push(ageValidation.error);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
  
  /**
   * Validates an email address
   * @param {string} email - The email to validate
   * @returns {Object} - Validation result
   */
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Invalid email format' };
    }
    return { isValid: true };
  }
  
  /**
   * Validates password strength
   * @param {string} password - The password to validate
   * @returns {Object} - Validation result
   */
  function validatePassword(password) {
    if (password.length < 8) {
      return { isValid: false, error: 'Password must be at least 8 characters long' };
    }
    
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one uppercase letter' };
    }
    
    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one lowercase letter' };
    }
    
    // Check for at least one number
    if (!/\d/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one number' };
    }
    
    // Check for at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one special character' };
    }
    
    return { isValid: true };
  }
  
  /**
   * Validates a username
   * @param {string} username - The username to validate
   * @returns {Object} - Validation result
   */
  function validateUsername(username) {
    if (username.length < 3) {
      return { isValid: false, error: 'Username must be at least 3 characters long' };
    }
    
    if (username.length > 20) {
      return { isValid: false, error: 'Username cannot exceed 20 characters' };
    }
    
    // Only allow alphanumeric characters and underscores
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return { isValid: false, error: 'Username can only contain letters, numbers, and underscores' };
    }
    
    return { isValid: true };
  }
  
  /**
   * Validates a phone number
   * @param {string} phone - The phone number to validate
   * @returns {Object} - Validation result
   */
  function validatePhone(phone) {
    // Basic international phone validation
    // This can be adjusted based on your specific requirements
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      return { isValid: false, error: 'Invalid phone number format' };
    }
    return { isValid: true };
  }
  
  /**
   * Validates user age
   * @param {number} age - The age to validate
   * @returns {Object} - Validation result
   */
  function validateAge(age) {
    if (typeof age !== 'number') {
      return { isValid: false, error: 'Age must be a number' };
    }
    
    if (age < 13) {
      return { isValid: false, error: 'User must be at least 13 years old' };
    }
    
    if (age > 120) {
      return { isValid: false, error: 'Invalid age value' };
    }
    
    return { isValid: true };
  }
  
  module.exports = {
    validateUser,
    validateEmail,
    validatePassword,
    validateUsername,
    validatePhone,
    validateAge
  };
  