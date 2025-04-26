import React from 'react';
import PropTypes from 'prop-types';
import { Field, ErrorMessage, Form, Formik } from 'formik';

/**
 * Component hiển thị thông báo lỗi validation
 * @param {Object} props - Component props
 * @returns {JSX.Element} - React component
 */
export const FormikError = ({ name }) => {
  return (
    <ErrorMessage name={name}>
      {(msg) => (
        <div className="error-message text-red-500 text-sm mt-1">
          {msg}
        </div>
      )}
    </ErrorMessage>
  );
};

FormikError.propTypes = {
  name: PropTypes.string.isRequired
};

/**
 * Component hiển thị thông báo lỗi từ server
 * @param {Object} props - Component props
 * @returns {JSX.Element} - React component
 */
export const FormikServerError = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="server-error bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <p>{message}</p>
    </div>
  );
};

FormikServerError.propTypes = {
  message: PropTypes.string
};

/**
 * Component hiển thị thông báo thành công
 * @param {Object} props - Component props
 * @returns {JSX.Element} - React component
 */
export const FormikSuccess = ({ message, show }) => {
  if (!show) return null;
  
  return (
    <div className="success-message bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
      <p>{message || 'Thao tác thành công!'}</p>
    </div>
  );
};

FormikSuccess.propTypes = {
  message: PropTypes.string,
  show: PropTypes.bool
};

/**
 * Component input với Formik
 * @param {Object} props - Component props
 * @returns {JSX.Element} - React component
 */
