/**
 * useFormikValidation Hook
 * Custom hook để sử dụng Formik với Yup validation
 */

import { useFormik } from 'formik';
import { useState } from 'react';

/**
 * Hook để sử dụng Formik với Yup validation
 * @param {Object} options - Các tùy chọn cho hook
 * @param {Object} options.initialValues - Giá trị ban đầu của form
 * @param {Object} options.validationSchema - Schema validation Yup
 * @param {Function} options.onSubmit - Callback khi form được submit thành công
 * @param {boolean} options.validateOnChange - Có validate khi thay đổi giá trị không
 * @param {boolean} options.validateOnBlur - Có validate khi blur không
 * @param {boolean} options.enableReinitialize - Có cho phép khởi tạo lại form không
 * @returns {Object} - Các giá trị và hàm để xử lý form
 */
const useFormikValidation = ({
  initialValues,
  validationSchema,
  onSubmit,
  validateOnChange = true,
  validateOnBlur = true,
  enableReinitialize = false
}) => {
  // State cho lỗi từ server
  const [serverError, setServerError] = useState('');
  
  // State cho trạng thái thành công
  const [isSuccess, setIsSuccess] = useState(false);
  
  /**
   * Xử lý submit form
   * @param {Object} values - Giá trị form
   * @param {Object} formikHelpers - Các helper function của Formik
   */
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setServerError('');
    
    try {
      await onSubmit(values);
      setIsSuccess(true);
      
      // Nếu submit thành công và muốn reset form
      if (resetForm) {
        resetForm();
      }
    } catch (error) {
      setServerError(error.response?.data?.mes || 'Đã xảy ra lỗi');
      setIsSuccess(false);
      
      // Nếu có lỗi validation từ server
      if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        
        // Chuyển đổi lỗi từ server thành định dạng của Formik
        const formikErrors = {};
        
        serverErrors.forEach(err => {
          if (err.param) {
            formikErrors[err.param] = err.msg;
          }
        });
        
        // Set lỗi cho Formik
        if (Object.keys(formikErrors).length > 0) {
          formik.setErrors(formikErrors);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };
  
  // Khởi tạo Formik
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
    validateOnChange,
    validateOnBlur,
    enableReinitialize
  });
  
  /**
   * Reset form và trạng thái
   */
  const resetFormAndState = () => {
    formik.resetForm();
    setServerError('');
    setIsSuccess(false);
  };
  
  /**
   * Kiểm tra một trường cụ thể có lỗi không
   * @param {string} fieldName - Tên trường cần kiểm tra
   * @returns {boolean} - true nếu trường có lỗi
   */
  const hasError = (fieldName) => {
    return Boolean(formik.touched[fieldName] && formik.errors[fieldName]);
  };
  
  /**
   * Lấy thông báo lỗi của một trường
   * @param {string} fieldName - Tên trường cần lấy lỗi
   * @returns {string} - Thông báo lỗi
   */
  const getErrorMessage = (fieldName) => {
    return formik.touched[fieldName] && formik.errors[fieldName] 
      ? formik.errors[fieldName] 
      : '';
  };
  
  /**
   * Lấy props cho input
   * @param {string} fieldName - Tên trường
   * @returns {Object} - Props cho input
   */
  const getFieldProps = (fieldName) => {
    return {
      ...formik.getFieldProps(fieldName),
      error: hasError(fieldName),
      helperText: getErrorMessage(fieldName)
    };
  };
  
  return {
    formik,
    values: formik.values,
    errors: formik.errors,
    touched: formik.touched,
    isSubmitting: formik.isSubmitting,
    handleChange: formik.handleChange,
    handleBlur: formik.handleBlur,
    handleSubmit: formik.handleSubmit,
    setFieldValue: formik.setFieldValue,
    setFieldTouched: formik.setFieldTouched,
    setValues: formik.setValues,
    resetForm: formik.resetForm,
    serverError,
    setServerError,
    isSuccess,
    setIsSuccess,
    resetFormAndState,
    hasError,
    getErrorMessage,
    getFieldProps
  };
};

export default useFormikValidation;