import React from 'react';

/**
 * Button component
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant (primary, secondary, outlined, text)
 * @param {string} props.size - Button size (small, medium, large)
 * @param {boolean} props.fullWidth - Whether button should take full width
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {function} props.onClick - Click handler
 * @param {React.ReactNode} props.children - Button content
 * @param {Object} props.rest - Additional props
 * @returns {React.ReactElement} Button component
 */
const Button = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  onClick,
  children,
  className = '',
  ...rest
}) => {
  // Tailwind classes for different variants
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    outlined: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
    text: 'text-blue-600 hover:bg-blue-50',
  };

  // Tailwind classes for different sizes
  const sizeClasses = {
    small: 'py-1 px-2 text-sm',
    medium: 'py-2 px-4 text-base',
    large: 'py-3 px-6 text-lg',
  };

  // Combine all classes
  const buttonClasses = `
    rounded
    font-semibold
    transition-colors
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
    focus:ring-opacity-50
    ${variantClasses[variant] || variantClasses.primary}
    ${sizeClasses[size] || sizeClasses.medium}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-70 cursor-not-allowed' : ''}
    ${className}
  `;

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;