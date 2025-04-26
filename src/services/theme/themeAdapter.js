/**
 * Theme Adapter
 * 
 * Lớp adapter này giúp đồng bộ hóa theme và style giữa Material UI và Tailwind CSS
 * Cung cấp interface thống nhất để quản lý theme trong cả hai giao diện
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTheme as createMuiTheme, ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { makeStyles as muiMakeStyles } from '@material-ui/core/styles';
import StorageAdapter from '../storageAdapter';

// Kiểm tra môi trường hiện tại
const isClientInterface = process.env.REACT_APP_INTERFACE === 'client';

// Key lưu trữ theme trong storage
const THEME_STORAGE_KEY = 'app_theme';

// Các theme mode
export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

// Các màu cơ bản
export const COLORS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  BACKGROUND: 'background',
  TEXT: 'text'
};

// Các breakpoints
export const BREAKPOINTS = {
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
  XXL: '2xl'
};

// Ánh xạ breakpoints giữa Material UI và Tailwind CSS
const BREAKPOINT_MAPPING = {
  [BREAKPOINTS.XS]: { mui: 0, tailwind: '0px' },
  [BREAKPOINTS.SM]: { mui: 600, tailwind: '640px' },
  [BREAKPOINTS.MD]: { mui: 960, tailwind: '768px' },
  [BREAKPOINTS.LG]: { mui: 1280, tailwind: '1024px' },
  [BREAKPOINTS.XL]: { mui: 1920, tailwind: '1280px' },
  [BREAKPOINTS.XXL]: { mui: 2560, tailwind: '1536px' }
};

// Ánh xạ spacing giữa Material UI và Tailwind CSS
const SPACING_MAPPING = {
  0: { mui: 0, tailwind: '0px' },
  0.5: { mui: 0.5, tailwind: '0.125rem' },
  1: { mui: 1, tailwind: '0.25rem' },
  1.5: { mui: 1.5, tailwind: '0.375rem' },
  2: { mui: 2, tailwind: '0.5rem' },
  2.5: { mui: 2.5, tailwind: '0.625rem' },
  3: { mui: 3, tailwind: '0.75rem' },
  3.5: { mui: 3.5, tailwind: '0.875rem' },
  4: { mui: 4, tailwind: '1rem' },
  5: { mui: 5, tailwind: '1.25rem' },
  6: { mui: 6, tailwind: '1.5rem' },
  7: { mui: 7, tailwind: '1.75rem' },
  8: { mui: 8, tailwind: '2rem' },
  9: { mui: 9, tailwind: '2.25rem' },
  10: { mui: 10, tailwind: '2.5rem' },
  11: { mui: 11, tailwind: '2.75rem' },
  12: { mui: 12, tailwind: '3rem' },
  14: { mui: 14, tailwind: '3.5rem' },
  16: { mui: 16, tailwind: '4rem' },
  20: { mui: 20, tailwind: '5rem' },
  24: { mui: 24, tailwind: '6rem' },
  28: { mui: 28, tailwind: '7rem' },
  32: { mui: 32, tailwind: '8rem' },
  36: { mui: 36, tailwind: '9rem' },
  40: { mui: 40, tailwind: '10rem' },
  44: { mui: 44, tailwind: '11rem' },
  48: { mui: 48, tailwind: '12rem' },
  52: { mui: 52, tailwind: '13rem' },
  56: { mui: 56, tailwind: '14rem' },
  60: { mui: 60, tailwind: '15rem' },
  64: { mui: 64, tailwind: '16rem' },
  72: { mui: 72, tailwind: '18rem' },
  80: { mui: 80, tailwind: '20rem' },
  96: { mui: 96, tailwind: '24rem' }
};

// Ánh xạ font weight giữa Material UI và Tailwind CSS
const FONT_WEIGHT_MAPPING = {
  light: { mui: 300, tailwind: '300' },
  regular: { mui: 400, tailwind: '400' },
  medium: { mui: 500, tailwind: '500' },
  semibold: { mui: 600, tailwind: '600' },
  bold: { mui: 700, tailwind: '700' },
  extrabold: { mui: 800, tailwind: '800' }
};

// Ánh xạ font size giữa Material UI và Tailwind CSS
const FONT_SIZE_MAPPING = {
  xs: { mui: '0.75rem', tailwind: 'text-xs' },
  sm: { mui: '0.875rem', tailwind: 'text-sm' },
  base: { mui: '1rem', tailwind: 'text-base' },
  lg: { mui: '1.125rem', tailwind: 'text-lg' },
  xl: { mui: '1.25rem', tailwind: 'text-xl' },
  '2xl': { mui: '1.5rem', tailwind: 'text-2xl' },
  '3xl': { mui: '1.875rem', tailwind: 'text-3xl' },
  '4xl': { mui: '2.25rem', tailwind: 'text-4xl' },
  '5xl': { mui: '3rem', tailwind: 'text-5xl' },
  '6xl': { mui: '3.75rem', tailwind: 'text-6xl' },
  '7xl': { mui: '4.5rem', tailwind: 'text-7xl' },
  '8xl': { mui: '6rem', tailwind: 'text-8xl' },
  '9xl': { mui: '8rem', tailwind: 'text-9xl' }
};

// Ánh xạ line height giữa Material UI và Tailwind CSS
const LINE_HEIGHT_MAPPING = {
  none: { mui: 1, tailwind: 'leading-none' },
  tight: { mui: 1.25, tailwind: 'leading-tight' },
  snug: { mui: 1.375, tailwind: 'leading-snug' },
  normal: { mui: 1.5, tailwind: 'leading-normal' },
  relaxed: { mui: 1.625, tailwind: 'leading-relaxed' },
  loose: { mui: 2, tailwind: 'leading-loose' }
};

// Ánh xạ border radius giữa Material UI và Tailwind CSS
const BORDER_RADIUS_MAPPING = {
  none: { mui: 0, tailwind: 'rounded-none' },
  sm: { mui: 2, tailwind: 'rounded-sm' },
  md: { mui: 4, tailwind: 'rounded' },
  lg: { mui: 8, tailwind: 'rounded-lg' },
  xl: { mui: 12, tailwind: 'rounded-xl' },
  '2xl': { mui: 16, tailwind: 'rounded-2xl' },
  '3xl': { mui: 24, tailwind: 'rounded-3xl' },
  full: { mui: 9999, tailwind: 'rounded-full' }
};

// Ánh xạ shadow giữa Material UI và Tailwind CSS
const SHADOW_MAPPING = {
  none: { mui: 'none', tailwind: 'shadow-none' },
  sm: { mui: 1, tailwind: 'shadow-sm' },
  md: { mui: 2, tailwind: 'shadow' },
  lg: { mui: 3, tailwind: 'shadow-lg' },
  xl: { mui: 4, tailwind: 'shadow-xl' },
  '2xl': { mui: 5, tailwind: 'shadow-2xl' }
};

// Ánh xạ z-index giữa Material UI và Tailwind CSS
const Z_INDEX_MAPPING = {
  0: { mui: 0, tailwind: 'z-0' },
  10: { mui: 10, tailwind: 'z-10' },
  20: { mui: 20, tailwind: 'z-20' },
  30: { mui: 30, tailwind: 'z-30' },
  40: { mui: 40, tailwind: 'z-40' },
  50: { mui: 50, tailwind: 'z-50' },
  auto: { mui: 'auto', tailwind: 'z-auto' }
};

// Ánh xạ opacity giữa Material UI và Tailwind CSS
const OPACITY_MAPPING = {
  0: { mui: 0, tailwind: 'opacity-0' },
  5: { mui: 0.05, tailwind: 'opacity-5' },
  10: { mui: 0.1, tailwind: 'opacity-10' },
  20: { mui: 0.2, tailwind: 'opacity-20' },
  25: { mui: 0.25, tailwind: 'opacity-25' },
  30: { mui: 0.3, tailwind: 'opacity-30' },
  40: { mui: 0.4, tailwind: 'opacity-40' },
  50: { mui: 0.5, tailwind: 'opacity-50' },
  60: { mui: 0.6, tailwind: 'opacity-60' },
  70: { mui: 0.7, tailwind: 'opacity-70' },
  75: { mui: 0.75, tailwind: 'opacity-75' },
  80: { mui: 0.8, tailwind: 'opacity-80' },
  90: { mui: 0.9, tailwind: 'opacity-90' },
  95: { mui: 0.95, tailwind: 'opacity-95' },
  100: { mui: 1, tailwind: 'opacity-100' }
};

/**
 * Theme mặc định cho cả hai giao diện
 * @type {Object}
 */
