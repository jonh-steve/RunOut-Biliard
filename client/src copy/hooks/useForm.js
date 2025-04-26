import { useState, useCallback } from 'react';

/**
 * Custom hook để quản lý form
 * @param {Object} initialValues - Giá trị ban đầu của form
 * @param {Function} validate - Hàm validate form
 * @param {Function} onSubmit - Hàm xử lý khi submit form
 * @returns {Object} - { values, errors, touched, handleChange, handleBlur, handleSubmit, setValues, resetForm }
 */
const useForm = (initialValues = {}, validate = () => ({}), onSubmit = () => {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Xử lý khi giá trị input thay đổi
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    setValues(prevValues => ({
      ...prevValues,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  // Xử lý khi input bị blur (mất focus)
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true,
    }));
    
    // Validate field khi blur
    const validationErrors = validate(values);
    setErrors(validationErrors);
  }, [validate, values]);

  // Xử lý khi submit form
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    // Validate tất cả các field
    const validationErrors = validate(values);
    setErrors(validationErrors);
    
    // Đánh dấu tất cả các field là đã touched
    const touchedFields = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(touchedFields);
    
    // Nếu không có lỗi, gọi hàm onSubmit
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [validate, values, onSubmit]);

  // Đặt lại form về giá trị ban đầu
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Cập nhật nhiều giá trị cùng lúc
  const setFieldValues = useCallback((newValues) => {
    setValues(prevValues => ({
      ...prevValues,
      ...newValues,
    }));
  }, []);

  // Cập nhật một giá trị
  const setFieldValue = useCallback((field, value) => {
    setValues(prevValues => ({
      ...prevValues,
      [field]: value,
    }));
  }, []);

  // Đặt lỗi cho một field
  const setFieldError = useCallback((field, error) => {
    setErrors(prevErrors => ({
      ...prevErrors,
      [field]: error,
    }));
  }, []);

  // Đánh dấu một field là đã touched
  const setFieldTouched = useCallback((field, isTouched = true) => {
    setTouched(prevTouched => ({
      ...prevTouched,
      [field]: isTouched,
    }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues: setFieldValues,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    resetForm,
  };
};

export default useForm;