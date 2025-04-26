import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import './Input.css';

/**
 * Input component for forms
 * @param {Object} props - Component props
 * @param {string} props.type - Input type
 * @param {string} props.label - Input label
 * @param {string} props.placeholder - Input placeholder
 * @param {string} props.error - Error message
 * @param {boolean} props.fullWidth - Whether input should take full width
 * @param {boolean} props.disabled - Whether input is disabled
 * @param {Function} props.onChange - Change handler
 */
const Input = forwardRef(
  (
    {
      type = 'text',
      label,
      placeholder,
      error,
      fullWidth = false,
      disabled = false,
      onChange,
      ...rest
    },
    ref
  ) => {
    const inputId = rest.id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    const containerClasses = [
      'input-container',
      fullWidth ? 'input-container--full-width' : '',
      error ? 'input-container--error' : '',
      disabled ? 'input-container--disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={containerClasses}>
        {label && <label htmlFor={inputId} className="input-label">{label}</label>}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className="input-field"
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          {...rest}
        />
        {error && <div className="input-error">{error}</div>}
      </div>
    );
  }
);

Input.displayName = 'Input';

Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Input;