const DEFAULT_THEME = {
  mode: THEME_MODES.LIGHT,
  colors: {
    [COLORS.PRIMARY]: {
      light: '#42a5f5',
      main: '#1976d2',
      dark: '#1565c0',
      contrastText: '#ffffff'
    },
    [COLORS.SECONDARY]: {
      light: '#ba68c8',
      main: '#9c27b0',
      dark: '#7b1fa2',
      contrastText: '#ffffff'
    },
    [COLORS.SUCCESS]: {
      light: '#4caf50',
      main: '#2e7d32',
      dark: '#1b5e20',
      contrastText: '#ffffff'
    },
    [COLORS.ERROR]: {
      light: '#ef5350',
      main: '#d32f2f',
      dark: '#c62828',
      contrastText: '#ffffff'
    },
    [COLORS.WARNING]: {
      light: '#ff9800',
      main: '#ed6c02',
      dark: '#e65100',
      contrastText: '#ffffff'
    },
    [COLORS.INFO]: {
      light: '#03a9f4',
      main: '#0288d1',
      dark: '#01579b',
      contrastText: '#ffffff'
    },
    [COLORS.BACKGROUND]: {
      paper: '#ffffff',
      default: '#f5f5f5'
    },
    [COLORS.TEXT]: {
      primary: '#212121',
      secondary: '#757575',
      disabled: '#9e9e9e',
      hint: '#9e9e9e'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 300,
      lineHeight: 1.2
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 300,
      lineHeight: 1.2
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 400,
      lineHeight: 1.2
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 400,
      lineHeight: 1.2
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 400,
      lineHeight: 1.2
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.2
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.43
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.75,
      textTransform: 'uppercase'
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.66
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 2.66,
      textTransform: 'uppercase'
    }
  },
  shape: {
    borderRadius: 4
  },
  spacing: 8,
  breakpoints: {
    values: {
      [BREAKPOINTS.XS]: 0,
      [BREAKPOINTS.SM]: 600,
      [BREAKPOINTS.MD]: 960,
      [BREAKPOINTS.LG]: 1280,
      [BREAKPOINTS.XL]: 1920
    }
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
    '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
    '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
    '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
    '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
    '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
    '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
    '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
    '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
    '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
    '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
    '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
    '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
    '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
    '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
    '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
    '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
    '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)'
  ],
  transitions: {
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195
    }
  },
  zIndex: {
    mobileStepper: 1000,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500
  }
};

