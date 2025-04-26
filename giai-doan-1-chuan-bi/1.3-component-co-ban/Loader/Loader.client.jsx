import React from 'react';

/**
 * Loader component
 * @param {Object} props - Component props
 * @param {string} props.size - Loader size (small, medium, large)
 * @param {string} props.color - Loader color (primary, secondary)
 * @param {string} props.text - Loader text
 * @param {boolean} props.fullPage - Whether loader should take full page
 * @param {boolean} props.inline - Whether loader should be inline
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.rest - Additional props
 * @returns {React.ReactElement} Loader component
 */
const Loader = ({
  size = 'medium',
  color = 'primary',
  text,
  fullPage = false,
  inline = false,
  className = '',
  ...rest
}) => {
  // Size classes for spinner
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16',
  };

  // Size classes for text
  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  };

  // Color classes
  const colorClasses = {
    primary: 'border-blue-600',
    secondary: 'border-gray-600',
  };

  // Container classes
  const containerClasses = `
    flex flex-col items-center justify-center
    ${inline ? 'inline-flex mr-2' : ''}
    ${fullPage ? 'fixed inset-0 bg-white bg-opacity-70 z-50' : 'p-4'}
    ${className}
  `;

  return (
    <div className={containerClasses} {...rest}>
      <div 
        className={`
          animate-spin rounded-full
          border-t-2 border-b-2
          ${colorClasses[color] || colorClasses.primary}
          ${sizeClasses[size] || sizeClasses.medium}
        `}
      ></div>
      
      {text && (
        <p className={`
          mt-2 text-gray-600
          ${textSizeClasses[size] || textSizeClasses.medium}
        `}>
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;