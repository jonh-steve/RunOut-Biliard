/**
 * Form Adapter
 * 
 * Lớp adapter này giúp đồng bộ hóa xử lý form và validation giữa giao diện User và Client
 * Cung cấp interface thống nhất để quản lý form trong cả hai giao diện
 */

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik'; // Giả sử đã cài đặt formik
import * as Yup from 'yup'; // Giả sử đã cài đặt yup

// Kiểm tra môi trường hiện tại
const isClientInterface = process.env.REACT_APP_INTERFACE === 'client';

/**
 * Các quy tắc validation thường dùng
 */
export const ValidationRules = {
  required: Yup.string().required('Trường này là bắt buộc'),
  email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
  password: Yup.string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt'
    )
    .required('Mật khẩu là bắt buộc'),
  confirmPassword: (fieldName = 'password') =>
    Yup.string()
      .oneOf([Yup.ref(fieldName), null], 'Mật khẩu không khớp')
      .required('Xác nhận mật khẩu là bắt buộc'),
  phone: Yup.string()
    .matches(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ')
    .required('Số điện thoại là bắt buộc'),
  number: Yup.number().typeError('Phải là số').required('Trường này là bắt buộc'),
  positiveNumber: Yup.number()
    .typeError('Phải là số')
    .positive('Phải là số dương')
    .required('Trường này là bắt buộc'),
  date: Yup.date().typeError('Ngày không hợp lệ').required('Ngày là bắt buộc'),
  url: Yup.string().url('URL không hợp lệ').required('URL là bắt buộc'),
  boolean: Yup.boolean().required('Trường này là bắt buộc')
};

/**
 * Hook để sử dụng form với validation
 * @param {Object} options - Các tùy chọn
 * @param {Object} options.initialValues - Giá trị ban đầu của form
 * @param {Object} options.validationSchema - Schema validation (Yup)
 * @param {Function} options.onSubmit - Hàm xử lý khi submit form
 * @param {boolean} options.validateOnChange - Có validate khi thay đổi giá trị không
 * @param {boolean} options.validateOnBlur - Có validate khi blur không
 * @returns {Object} - Form state và helpers
 */
export function useForm({
  initialValues,
  validationSchema,
  onSubmit,
  validateOnChange = true,
  validateOnBlur = true
}) {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    validateOnChange,
    validateOnBlur
  });
  
  // Thêm các helpers
  const resetForm = (newValues) => {
    formik.resetForm({
      values: newValues || initialValues
    });
  };
  
  const setFieldValueAndValidate = (field, value) => {
    formik.setFieldValue(field, value);
    formik.setFieldTouched(field, true);
    formik.validateField(field);
  };
  
  const hasErrors = Object.keys(formik.errors).length > 0;
  
  return {
    ...formik,
    resetForm,
    setFieldValueAndValidate,
    hasErrors
  };
}

/**
 * Hook để sử dụng form đơn giản không cần validation
 * @param {Object} initialValues - Giá trị ban đầu của form
 * @returns {Object} - Form state và helpers
 */
export function useSimpleForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };
  
  const setFieldValue = (field, value) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const setFieldTouched = (field, isTouched = true) => {
    setTouched(prev => ({
      ...prev,
      [field]: isTouched
    }));
  };
  
  const resetForm = (newValues) => {
    setValues(newValues || initialValues);
    setTouched({});
  };
  
  return {
    values,
    touched,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    resetForm
  };
}

/**
 * Hook để xử lý form với API
 * @param {Object} options - Các tùy chọn
 * @param {Object} options.initialValues - Giá trị ban đầu của form
 * @param {Object} options.validationSchema - Schema validation (Yup)
 * @param {Function} options.apiCall - Hàm gọi API
 * @param {Function} options.onSuccess - Callback khi API thành công
 * @param {Function} options.onError - Callback khi API thất bại
 * @returns {Object} - Form state và helpers
 */