/**
 * Theme tối cho cả hai giao diện
 * @type {Object}
 */
const DARK_THEME = {
  ...DEFAULT_THEME,
  mode: THEME_MODES.DARK,
  colors: {
    ...DEFAULT_THEME.colors,
    [COLORS.PRIMARY]: {
      light: '#90caf9',
      main: '#2196f3',
      dark: '#1976d2',
      contrastText: '#ffffff'
    },
    [COLORS.SECONDARY]: {
      light: '#ce93d8',
      main: '#9c27b0',
      dark: '#7b1fa2',
      contrastText: '#ffffff'
    },
    [COLORS.BACKGROUND]: {
      paper: '#424242',
      default: '#303030'
    },
    [COLORS.TEXT]: {
      primary: '#ffffff',
      secondary: '#eeeeee',
      disabled: '#9e9e9e',
      hint: '#9e9e9e'
    }
  }
};

/**
 * Chuyển đổi màu từ Material UI sang Tailwind CSS
 * @param {string} materialColor - Màu trong Material UI
 * @returns {string} - Màu tương ứng trong Tailwind CSS
 */
export function convertColorToTailwind(materialColor) {
  // Chuyển đổi hex sang rgb
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  };
  
  // Chuyển đổi rgb sang hex
  const rgbToHex = (r, g, b) => {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };
  
  // Nếu là màu hex
  if (materialColor.startsWith('#')) {
    return materialColor;
  }
  
  // Nếu là màu rgb/rgba
  if (materialColor.startsWith('rgb')) {
    const rgbValues = materialColor.match(/\d+/g);
    if (rgbValues && rgbValues.length >= 3) {
      const [r, g, b] = rgbValues.map(Number);
      return rgbToHex(r, g, b);
    }
  }
  
  // Nếu là tên màu
  const colorMap = {
    primary: '#1976d2',
    secondary: '#9c27b0',
    success: '#2e7d32',
    error: '#d32f2f',
    warning: '#ed6c02',
    info: '#0288d1',
    white: '#ffffff',
    black: '#000000'
  };
  
  return colorMap[materialColor] || materialColor;
}

/**
 * Tạo theme cho Material UI
 * @param {Object} options - Các tùy chọn
 * @returns {Object} - Theme cho Material UI
 */
export function createMaterialTheme(options = {}) {
  const {
    mode = THEME_MODES.LIGHT,
    colors = {},
    typography = {},
    shape = {},
    spacing = 8,
    breakpoints = {},
    shadows = [],
    transitions = {},
    zIndex = {}
  } = options;
  
  const baseTheme = mode === THEME_MODES.DARK ? DARK_THEME : DEFAULT_THEME;
  
  // Merge colors
  const mergedColors = {
    ...baseTheme.colors,
    ...colors
  };
  
  // Tạo theme cho Material UI
  return createMuiTheme({
    palette: {
      mode,
      primary: mergedColors[COLORS.PRIMARY],
      secondary: mergedColors[COLORS.SECONDARY],
      success: mergedColors[COLORS.SUCCESS],
      error: mergedColors[COLORS.ERROR],
      warning: mergedColors[COLORS.WARNING],
      info: mergedColors[COLORS.INFO],
      background: mergedColors[COLORS.BACKGROUND],
      text: mergedColors[COLORS.TEXT]
    },
    typography: {
      ...baseTheme.typography,
      ...typography
    },
    shape: {
      ...baseTheme.shape,
      ...shape
    },
    spacing,
    breakpoints: {
      ...baseTheme.breakpoints,
      ...breakpoints
    },
    shadows: shadows.length > 0 ? shadows : baseTheme.shadows,
    transitions: {
      ...baseTheme.transitions,
      ...transitions
    },
    zIndex: {
      ...baseTheme.zIndex,
      ...zIndex
    }
  });
}

