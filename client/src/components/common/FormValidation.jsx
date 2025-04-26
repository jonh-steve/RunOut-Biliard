import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component hiển thị thông báo lỗi validation
 * @param {Object} props - Component props
 * @returns {JSX.Element} - React component
 */
const ErrorMessage = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="error-message text-red-500 text-sm mt-1">
      {message}
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string
};

/**
 * Component hiển thị thông báo lỗi từ server
 * @param {Object} props - Component props
 * @returns {JSX.Element} - React component
 */
const ServerError = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="server-error bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <p>{message}</p>
    </div>
  );
};

ServerError.propTypes = {
  message: PropTypes.string
};

/**
 * Component hiển thị thông báo thành công
 * @param {Object} props - Component props
 * @returns {JSX.Element} - React component
 */
const SuccessMessage = ({ message, show }) => {
  if (!show) return null;
  
  return (
    <div className="success-message bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
      <p>{message || 'Thao tác thành công!'}</p>
    </div>
  );
};

SuccessMessage.propTypes = {
  message: PropTypes.string,
  show: PropTypes.bool
};

/**
 * Component input với validation
 * @param {Object} props - Component props
 * @returns {JSX.Element} - React component
 */
const FormInput = ({
  type = 'text',
  name,
  value,
  onChange,
  label,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  ...rest
}) => {
  return (
    <div className="form-group mb-4">
      {label && (
        <label htmlFor={name} className="block text-gray-700 font-medium mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        {...rest}
      />
      
      <ErrorMessage message={error} />
    </div>
  );
};

FormInput.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

/**
 * Component textarea với validation
 * @param {Object} props - Component props
 * @returns {JSX.Element} - React component
 */
const FormTextarea = ({
  name,
  value,
  onChange,
  label,
  placeholder,
  error,
  required = false,
  disabled = false,
  rows = 4,
  className = '',
  ...rest
}) => {
  return (
    <div className="form-group mb-4">
      {label && (
        <label htmlFor={name} className="block text-gray-700 font-medium mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        {...rest}
      />
      
      <ErrorMessage message={error} />
    </div>
  );
};

FormTextarea.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  rows: PropTypes.number,
  className: PropTypes.string
};

/**
 * Component select với validation
 * @param {Object} props - Component props
 * @returns {JSX.Element} - React component
 */
const FormSelect = ({
  name,
  value,
  onChange,
  label,
  options = [],
  error,
  required = false,
  disabled = false,
  className = '',
  ...rest
}) => {
  return (
    <div className="form-group mb-4">
      {label && (
        <label htmlFor={name} className="block text-gray-700 font-medium mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      <ErrorMessage message={error} />
    </div>
  );
};

FormSelect.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  error: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

/**
 * Component checkbox với validation
 * @param {Object} props - Component props
 * @returns {JSX.Element} - React component
 */
const FormCheckbox = ({
  name,
  checked,
  onChange,
  label,
  error,
  disabled = false,
  className = '',
  ...rest
}) => {
  return (
    <div className="form-group mb-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${className}`}
          {...rest}
        />
        
        {label && (
          <label htmlFor={name} className="ml-2 block text-gray-700">
            {label}
          </label>
        )}
      </div>
      
      <ErrorMessage message={error} />
    </div>
  );
};

FormCheckbox.propTypes = {
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

/**
 * Component radio với validation
 * @param {Object} props - Component props
 * @returns {JSX.Element} - React component
 */
const FormRadio = ({
  name,
  value,
  checked,
  onChange,
  label,
  error,
  disabled = false,
  className = '',
  ...rest
}) => {
  return (
    <div className="form-group mb-2">
      <div className="flex items-center">
        <input
          type="radio"
          id={`${name}-${value}`}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 ${className}`}
          {...rest}
        />
        
        {label && (
          <label htmlFor={`${name}-${value}`} className="ml-2 block text-gray-700">
            {label}
          </label>
        )}
      </div>
      
      {error && <ErrorMessage message={error} />}
    </div>
  );
};

FormRadio.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

/**
 * Component radio group với validation
 * @param {Object} props - Component props
 * @returns {JSX.Element} - React component
 */
const FormRadioGroup = ({
  name,
  value,
  onChange,
  label,
  options = [],
  error,
  required = false,
  disabled = false,
  className = '',
  ...rest
}) => {
  return (
    <div className="form-group mb-4">
      {label && (
        <label className="block text-gray-700 font-medium mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className={`space-y-2 ${className}`}>
        {options.map((option) => (
          <FormRadio
            key={option.value}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
            label={option.label}
            disabled={disabled}
            {...rest}
          />
        ))}
      </div>
      
      <ErrorMessage message={error} />
    </div>
  );
};

FormRadioGroup.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  error: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

/**
 * Component button submit
 * @param {Object} props - Component props
 * @returns {JSX.Element} - React component
 */
const SubmitButton = ({
  text = 'Lưu',
  isSubmitting = false,
  loadingText = 'Đang xử lý...',
  disabled = false,
  className = '',
  ...rest
}) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting || disabled}
      className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 ${className}`}
      {...rest}
    >
      {isSubmitting ? loadingText : text}
    </button>
  );
};

SubmitButton.propTypes = {
  text: PropTypes.string,
  isSubmitting: PropTypes.bool,
  loadingText: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

export {
  ErrorMessage,
  ServerError,
  SuccessMessage,
  FormInput,
  FormTextarea,
  FormSelect,
  FormCheckbox,
  FormRadio,
  FormRadioGroup,
  SubmitButton
};