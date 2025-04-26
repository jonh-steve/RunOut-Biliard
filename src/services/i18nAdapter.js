/**
 * Internationalization Adapter
 * 
 * Lớp adapter này giúp đồng bộ hóa hệ thống đa ngôn ngữ giữa giao diện User và Client
 * Cung cấp interface thống nhất để quản lý ngôn ngữ trong cả hai giao diện
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IntlProvider, FormattedMessage as ReactFormattedMessage, useIntl as useReactIntl } from 'react-intl';
import StorageAdapter from './storageAdapter';

// Kiểm tra môi trường hiện tại
const isClientInterface = process.env.REACT_APP_INTERFACE === 'client';

// Key lưu trữ ngôn ngữ trong storage
const LANGUAGE_STORAGE_KEY = 'app_language';

// Ngôn ngữ mặc định
const DEFAULT_LANGUAGE = 'vi';

// Danh sách ngôn ngữ được hỗ trợ
const SUPPORTED_LANGUAGES = ['vi', 'en'];

/**
 * Tải messages cho ngôn ngữ cụ thể
 * @param {string} locale - Mã ngôn ngữ
 * @returns {Promise<Object>} - Promise với messages
 */
async function loadMessages(locale) {
  try {
    // Tải messages từ file JSON
    const messages = await import(`../locales/${locale}.json`);
    return messages.default || messages;
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
    // Fallback to empty messages
    return {};
  }
}

/**
 * Format date theo locale
 * @param {Date|string|number} date - Ngày cần format
 * @param {Object} options - Các tùy chọn format
 * @param {string} locale - Mã ngôn ngữ
 * @returns {string} - Ngày đã được format
 */
function formatDate(date, options = {}, locale = DEFAULT_LANGUAGE) {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
}

/**
 * Format number theo locale
 * @param {number} number - Số cần format
 * @param {Object} options - Các tùy chọn format
 * @param {string} locale - Mã ngôn ngữ
 * @returns {string} - Số đã được format
 */
function formatNumber(number, options = {}, locale = DEFAULT_LANGUAGE) {
  const defaultOptions = {
    style: 'decimal',
    ...options
  };
  
  return new Intl.NumberFormat(locale, defaultOptions).format(number);
}

/**
 * Format currency theo locale
 * @param {number} amount - Số tiền cần format
 * @param {string} currency - Mã tiền tệ (VND, USD, etc.)
 * @param {Object} options - Các tùy chọn format
 * @param {string} locale - Mã ngôn ngữ
 * @returns {string} - Số tiền đã được format
 */
function formatCurrency(amount, currency = 'VND', options = {}, locale = DEFAULT_LANGUAGE) {
  const defaultOptions = {
    style: 'currency',
    currency,
    ...options
  };
  
  return new Intl.NumberFormat(locale, defaultOptions).format(amount);
}

/**
 * Format relative time theo locale
 * @param {Date|string|number} date - Ngày cần format
 * @param {Object} options - Các tùy chọn format
 * @param {string} locale - Mã ngôn ngữ
 * @returns {string} - Thời gian tương đối đã được format
 */
function formatRelativeTime(date, options = {}, locale = DEFAULT_LANGUAGE) {
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);
  
  const units = {
    year: 24 * 60 * 60 * 365,
    month: 24 * 60 * 60 * 30,
    week: 24 * 60 * 60 * 7,
    day: 24 * 60 * 60,
    hour: 60 * 60,
    minute: 60,
    second: 1
  };
  
  let unit = 'second';
  let value = diffInSeconds;
  
  for (const [unitName, seconds] of Object.entries(units)) {
    if (Math.abs(diffInSeconds) >= seconds) {
      unit = unitName;
      value = Math.floor(diffInSeconds / seconds);
      break;
    }
  }
  
  const rtf = new Intl.RelativeTimeFormat(locale, {
    numeric: 'auto',
    ...options
  });
  
  return rtf.format(-value, unit);
}

/**
 * Redux I18n Adapter - Sử dụng cho giao diện User
 */
export class ReduxI18nAdapter {
  /**
   * Tạo các action types cho Redux
   * @returns {Object} - Các action types
   */
  static getActionTypes() {
    return {
      SET_LANGUAGE: 'I18N_SET_LANGUAGE',
      SET_MESSAGES: 'I18N_SET_MESSAGES'
    };
  }

  /**
   * Tạo các action creators cho Redux
   * @returns {Object} - Các action creators
   */
  static getActionCreators() {
    const actionTypes = this.getActionTypes();
    
    return {
      setLanguage: (language) => ({
        type: actionTypes.SET_LANGUAGE,
        payload: language
      }),
      
      setMessages: (messages) => ({
        type: actionTypes.SET_MESSAGES,
        payload: messages
      })
    };
  }