/**
 * Tạo theme cho Tailwind CSS
 * @param {Object} options - Các tùy chọn
 * @returns {Object} - Theme cho Tailwind CSS
 */
export function createTailwindTheme(options = {}) {
  const {
    mode = THEME_MODES.LIGHT,
    colors = {},
    typography = {},
    shape = {},
    spacing = 8,
    breakpoints = {},
    shadows = [],
    transitions = {},
    zIndex = {}
  } = options;
  
  const baseTheme = mode === THEME_MODES.DARK ? DARK_THEME : DEFAULT_THEME;
  
  // Merge colors
  const mergedColors = {
    ...baseTheme.colors,
    ...colors
  };
  
  // Chuyển đổi colors sang format của Tailwind CSS
  const tailwindColors = {
    primary: {
      50: lightenColor(mergedColors[COLORS.PRIMARY].main, 0.85),
      100: lightenColor(mergedColors[COLORS.PRIMARY].main, 0.8),
      200: lightenColor(mergedColors[COLORS.PRIMARY].main, 0.6),
      300: lightenColor(mergedColors[COLORS.PRIMARY].main, 0.4),
      400: lightenColor(mergedColors[COLORS.PRIMARY].main, 0.2),
      500: mergedColors[COLORS.PRIMARY].main,
      600: darkenColor(mergedColors[COLORS.PRIMARY].main, 0.1),
      700: darkenColor(mergedColors[COLORS.PRIMARY].main, 0.2),
      800: darkenColor(mergedColors[COLORS.PRIMARY].main, 0.3),
      900: darkenColor(mergedColors[COLORS.PRIMARY].main, 0.4)
    },
    secondary: {
      50: lightenColor(mergedColors[COLORS.SECONDARY].main, 0.85),
      100: lightenColor(mergedColors[COLORS.SECONDARY].main, 0.8),
      200: lightenColor(mergedColors[COLORS.SECONDARY].main, 0.6),
      300: lightenColor(mergedColors[COLORS.SECONDARY].main, 0.4),
      400: lightenColor(mergedColors[COLORS.SECONDARY].main, 0.2),
      500: mergedColors[COLORS.SECONDARY].main,
      600: darkenColor(mergedColors[COLORS.SECONDARY].main, 0.1),
      700: darkenColor(mergedColors[COLORS.SECONDARY].main, 0.2),
      800: darkenColor(mergedColors[COLORS.SECONDARY].main, 0.3),
      900: darkenColor(mergedColors[COLORS.SECONDARY].main, 0.4)
    },
    success: {
      50: lightenColor(mergedColors[COLORS.SUCCESS].main, 0.85),
      100: lightenColor(mergedColors[COLORS.SUCCESS].main, 0.8),
      200: lightenColor(mergedColors[COLORS.SUCCESS].main, 0.6),
      300: lightenColor(mergedColors[COLORS.SUCCESS].main, 0.4),
      400: lightenColor(mergedColors[COLORS.SUCCESS].main, 0.2),
      500: mergedColors[COLORS.SUCCESS].main,
      600: darkenColor(mergedColors[COLORS.SUCCESS].main, 0.1),
      700: darkenColor(mergedColors[COLORS.SUCCESS].main, 0.2),
      800: darkenColor(mergedColors[COLORS.SUCCESS].main, 0.3),
      900: darkenColor(mergedColors[COLORS.SUCCESS].main, 0.4)
    },
    error: {
      50: lightenColor(mergedColors[COLORS.ERROR].main, 0.85),
      100: lightenColor(mergedColors[COLORS.ERROR].main, 0.8),
      200: lightenColor(mergedColors[COLORS.ERROR].main, 0.6),
      300: lightenColor(mergedColors[COLORS.ERROR].main, 0.4),
      400: lightenColor(mergedColors[COLORS.ERROR].main, 0.2),
      500: mergedColors[COLORS.ERROR].main,
      600: darkenColor(mergedColors[COLORS.ERROR].main, 0.1),
      700: darkenColor(mergedColors[COLORS.ERROR].main, 0.2),
      800: darkenColor(mergedColors[COLORS.ERROR].main, 0.3),
      900: darkenColor(mergedColors[COLORS.ERROR].main, 0.4)
    },
    warning: {
      50: lightenColor(mergedColors[COLORS.WARNING].main, 0.85),
      100: lightenColor(mergedColors[COLORS.WARNING].main, 0.8),
      200: lightenColor(mergedColors[COLORS.WARNING].main, 0.6),
      300: lightenColor(mergedColors[COLORS.WARNING].main, 0.4),
      400: lightenColor(mergedColors[COLORS.WARNING].main, 0.2),
      500: mergedColors[COLORS.WARNING].main,
      600: darkenColor(mergedColors[COLORS.WARNING].main, 0.1),
      700: darkenColor(mergedColors[COLORS.WARNING].main, 0.2),
      800: darkenColor(mergedColors[COLORS.WARNING].main, 0.3),
      900: darkenColor(mergedColors[COLORS.WARNING].main, 0.4)
    },
    info: {
      50: lightenColor(mergedColors[COLORS.INFO].main, 0.85),
      100: lightenColor(mergedColors[COLORS.INFO].main, 0.8),
      200: lightenColor(mergedColors[COLORS.INFO].main, 0.6),
      300: lightenColor(mergedColors[COLORS.INFO].main, 0.4),
      400: lightenColor(mergedColors[COLORS.INFO].main, 0.2),
      500: mergedColors[COLORS.INFO].main,
      600: darkenColor(mergedColors[COLORS.INFO].main, 0.1),
      700: darkenColor(mergedColors[COLORS.INFO].main, 0.2),
      800: darkenColor(mergedColors[COLORS.INFO].main, 0.3),
      900: darkenColor(mergedColors[COLORS.INFO].main, 0.4)
    },
    gray: {
      50: mode === THEME_MODES.DARK ? '#424242' : '#fafafa',
      100: mode === THEME_MODES.DARK ? '#616161' : '#f5f5f5',
      200: mode === THEME_MODES.DARK ? '#757575' : '#eeeeee',
      300: mode === THEME_MODES.DARK ? '#9e9e9e' : '#e0e0e0',
      400: mode === THEME_MODES.DARK ? '#bdbdbd' : '#bdbdbd',
      500: mode === THEME_MODES.DARK ? '#e0e0e0' : '#9e9e9e',
      600: mode === THEME_MODES.DARK ? '#eeeeee' : '#757575',
      700: mode === THEME_MODES.DARK ? '#f5f5f5' : '#616161',
      800: mode === THEME_MODES.DARK ? '#fafafa' : '#424242',
      900: mode === THEME_MODES.DARK ? '#ffffff' : '#212121'
    },
    background: {
      default: mergedColors[COLORS.BACKGROUND].default,
      paper: mergedColors[COLORS.BACKGROUND].paper
    },
    text: {
      primary: mergedColors[COLORS.TEXT].primary,
      secondary: mergedColors[COLORS.TEXT].secondary,
      disabled: mergedColors[COLORS.TEXT].disabled
    }
  };
  
  // Chuyển đổi typography sang format của Tailwind CSS
  const tailwindTypography = {
    fontFamily: typography.fontFamily || baseTheme.typography.fontFamily,
    fontSize: {},
    fontWeight: {},
    lineHeight: {}
  };
  
  // Chuyển đổi font size
  Object.entries(FONT_SIZE_MAPPING).forEach(([key, value]) => {
    tailwindTypography.fontSize[key] = value.tailwind;
  });
  
  // Chuyển đổi font weight
  Object.entries(FONT_WEIGHT_MAPPING).forEach(([key, value]) => {
    tailwindTypography.fontWeight[key] = value.tailwind;
  });
  
  // Chuyển đổi line height
  Object.entries(LINE_HEIGHT_MAPPING).forEach(([key, value]) => {
    tailwindTypography.lineHeight[key] = value.tailwind;
  });
  
  // Chuyển đổi spacing sang format của Tailwind CSS
  const tailwindSpacing = {};
  Object.entries(SPACING_MAPPING).forEach(([key, value]) => {
    tailwindSpacing[key] = value.tailwind;
  });
  
  // Chuyển đổi breakpoints sang format của Tailwind CSS
  const tailwindBreakpoints = {};
  Object.entries(BREAKPOINT_MAPPING).forEach(([key, value]) => {
    tailwindBreakpoints[key] = value.tailwind;
  });
  
  // Chuyển đổi border radius sang format của Tailwind CSS
  const tailwindBorderRadius = {};
  Object.entries(BORDER_RADIUS_MAPPING).forEach(([key, value]) => {
    tailwindBorderRadius[key] = value.tailwind;
  });
  
  // Chuyển đổi shadows sang format của Tailwind CSS
  const tailwindShadows = {};
  Object.entries(SHADOW_MAPPING).forEach(([key, value]) => {
    tailwindShadows[key] = value.tailwind;
  });
  
  // Tạo theme cho Tailwind CSS
  return {
    mode,
    colors: tailwindColors,
    typography: tailwindTypography,
    spacing: tailwindSpacing,
    borderRadius: tailwindBorderRadius,
    shadows: tailwindShadows,
    breakpoints: tailwindBreakpoints,
    zIndex: Z_INDEX_MAPPING,
    opacity: OPACITY_MAPPING
  };
}