export function useApiForm({
  initialValues,
  validationSchema,
  apiCall,
  onSuccess,
  onError
}) {
  const [apiErrors, setApiErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  
  const handleSubmit = async (values, formikHelpers) => {
    setIsLoading(true);
    setApiErrors({});
    
    try {
      const response = await apiCall(values);
      setApiResponse(response);
      
      if (onSuccess) {
        onSuccess(response, formikHelpers);
      }
      
      return response;
    } catch (error) {
      setApiErrors(extractApiErrors(error));
      
      if (onError) {
        onError(error, formikHelpers);
      }
      
      return error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const form = useForm({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit
  });
  
  // Thêm các API-related helpers
  return {
    ...form,
    apiErrors,
    isLoading,
    apiResponse,
    setApiErrors,
    clearApiErrors: () => setApiErrors({})
  };
}

/**
 * Trích xuất lỗi từ response API
 * @param {Object} error - Đối tượng lỗi
 * @returns {Object} - Các lỗi đã được trích xuất
 */
function extractApiErrors(error) {
  const errors = {};
  
  if (error.response && error.response.data) {
    const { data } = error.response;
    
    // Trường hợp 1: Lỗi dạng { field1: 'error1', field2: 'error2' }
    if (typeof data === 'object' && !Array.isArray(data)) {
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'message') {
          errors[key] = Array.isArray(value) ? value[0] : value;
        }
      });
    }
    
    // Trường hợp 2: Lỗi dạng { errors: [{ field: 'field1', message: 'error1' }, ...] }
    if (data.errors && Array.isArray(data.errors)) {
      data.errors.forEach(err => {
        if (err.field && err.message) {
          errors[err.field] = err.message;
        }
      });
    }
    
    // Trường hợp 3: Lỗi dạng { message: 'error' }
    if (data.message && Object.keys(errors).length === 0) {
      errors._global = data.message;
    }
  }
  
  // Nếu không có lỗi cụ thể, thêm lỗi chung
  if (Object.keys(errors).length === 0) {
    errors._global = error.message || 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
  }
  
  return errors;
}

/**
 * Component hiển thị lỗi form
 * @param {Object} props - Props
 * @param {string} props.name - Tên trường
 * @param {Object} props.formik - Đối tượng formik
 * @param {Object} props.apiErrors - Các lỗi từ API
 * @returns {React.Component} - Component hiển thị lỗi
 */
export function FormError({ name, formik, apiErrors = {} }) {
  const error = formik.touched[name] && formik.errors[name] ? formik.errors[name] : null;
  const apiError = apiErrors[name];
  const displayError = apiError || error;
  
  if (!displayError) return null;
  
  return (
    <div className={isClientInterface ? "text-red-500 text-sm mt-1" : "error-message"}>
      {displayError}
    </div>
  );
}

/**
 * Component hiển thị lỗi chung của form
 * @param {Object} props - Props
 * @param {Object} props.apiErrors - Các lỗi từ API
 * @returns {React.Component} - Component hiển thị lỗi
 */
export function GlobalFormError({ apiErrors = {} }) {
  const globalError = apiErrors._global;
  
  if (!globalError) return null;
  
  return (
    <div className={isClientInterface ? "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" : "alert alert-danger"}>
      {globalError}
    </div>
  );
}

/**
 * HOC để thêm form validation vào component
 * @param {React.Component} Component - Component cần wrap
 * @param {Object} options - Các tùy chọn
 * @returns {React.Component} - Component đã được wrap
 */
export function withFormValidation(Component, options = {}) {
  return (props) => {
    const {
      initialValues = {},
      validationSchema,
      onSubmit,
      ...rest
    } = { ...options, ...props };
    
    const form = useForm({
      initialValues,
      validationSchema,
      onSubmit
    });
    
    return <Component {...rest} formik={form} />;
  };
}

/**
 * HOC để thêm API form vào component
 * @param {React.Component} Component - Component cần wrap
 * @param {Object} options - Các tùy chọn
 * @returns {React.Component} - Component đã được wrap
 */
export function withApiForm(Component, options = {}) {
  return (props) => {
    const {
      initialValues = {},
      validationSchema,
      apiCall,
      onSuccess,
      onError,
      ...rest
    } = { ...options, ...props };
    
    const form = useApiForm({
      initialValues,
      validationSchema,
      apiCall,
      onSuccess,
      onError
    });
    
    return <Component {...rest} form={form} />;
  };
}

/**
 * Form Adapter - Sử dụng cho cả hai giao diện
 */
export default {
  ValidationRules,
  useForm,
  useSimpleForm,
  useApiForm,
  FormError,
  GlobalFormError,
  withFormValidation,
  withApiForm
};