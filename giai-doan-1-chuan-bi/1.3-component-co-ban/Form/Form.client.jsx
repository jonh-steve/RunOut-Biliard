import React from 'react';

/**
 * Form component
 * @param {Object} props - Component props
 * @param {string} props.title - Form title
 * @param {string} props.subtitle - Form subtitle
 * @param {React.ReactNode} props.children - Form content
 * @param {React.ReactNode} props.actions - Form actions (buttons)
 * @param {boolean} props.loading - Whether form is in loading state
 * @param {string} props.error - Error message
 * @param {boolean} props.showDivider - Whether to show divider between title and content
 * @param {function} props.onSubmit - Form submit handler
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.rest - Additional props
 * @returns {React.ReactElement} Form component
 */
const Form = ({
  title,
  subtitle,
  children,
  actions,
  loading = false,
  error = '',
  showDivider = true,
  onSubmit,
  className = '',
  ...rest
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    if (onSubmit) {
      onSubmit(event);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <form onSubmit={handleSubmit} {...rest}>
        {title && (
          <h2 className="text-xl font-semibold text-gray-800">
            {title}
          </h2>
        )}

        {subtitle && (
          <p className="mt-1 text-sm text-gray-600">
            {subtitle}
          </p>
        )}

        {showDivider && title && (
          <hr className="my-4 border-gray-200" />
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-8 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="mt-4">
            {children}
          </div>
        )}

        {actions && (
          <div className="mt-6 flex justify-end space-x-2">
            {actions}
          </div>
        )}
      </form>
    </div>
  );
};

export default Form;