import React, { useState } from 'react';

/**
 * Input component
 * @param {Object} props - Component props
 * @param {string} props.id - Input id
 * @param {string} props.name - Input name
 * @param {string} props.label - Input label
 * @param {string} props.type - Input type (text, password, email, etc.)
 * @param {string} props.value - Input value
 * @param {function} props.onChange - Change handler
 * @param {string} props.placeholder - Input placeholder
 * @param {boolean} props.required - Whether input is required
 * @param {boolean} props.disabled - Whether input is disabled
 * @param {boolean} props.fullWidth - Whether input should take full width
 * @param {string} props.error - Error message
 * @param {string} props.helperText - Helper text
 * @param {React.ReactNode} props.startAdornment - Start adornment
 * @param {React.ReactNode} props.endAdornment - End adornment
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.rest - Additional props
 * @returns {React.ReactElement} Input component
 */
const Input = ({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  fullWidth = true,
  error = '',
  helperText = '',
  startAdornment,
  endAdornment,
  className = '',
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Base classes for the input
  const inputClasses = `
    px-3
    py-2
    bg-white
    border
    rounded
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
    ${error ? 'border-red-500' : 'border-gray-300 hover:border-blue-500'}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${startAdornment ? 'pl-10' : ''}
    ${endAdornment || type === 'password' ? 'pr-10' : ''}
    ${className}
  `;

  // Render password toggle icon
  const renderPasswordToggle = () => {
    if (type === 'password') {
      return (
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={handleClickShowPassword}
        >
          {showPassword ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      );
    }
    return endAdornment && (
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
        {endAdornment}
      </div>
    );
  };

  return (
    <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label 
          htmlFor={id} 
          className={`block text-sm font-medium mb-1 ${error ? 'text-red-500' : 'text-gray-700'}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {startAdornment && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {startAdornment}
          </div>
        )}
        
        <input
          id={id}
          name={name}
          type={type === 'password' && showPassword ? 'text' : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={inputClasses}
          {...rest}
        />
        
        {renderPasswordToggle()}
      </div>
      
      {(error || helperText) && (
        <p className={`mt-1 text-xs ${error ? 'text-red-500' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Input;