/**
 * Làm sáng màu
 * @param {string} color - Màu cần làm sáng
 * @param {number} amount - Mức độ làm sáng (0-1)
 * @returns {string} - Màu đã làm sáng
 */
function lightenColor(color, amount) {
  try {
    // Chuyển đổi hex sang rgb
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          }
        : null;
    };
    
    // Chuyển đổi rgb sang hex
    const rgbToHex = (r, g, b) => {
      return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };
    
    const rgb = hexToRgb(color);
    if (!rgb) return color;
    
    const r = Math.round(rgb.r + (255 - rgb.r) * amount);
    const g = Math.round(rgb.g + (255 - rgb.g) * amount);
    const b = Math.round(rgb.b + (255 - rgb.b) * amount);
    
    return rgbToHex(r, g, b);
  } catch (error) {
    console.error('Error lightening color:', error);
    return color;
  }
}

/**
 * Làm tối màu
 * @param {string} color - Màu cần làm tối
 * @param {number} amount - Mức độ làm tối (0-1)
 * @returns {string} - Màu đã làm tối
 */
function darkenColor(color, amount) {
  try {
    // Chuyển đổi hex sang rgb
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          }
        : null;
    };
    
    // Chuyển đổi rgb sang hex
    const rgbToHex = (r, g, b) => {
      return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };
    
    const rgb = hexToRgb(color);
    if (!rgb) return color;
    
    const r = Math.round(rgb.r * (1 - amount));
    const g = Math.round(rgb.g * (1 - amount));
    const b = Math.round(rgb.b * (1 - amount));
    
    return rgbToHex(r, g, b);
  } catch (error) {
    console.error('Error darkening color:', error);
    return color;
  }
}