  /**
   * Tạo các thunk actions cho Redux
   * @returns {Object} - Các thunk actions
   */
  static getThunkActions() {
    const actionCreators = this.getActionCreators();
    
    return {
      changeLanguage: (language) => async (dispatch) => {
        if (!SUPPORTED_LANGUAGES.includes(language)) {
          console.warn(`Language ${language} is not supported. Falling back to ${DEFAULT_LANGUAGE}.`);
          language = DEFAULT_LANGUAGE;
        }
        
        // Lưu ngôn ngữ vào storage
        StorageAdapter.setItem(LANGUAGE_STORAGE_KEY, language);
        
        // Tải messages cho ngôn ngữ mới
        const messages = await loadMessages(language);
        
        // Dispatch actions
        dispatch(actionCreators.setLanguage(language));
        dispatch(actionCreators.setMessages(messages));
        
        return { language, messages };
      },
      
      initializeI18n: () => async (dispatch) => {
        // Lấy ngôn ngữ từ storage hoặc sử dụng ngôn ngữ mặc định
        const savedLanguage = StorageAdapter.getItem(LANGUAGE_STORAGE_KEY) || DEFAULT_LANGUAGE;
        
        // Tải messages cho ngôn ngữ
        const messages = await loadMessages(savedLanguage);
        
        // Dispatch actions
        dispatch(actionCreators.setLanguage(savedLanguage));
        dispatch(actionCreators.setMessages(messages));
        
        return { language: savedLanguage, messages };
      }
    };
  }

  /**
   * Tạo reducer cho Redux
   * @returns {Function} - Reducer function
   */
  static createReducer() {
    const actionTypes = this.getActionTypes();
    
    const initialState = {
      language: DEFAULT_LANGUAGE,
      messages: {}
    };
    
    return (state = initialState, action) => {
      switch (action.type) {
        case actionTypes.SET_LANGUAGE:
          return {
            ...state,
            language: action.payload
          };
          
        case actionTypes.SET_MESSAGES:
          return {
            ...state,
            messages: action.payload
          };
          
        default:
          return state;
      }
    };
  }

  /**
   * Tạo các selectors cho Redux
   * @returns {Object} - Các selectors
   */
  static getSelectors() {
    return {
      getLanguage: (state) => state.i18n.language,
      getMessages: (state) => state.i18n.messages
    };
  }
}

/**
 * Context API I18n Adapter - Sử dụng cho giao diện Client
 */
export class ContextI18nAdapter {
  /**
   * Tạo Context cho i18n
   * @returns {React.Context} - I18n Context
   */
  static createContext() {
    return createContext({
      language: DEFAULT_LANGUAGE,
      messages: {},
      changeLanguage: () => {},
      formatMessage: () => {},
      formatDate: () => {},
      formatNumber: () => {},
      formatCurrency: () => {},
      formatRelativeTime: () => {}
    });
  }

  /**
   * Tạo Provider cho i18n context
   * @param {React.Context} I18nContext - I18n context
   * @returns {Function} - Provider component
   */
  static createProvider(I18nContext) {
    return ({ children }) => {
      const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
      const [messages, setMessages] = useState({});
      
      // Khởi tạo i18n
      useEffect(() => {
        const initialize = async () => {
          // Lấy ngôn ngữ từ storage hoặc sử dụng ngôn ngữ mặc định
          const savedLanguage = StorageAdapter.getItem(LANGUAGE_STORAGE_KEY) || DEFAULT_LANGUAGE;
          
          // Tải messages cho ngôn ngữ
          const loadedMessages = await loadMessages(savedLanguage);
          
          setLanguage(savedLanguage);
          setMessages(loadedMessages);
        };
        
        initialize();
      }, []);
      
      // Thay đổi ngôn ngữ
      const changeLanguage = async (newLanguage) => {
        if (!SUPPORTED_LANGUAGES.includes(newLanguage)) {
          console.warn(`Language ${newLanguage} is not supported. Falling back to ${DEFAULT_LANGUAGE}.`);
          newLanguage = DEFAULT_LANGUAGE;
        }
        
        // Lưu ngôn ngữ vào storage
        StorageAdapter.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
        
        // Tải messages cho ngôn ngữ mới
        const loadedMessages = await loadMessages(newLanguage);
        
        setLanguage(newLanguage);
        setMessages(loadedMessages);
        
        return { language: newLanguage, messages: loadedMessages };
      };
      
      // Format message
      const formatMessage = (id, values = {}) => {
        const message = messages[id];
        
        if (!message) {
          console.warn(`Message with id "${id}" not found.`);
          return id;
        }
        
        // Simple interpolation
        return message.replace(/\{(\w+)\}/g, (match, key) => {
          return values[key] !== undefined ? values[key] : match;
        });
      };
      
      // Context value
      const value = {
        language,
        messages,
        changeLanguage,
        formatMessage,
        formatDate: (date, options) => formatDate(date, options, language),
        formatNumber: (number, options) => formatNumber(number, options, language),
        formatCurrency: (amount, currency, options) => formatCurrency(amount, currency, options, language),
        formatRelativeTime: (date, options) => formatRelativeTime(date, options, language)
      };
      
      return (
        <IntlProvider locale={language} messages={messages}>
          <I18nContext.Provider value={value}>
            {children}
          </I18nContext.Provider>
        </IntlProvider>
      );
    };
  }

