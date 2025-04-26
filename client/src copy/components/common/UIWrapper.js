/**
 * UI Component Wrapper
 * 
 * Lớp wrapper này giúp đồng bộ hóa UI components giữa Material UI (User) và Tailwind CSS (Client)
 * Cung cấp interface thống nhất để sử dụng UI components trong cả hai giao diện
 */

import React from 'react';

// Kiểm tra môi trường hiện tại
const isClientInterface = process.env.REACT_APP_INTERFACE === 'client';

/**
 * HOC để wrap các Material UI components
 * @param {React.Component} MaterialComponent - Material UI component
 * @param {React.Component} TailwindComponent - Tailwind CSS component tương đương (nếu có)
 * @param {Object} defaultProps - Props mặc định
 * @returns {React.Component} - Wrapped component
 */
export function withUIWrapper(MaterialComponent, TailwindComponent = null, defaultProps = {}) {
  return React.forwardRef((props, ref) => {
    // Nếu đang ở Client interface và có TailwindComponent, sử dụng nó
    if (isClientInterface && TailwindComponent) {
      return <TailwindComponent ref={ref} {...defaultProps} {...props} />;
    }
    
    // Mặc định sử dụng MaterialComponent
    return <MaterialComponent ref={ref} {...defaultProps} {...props} />;
  });
}

/**
 * Tạo một component với phiên bản Material UI và Tailwind CSS
 * @param {Object} options - Các tùy chọn
 * @param {React.Component} options.Material - Material UI component
 * @param {React.Component} options.Tailwind - Tailwind CSS component
 * @param {Object} options.defaultProps - Props mặc định
 * @returns {React.Component} - Adaptive component
 */
export function createAdaptiveComponent({ Material, Tailwind, defaultProps = {} }) {
  return withUIWrapper(Material, Tailwind, defaultProps);
}

/**
 * Hook để lấy style classes phù hợp với môi trường
 * @param {Object} materialClasses - Material UI classes
 * @param {Object} tailwindClasses - Tailwind CSS classes
 * @returns {Object} - Classes phù hợp với môi trường
 */
export function useAdaptiveStyles(materialClasses, tailwindClasses) {
  return isClientInterface ? tailwindClasses : materialClasses;
}

/**
 * Hook để lấy theme phù hợp với môi trường
 * @param {Object} materialTheme - Material UI theme
 * @param {Object} tailwindTheme - Tailwind CSS theme
 * @returns {Object} - Theme phù hợp với môi trường
 */
export function useAdaptiveTheme(materialTheme, tailwindTheme) {
  return isClientInterface ? tailwindTheme : materialTheme;
}

export default {
  withUIWrapper,
  createAdaptiveComponent,
  useAdaptiveStyles,
  useAdaptiveTheme
};