// Context cho theme
const ThemeContext = createContext();

/**
 * Hook để sử dụng theme
 * @returns {Object} - Theme và các hàm liên quan
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * Provider cho theme
 * @param {Object} props - Props
 * @returns {React.Component} - Provider component
 */
export function ThemeProvider({ children, initialMode = THEME_MODES.LIGHT }) {
  // Lấy theme mode từ storage hoặc sử dụng giá trị mặc định
  const [mode, setMode] = useState(() => {
    const savedMode = StorageAdapter.getItem(THEME_STORAGE_KEY);
    if (savedMode && Object.values(THEME_MODES).includes(savedMode)) {
      return savedMode;
    }
    return initialMode;
  });
  
  // Lấy theme mode từ redux nếu có
  const dispatch = useDispatch();
  const reduxThemeMode = useSelector(state => state.theme?.mode);
  
  // Đồng bộ theme mode với redux
  useEffect(() => {
    if (reduxThemeMode && reduxThemeMode !== mode) {
      setMode(reduxThemeMode);
    }
  }, [reduxThemeMode]);
  
  // Đồng bộ theme mode với system preference
  useEffect(() => {
    if (mode === THEME_MODES.SYSTEM) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e) => {
        const systemMode = e.matches ? THEME_MODES.DARK : THEME_MODES.LIGHT;
        // Không cập nhật state để tránh vòng lặp
        // Chỉ cập nhật theme
        document.documentElement.setAttribute('data-theme', systemMode);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      handleChange(mediaQuery);
      
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [mode]);
  
  // Tạo theme dựa trên mode
  const materialTheme = useMemo(() => {
    return createMaterialTheme({ mode });
  }, [mode]);
  
  const tailwindTheme = useMemo(() => {
    return createTailwindTheme({ mode });
  }, [mode]);
  
  // Cập nhật theme mode
  const setThemeMode = useCallback((newMode) => {
    if (Object.values(THEME_MODES).includes(newMode)) {
      setMode(newMode);
      StorageAdapter.setItem(THEME_STORAGE_KEY, newMode);
      
      // Cập nhật redux state nếu có
      if (dispatch) {
        dispatch({ type: 'theme/setMode', payload: newMode });
      }
      
      // Cập nhật data-theme attribute
      if (newMode === THEME_MODES.SYSTEM) {
        const systemMode = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? THEME_MODES.DARK
          : THEME_MODES.LIGHT;
        document.documentElement.setAttribute('data-theme', systemMode);
      } else {
        document.documentElement.setAttribute('data-theme', newMode);
      }
    }
  }, [dispatch]);
  
  // Chuyển đổi giữa light và dark mode
  const toggleThemeMode = useCallback(() => {
    setThemeMode(mode === THEME_MODES.DARK ? THEME_MODES.LIGHT : THEME_MODES.DARK);
  }, [mode, setThemeMode]);
  
  // Giá trị context
  const value = useMemo(() => ({
    mode,
    setMode: setThemeMode,
    toggleMode: toggleThemeMode,
    theme: isClientInterface ? tailwindTheme : materialTheme,
    materialTheme,
    tailwindTheme,
    isDark: mode === THEME_MODES.DARK || (mode === THEME_MODES.SYSTEM && window.matchMedia('(prefers-color-scheme: dark)').matches)
  }), [mode, setThemeMode, toggleThemeMode, materialTheme, tailwindTheme]);
  
  // Provider component
  return (
    <ThemeContext.Provider value={value}>
      {isClientInterface ? (
        // Tailwind CSS không cần ThemeProvider
        children
      ) : (
        // Material UI cần ThemeProvider
        <MuiThemeProvider theme={materialTheme}>
          {children}
        </MuiThemeProvider>
      )}
    </ThemeContext.Provider>
  );
}

/**
 * HOC để sử dụng theme trong class component
 * @param {React.Component} Component - Component cần wrap
 * @returns {React.Component} - Wrapped component
 */
export function withTheme(Component) {
  return function WrappedComponent(props) {
    const theme = useTheme();
    return <Component {...props} theme={theme} />;
  };
}

/**
 * Hook để tạo styles với theme
 * @param {Function} stylesFn - Hàm tạo styles
 * @returns {Function} - Hook để lấy styles
 */
export function makeStyles(stylesFn) {
  // Nếu là giao diện Material UI, sử dụng makeStyles của Material UI
  if (!isClientInterface) {
    return muiMakeStyles(stylesFn);
  }
  
  // Nếu là giao diện Tailwind CSS, tạo hook tương tự
  return function useStyles(props = {}) {
    const theme = useTheme();
    
    // Tạo styles từ stylesFn
    const styles = useMemo(() => {
      return stylesFn(theme.theme, props);
    }, [theme.theme, props]);
    
    // Chuyển đổi styles sang className của Tailwind CSS
    const classes = useMemo(() => {
      const result = {};
      
      Object.entries(styles).forEach(([key, value]) => {
        if (typeof value === 'string') {
          // Nếu value là string, giả sử đó là className của Tailwind CSS
          result[key] = value;
        } else if (typeof value === 'object') {
          // Nếu value là object, chuyển đổi sang className của Tailwind CSS
          result[key] = convertStyleToTailwind(value);
        }
      });
      
      return result;
    }, [styles]);
    
    return classes;
  };
}

/**
 * Chuyển đổi style object sang className của Tailwind CSS
 * @param {Object} style - Style object
 * @returns {string} - Tailwind CSS className
 */
function convertStyleToTailwind(style) {
  // Ánh xạ các thuộc tính CSS sang Tailwind CSS
  const cssToTailwind = {
    // Typography
    fontFamily: {
      'sans-serif': 'font-sans',
      'serif': 'font-serif',
      'monospace': 'font-mono'
    },
    fontSize: {
      '0.75rem': 'text-xs',
      '0.875rem': 'text-sm',
      '1rem': 'text-base',
      '1.125rem': 'text-lg',
      '1.25rem': 'text-xl',
      '1.5rem': 'text-2xl',
      '1.875rem': 'text-3xl',
      '2.25rem': 'text-4xl',
      '3rem': 'text-5xl',
      '3.75rem': 'text-6xl',
      '4.5rem': 'text-7xl',
      '6rem': 'text-8xl',
      '8rem': 'text-9xl'
    },
    fontWeight: {
      '100': 'font-thin',
      '200': 'font-extralight',
      '300': 'font-light',
      '400': 'font-normal',
      '500': 'font-medium',
      '600': 'font-semibold',
      '700': 'font-bold',
      '800': 'font-extrabold',
      '900': 'font-black'
    },
    lineHeight: {
      '1': 'leading-none',
      '1.25': 'leading-tight',
      '1.375': 'leading-snug',
      '1.5': 'leading-normal',
      '1.625': 'leading-relaxed',
      '2': 'leading-loose'
    },
    // Colors
    color: {},
    backgroundColor: {},
    // Spacing
    margin: {},
    marginTop: {},
    marginRight: {},
    marginBottom: {},
    marginLeft: {},
    padding: {},
    paddingTop: {},
    paddingRight: {},
    paddingBottom: {},
    paddingLeft: {},
    // Layout
    display: {
      'block': 'block',
      'inline-block': 'inline-block',
      'inline': 'inline',
      'flex': 'flex',
      'inline-flex': 'inline-flex',
      'grid': 'grid',
      'inline-grid': 'inline-grid',
      'none': 'hidden'
    },
    position: {
      'static': 'static',
      'fixed': 'fixed',
      'absolute': 'absolute',
      'relative': 'relative',
      'sticky': 'sticky'
    },
    // Flexbox
    flexDirection: {
      'row': 'flex-row',
      'row-reverse': 'flex-row-reverse',
      'column': 'flex-col',
      'column-reverse': 'flex-col-reverse'
    },
    flexWrap: {
      'nowrap': 'flex-nowrap',
      'wrap': 'flex-wrap',
      'wrap-reverse': 'flex-wrap-reverse'
    },
    alignItems: {
      'flex-start': 'items-start',
      'flex-end': 'items-end',
      'center': 'items-center',
      'baseline': 'items-baseline',
      'stretch': 'items-stretch'
    },
    justifyContent: {
      'flex-start': 'justify-start',
      'flex-end': 'justify-end',
      'center': 'justify-center',
      'space-between': 'justify-between',
      'space-around': 'justify-around',
      'space-evenly': 'justify-evenly'
    },
    // Border
    borderRadius: {},
    borderWidth: {
      '0': 'border-0',
      '1px': 'border',
      '2px': 'border-2',
      '4px': 'border-4',
      '8px': 'border-8'
    },
    borderColor: {},
    // Shadow
    boxShadow: {}
  };
  
  // Tạo className từ style object
  const classNames = [];
  
  Object.entries(style).forEach(([property, value]) => {
    if (cssToTailwind[property]) {
      if (typeof cssToTailwind[property] === 'object') {
        const tailwindClass = cssToTailwind[property][value];
        if (tailwindClass) {
          classNames.push(tailwindClass);
        }
      }
    }
    
    // Xử lý các trường hợp đặc biệt
    if (property === 'color' || property === 'backgroundColor' || property === 'borderColor') {
      const colorValue = convertColorToTailwind(value);
      if (colorValue) {
        if (property === 'color') {
          classNames.push(`text-[${colorValue}]`);
        } else if (property === 'backgroundColor') {
          classNames.push(`bg-[${colorValue}]`);
        } else if (property === 'borderColor') {
          classNames.push(`border-[${colorValue}]`);
        }
      }
    }
    
    // Xử lý margin và padding
    if (property.startsWith('margin') || property.startsWith('padding')) {
      const size = parseFloat(value);
      if (!isNaN(size)) {
        const prefix = property.startsWith('margin') ? 'm' : 'p';
        let suffix = '';
        
        if (property === 'margin' || property === 'padding') {
          suffix = '';
        } else if (property.endsWith('Top')) {
          suffix = 't';
        } else if (property.endsWith('Right')) {
          suffix = 'r';
        } else if (property.endsWith('Bottom')) {
          suffix = 'b';
        } else if (property.endsWith('Left')) {
          suffix = 'l';
        }
        
        classNames.push(`${prefix}${suffix}-${size}`);
      }
    }
    
    // Xử lý border radius
    if (property === 'borderRadius') {
      const size = parseFloat(value);
      if (!isNaN(size)) {
        if (size === 0) {
          classNames.push('rounded-none');
        } else if (size <= 2) {
          classNames.push('rounded-sm');
        } else if (size <= 4) {
          classNames.push('rounded');
        } else if (size <= 8) {
          classNames.push('rounded-lg');
        } else if (size <= 12) {
          classNames.push('rounded-xl');
        } else if (size <= 16) {
          classNames.push('rounded-2xl');
        } else if (size <= 24) {
          classNames.push('rounded-3xl');
        } else {
          classNames.push('rounded-full');
        }
      }
    }
    
    // Xử lý box shadow
    if (property === 'boxShadow') {
      if (value === 'none') {
        classNames.push('shadow-none');
      } else {
        const shadowLevel = value.split(',').length;
        if (shadowLevel <= 1) {
          classNames.push('shadow-sm');
        } else if (shadowLevel <= 2) {
          classNames.push('shadow');
        } else if (shadowLevel <= 3) {
          classNames.push('shadow-md');
        } else if (shadowLevel <= 4) {
          classNames.push('shadow-lg');
        } else if (shadowLevel <= 5) {
          classNames.push('shadow-xl');
        } else {
          classNames.push('shadow-2xl');
        }
      }
    }
  });
  
  return classNames.join(' ');
}

// Export các hàm và constants
export default {
  ThemeProvider,
  useTheme,
  withTheme,
  makeStyles,
  createMaterialTheme,
  createTailwindTheme,
  convertColorToTailwind,
  THEME_MODES,
  COLORS,
  BREAKPOINTS
};