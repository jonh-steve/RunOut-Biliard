/**
 * useFormValidation Hook
 * Custom hook để xử lý validation form ở phía client
 */

import { useState, useCallback } from 'react';

/**
 * Hook để xử lý validation form
 * @param {Object} initialValues - Giá trị ban đầu của form
 * @param {Function} validateForm - Hàm validation form
 * @param {Function} onSubmit - Callback khi form được submit thành công
 * @returns {Object} - Các giá trị và hàm để xử lý form
 */
const useFormValidation = (initialValues = {}, validateForm, onSubmit) => {
  // State cho giá trị form
  const [values, setValues] = useState(initialValues);
  
  // State cho lỗi validation
  const [errors, setErrors] = useState({});
  
  // State cho trạng thái loading
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State cho lỗi từ server
  const [serverError, setServerError] = useState('');
  
  // State cho trạng thái thành công
  const [isSuccess, setIsSuccess] = useState(false);
  
  /**
   * Xử lý thay đổi giá trị input
   * @param {Event} e - Event t��� input
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    // Xử lý các loại input khác nhau
    const inputValue = type === 'checkbox' ? checked : value;
    
    setValues(prevValues => ({
      ...prevValues,
      [name]: inputValue
    }));
    
    // Xóa lỗi khi người dùng bắt đầu nhập lại
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
    
    // Xóa lỗi server khi người dùng thay đổi form
    if (serverError) {
      setServerError('');
    }
  }, [errors, serverError]);
  
  /**
   * Cập nhật giá trị form
   * @param {Object} newValues - Giá trị mới cần cập nhật
   */
  const setFormValues = useCallback((newValues) => {
    setValues(prevValues => ({
      ...prevValues,
      ...newValues
    }));
  }, []);
  
  /**
   * Xử lý submit form
   * @param {Event} e - Form submit event
   */
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    // Validate form
    const validationResult = validateForm(values);
    
    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      return;
    }
    
    setIsSubmitting(true);
    setServerError('');
    
    try {
      await onSubmit(values);
      setIsSuccess(true);
    } catch (error) {
      setServerError(error.response?.data?.mes || 'Đã xảy ra lỗi');
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, onSubmit]);
  
  /**
   * Reset form về giá trị ban đầu
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setServerError('');
    setIsSuccess(false);
  }, [initialValues]);
  
  /**
   * Kiểm tra một trường cụ thể có lỗi không
   * @param {string} fieldName - Tên trường cần kiểm tra
   * @returns {boolean} - true nếu trường có lỗi
   */
  const hasError = useCallback((fieldName) => {
    return Boolean(errors[fieldName]);
  }, [errors]);
  
  /**
   * Lấy thông báo lỗi của một trường
   * @param {string} fieldName - Tên trường cần lấy lỗi
   * @returns {string} - Thông báo lỗi
   */
  const getErrorMessage = useCallback((fieldName) => {
    return errors[fieldName] || '';
  }, [errors]);
  
  return {
    values,
    errors,
    isSubmitting,
    serverError,
    isSuccess,
    handleChange,
    handleSubmit,
    setFormValues,
    resetForm,
    hasError,
    getErrorMessage
  };
};

export default useFormValidation;