  /**
   * Tạo hook để sử dụng i18n
   * @param {React.Context} I18nContext - I18n context
   * @returns {Function} - Hook function
   */
  static createHook(I18nContext) {
    return () => useContext(I18nContext);
  }
}

/**
 * Hook để sử dụng i18n trong cả hai giao diện
 * @returns {Object} - I18n state và methods
 */
export function useI18n() {
  if (isClientInterface) {
    // Client interface sử dụng Context API
    const I18nContext = React.createContext();
    const context = useContext(I18nContext);
    const intl = useReactIntl();
    
    return {
      ...context,
      formatMessage: intl.formatMessage
    };
  } else {
    // User interface sử dụng Redux
    const dispatch = useDispatch();
    const thunkActions = ReduxI18nAdapter.getThunkActions();
    const selectors = ReduxI18nAdapter.getSelectors();
    
    const language = useSelector(selectors.getLanguage);
    const messages = useSelector(selectors.getMessages);
    const intl = useReactIntl();
    
    return {
      language,
      messages,
      changeLanguage: (newLanguage) => dispatch(thunkActions.changeLanguage(newLanguage)),
      formatMessage: intl.formatMessage,
      formatDate: (date, options) => formatDate(date, options, language),
      formatNumber: (number, options) => formatNumber(number, options, language),
      formatCurrency: (amount, currency, options) => formatCurrency(amount, currency, options, language),
      formatRelativeTime: (date, options) => formatRelativeTime(date, options, language)
    };
  }
}

/**
 * Component để hiển thị message đã được format
 * @param {Object} props - Component props
 * @returns {React.Element} - React element
 */
export function FormattedMessage(props) {
  return <ReactFormattedMessage {...props} />;
}

/**
 * Component để hiển thị date đã được format
 * @param {Object} props - Component props
 * @returns {React.Element} - React element
 */
export function FormattedDate({ value, ...props }) {
  const { formatDate } = useI18n();
  return <>{formatDate(value, props)}</>;
}

/**
 * Component để hiển thị number đã được format
 * @param {Object} props - Component props
 * @returns {React.Element} - React element
 */
export function FormattedNumber({ value, ...props }) {
  const { formatNumber } = useI18n();
  return <>{formatNumber(value, props)}</>;
}

/**
 * Component để hiển thị currency đã được format
 * @param {Object} props - Component props
 * @returns {React.Element} - React element
 */
export function FormattedCurrency({ value, currency, ...props }) {
  const { formatCurrency } = useI18n();
  return <>{formatCurrency(value, currency, props)}</>;
}

/**
 * Component để hiển thị relative time đã được format
 * @param {Object} props - Component props
 * @returns {React.Element} - React element
 */
export function FormattedRelativeTime({ value, ...props }) {
  const { formatRelativeTime } = useI18n();
  return <>{formatRelativeTime(value, props)}</>;
}

/**
 * HOC để cung cấp i18n cho component
 * @param {React.Component} Component - Component cần wrap
 * @returns {React.Component} - Wrapped component
 */
export function withI18n(Component) {
  return (props) => {
    const i18n = useI18n();
    return <Component {...props} i18n={i18n} />;
  };
}

/**
 * Internationalization Adapter - Sử dụng cho cả hai giao diện
 */
export default {
  // Các hooks và components
  useI18n,
  FormattedMessage,
  FormattedDate,
  FormattedNumber,
  FormattedCurrency,
  FormattedRelativeTime,
  withI18n,
  
  // Các utility functions
  formatDate,
  formatNumber,
  formatCurrency,
  formatRelativeTime,
  
  // Các constants
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  
  // Adapter classes
  ReduxI18nAdapter,
  ContextI18nAdapter
};