export const FormikInput = ({
  name,
  label,
  type = 'text',
  placeholder,
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
      
      <Field name={name}>
        {({ field, meta }) => (
          <div>
            <input
              type={type}
              id={name}
              placeholder={placeholder}
              disabled={disabled}
              className={`w-full px-3 py-2 border ${meta.touched && meta.error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
              {...field}
              {...rest}
            />
            <FormikError name={name} />
          </div>
        )}
      </Field>
    </div>
  );
};

FormikInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

/**
 * Component textarea với Formik
 * @param {Object} props - Component props
 * @returns {JSX.Element} - React component
 */
export const FormikTextarea = ({
  name,
  label,
  placeholder,
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
      
      <Field name={name}>
        {({ field, meta }) => (
          <div>
            <textarea
              id={name}
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
              className={`w-full px-3 py-2 border ${meta.touched && meta.error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
              {...field}
              {...rest}
            />
            <FormikError name={name} />
          </div>
        )}
      </Field>
    </div>
  );
};

FormikTextarea.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  rows: PropTypes.number,
  className: PropTypes.string
};

/**
 * Component select với Formik
 * @param {Object} props - Component props
 * @returns {JSX.Element} - React component
 */
export const FormikSelect = ({
  name,
  label,
  options = [],
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
      
      <Field name={name}>
        {({ field, meta }) => (
          <div>
            <select
              id={name}
              disabled={disabled}
              className={`w-full px-3 py-2 border ${meta.touched && meta.error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
              {...field}
              {...rest}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <FormikError name={name} />
          </div>
        )}
      </Field>
    </div>
  );
};

FormikSelect.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

/**
 * Component checkbox với Formik
 * @param {Object} props - Component props
 * @returns {JSX.Element} - React component
 */
export const FormikCheckbox = ({
  name,
  label,
  disabled = false,
  className = '',
  ...rest
}) => {
  return (
    <div className="form-group mb-4">
      <Field name={name}>
        {({ field, meta }) => (
          <div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id={name}
                disabled={disabled}
                className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${className}`}
                {...field}
                {...rest}
              />
              
              {label && (
                <label htmlFor={name} className="ml-2 block text-gray-700">
                  {label}
                </label>
              )}
            </div>
            <FormikError name={name} />
          </div>
        )}
      </Field>
    </div>
  );
};

FormikCheckbox.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

/**
 * Component radio với Formik
 * @param {Object} props - Component props
 * @returns {JSX.Element} - React component
 */
export const FormikRadio = ({
  name,
  value,
  label,
  disabled = false,
  className = '',
  ...rest
}) => {
  return (
    <div className="form-group mb-2">
      <Field name={name}>
        {({ field }) => (
          <div className="flex items-center">
            <input
              type="radio"
              id={`${name}-${value}`}
              disabled={disabled}
              className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 ${className}`}
              {...field}
              value={value}
              checked={field.value === value}
              {...rest}
            />
            
            {label && (
              <label htmlFor={`${name}-${value}`} className="ml-2 block text-gray-700">
                {label}
              </label>
            )}
          </div>
        )}
      </Field>
    </div>
  );
};

FormikRadio.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

/**
 * Component radio group với Formik
 * @param {Object} props - Component props
 * @returns {JSX.Element} - React component
 */
export const FormikRadioGroup = ({
  name,
  label,
  options = [],
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
          <FormikRadio
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            disabled={disabled}
            {...rest}
          />
        ))}
      </div>
      
      <FormikError name={name} />
    </div>
  );
};

FormikRadioGroup.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

/**
 * Component file input với Formik
 * @param {Object} props - Component props
 * @returns {JSX.Element} - React component
 */
export const FormikFile = ({
  name,
  label,
  accept,
  multiple = false,
  required = false,
  disabled = false,
  className = '',
  onChange,
  ...rest
}) => {
  return (
    <div className="form-group mb-4">
      {label && (
        <label htmlFor={name} className="block text-gray-700 font-medium mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <Field name={name}>
        {({ field, form, meta }) => (
          <div>
            <input
              type="file"
              id={name}
              accept={accept}
              multiple={multiple}
              disabled={disabled}
              className={`w-full px-3 py-2 border ${meta.touched && meta.error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
              onChange={(event) => {
                const files = multiple ? 
                  Array.from(event.currentTarget.files) : 
                  event.currentTarget.files[0];
                
                form.setFieldValue(name, files);
                
                if (onChange) {
                  onChange(event, form);
                }
              }}
              onBlur={field.onBlur}
              {...rest}
            />
            <FormikError name={name} />
          </div>
        )}
      </Field>
    </div>
  );
};

FormikFile.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  accept: PropTypes.string,
  multiple: PropTypes.bool,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func
};

/**
 * Component date picker với Formik
 * @param {Object} props - Component props
 * @returns {JSX.Element} - React component
 */
export const FormikDatePicker = ({
  name,
  label,
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
      
      <Field name={name}>
        {({ field, meta }) => (
          <div>
            <input
              type="date"
              id={name}
              disabled={disabled}
              className={`w-full px-3 py-2 border ${meta.touched && meta.error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
              {...field}
              {...rest}
            />
            <FormikError name={name} />
          </div>
        )}
      </Field>
    </div>
  );
};

FormikDatePicker.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

/**
 * Component button submit
 * @param {Object} props - Component props
 * @returns {JSX.Element} - React component
 */
export const FormikSubmitButton = ({
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

FormikSubmitButton.propTypes = {
  text: PropTypes.string,
  isSubmitting: PropTypes.bool,
  loadingText: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

/**
 * Component form với Formik
 * @param {Object} props - Component props
 * @returns {JSX.Element} - React component
 */
export const FormikForm = ({
  initialValues,
  validationSchema,
  onSubmit,
  children,
  serverError,
  successMessage,
  isSuccess,
  className = '',
  ...rest
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      {...rest}
    >
      {(formikProps) => (
        <Form className={className}>
          {serverError && <FormikServerError message={serverError} />}
          {isSuccess && <FormikSuccess message={successMessage} show={isSuccess} />}
          
          {typeof children === 'function' ? children(formikProps) : children}
        </Form>
      )}
    </Formik>
  );
};

FormikForm.propTypes = {
  initialValues: PropTypes.object.isRequired,
  validationSchema: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  serverError: PropTypes.string,
  successMessage: PropTypes.string,
  isSuccess: PropTypes.bool,
  className: PropTypes.string
};