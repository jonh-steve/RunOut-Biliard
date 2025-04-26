/**
 * Storage Adapter
 * 
 * Lớp adapter này giúp đồng bộ hóa việc lưu trữ dữ liệu giữa giao diện User và Client
 * Cung cấp interface thống nhất để lưu trữ dữ liệu trong cả hai giao diện
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Kiểm tra môi trường hiện tại
const isClientInterface = process.env.REACT_APP_INTERFACE === 'client';
const isServer = typeof window === 'undefined';

// Prefix cho các key trong storage
const KEY_PREFIX = 'runout_';

// Các loại storage
const STORAGE_TYPES = {
  LOCAL: 'localStorage',
  SESSION: 'sessionStorage',
  MEMORY: 'memoryStorage'
};

// In-memory storage cho server-side rendering và fallback
const memoryStorage = new Map();

/**
 * Kiểm tra xem storage có khả dụng không
 * @param {string} type - Loại storage (localStorage, sessionStorage)
 * @returns {boolean} - true nếu storage khả dụng, false nếu không
 */
function isStorageAvailable(type) {
  if (isServer) return false;
  
  try {
    const storage = window[type];
    const testKey = `${KEY_PREFIX}test`;
    storage.setItem(testKey, 'test');
    storage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

// Kiểm tra khả năng sử dụng của các loại storage
const storageAvailability = {
  [STORAGE_TYPES.LOCAL]: !isServer && isStorageAvailable(STORAGE_TYPES.LOCAL),
  [STORAGE_TYPES.SESSION]: !isServer && isStorageAvailable(STORAGE_TYPES.SESSION),
  [STORAGE_TYPES.MEMORY]: true
};

/**
 * Lấy storage phù hợp dựa trên loại và khả năng sử dụng
 * @param {string} type - Loại storage
 * @returns {Object} - Storage object
 */
function getStorage(type = STORAGE_TYPES.LOCAL) {
  // Nếu đang ở server hoặc storage không khả dụng, sử dụng memory storage
  if (isServer || !storageAvailability[type]) {
    return {
      getItem: (key) => memoryStorage.get(key),
      setItem: (key, value) => memoryStorage.set(key, value),
      removeItem: (key) => memoryStorage.delete(key),
      clear: () => memoryStorage.clear(),
      key: (index) => {
        const keys = Array.from(memoryStorage.keys());
        return keys[index];
      },
      length: memoryStorage.size
    };
  }
  
  // Sử dụng storage của browser
  return window[type];
}

/**
 * Lưu dữ liệu vào storage
 * @param {string} key - Key để lưu dữ liệu
 * @param {any} value - Giá trị cần lưu
 * @param {Object} options - Các tùy chọn
 * @returns {void}
 */
function setItem(key, value, options = {}) {
  const {
    type = STORAGE_TYPES.LOCAL,
    expiry = null,
    prefix = KEY_PREFIX,
    serialize = true
  } = options;
  
  const storage = getStorage(type);
  const prefixedKey = `${prefix}${key}`;
  
  // Nếu value là undefined, xóa item
  if (value === undefined) {
    storage.removeItem(prefixedKey);
    return;
  }
  
  // Chuẩn bị dữ liệu để lưu
  let dataToStore = value;
  
  // Nếu có expiry, thêm thông tin expiry vào dữ liệu
  if (expiry) {
    const expiryTime = Date.now() + expiry;
    dataToStore = {
      data: value,
      expiry: expiryTime
    };
  }
  
  // Serialize dữ liệu nếu cần
  const serializedData = serialize ? JSON.stringify(dataToStore) : dataToStore;
  
  try {
    // Lưu dữ liệu vào storage
    storage.setItem(prefixedKey, serializedData);
    
    // Dispatch event để thông báo cho các tab khác
    if (!isServer && type !== STORAGE_TYPES.MEMORY) {
      const event = new CustomEvent('runout-storage', {
        detail: {
          key: prefixedKey,
          value: serializedData,
          type
        }
      });
      window.dispatchEvent(event);
    }
  } catch (error) {
    console.error('Error setting item in storage:', error);
    
    // Fallback to memory storage
    if (type !== STORAGE_TYPES.MEMORY) {
      setItem(key, value, { ...options, type: STORAGE_TYPES.MEMORY });
    }
  }
}

/**
 * Lấy dữ liệu từ storage
 * @param {string} key - Key để lấy dữ liệu
 * @param {Object} options - Các tùy chọn
 * @returns {any} - Giá trị đã lưu hoặc defaultValue nếu không tìm thấy
 */
function getItem(key, options = {}) {
  const {
    type = STORAGE_TYPES.LOCAL,
    defaultValue = null,
    prefix = KEY_PREFIX,
    parse = true
  } = options;
  
  const storage = getStorage(type);
  const prefixedKey = `${prefix}${key}`;
  
  try {
    // Lấy dữ liệu từ storage
    const item = storage.getItem(prefixedKey);
    
    // Nếu không có dữ liệu, trả về defaultValue
    if (item === null) {
      return defaultValue;
    }
    
    // Parse dữ liệu nếu cần
    const parsedItem = parse ? JSON.parse(item) : item;
    
    // Kiểm tra expiry nếu có
    if (parsedItem && parsedItem.expiry) {
      const now = Date.now();
      
      // Nếu đã hết hạn, xóa item và trả về defaultValue
      if (now > parsedItem.expiry) {
        removeItem(key, { type, prefix });
        return defaultValue;
      }
      
      // Nếu chưa hết hạn, trả về dữ liệu
      return parsedItem.data;
    }
    
    // Trả về dữ liệu
    return parsedItem;
  } catch (error) {
    console.error('Error getting item from storage:', error);
    
    // Fallback to memory storage
    if (type !== STORAGE_TYPES.MEMORY) {
      return getItem(key, { ...options, type: STORAGE_TYPES.MEMORY });
    }
    
    return defaultValue;
  }
}

/**
 * Xóa dữ liệu khỏi storage
 * @param {string} key - Key để xóa dữ liệu
 * @param {Object} options - Các tùy chọn
 * @returns {void}
 */
function removeItem(key, options = {}) {
  const {
    type = STORAGE_TYPES.LOCAL,
    prefix = KEY_PREFIX
  } = options;
  
  const storage = getStorage(type);
  const prefixedKey = `${prefix}${key}`;
  
  try {
    // Xóa dữ liệu khỏi storage
    storage.removeItem(prefixedKey);
    
    // Dispatch event để thông báo cho các tab khác
    if (!isServer && type !== STORAGE_TYPES.MEMORY) {
      const event = new CustomEvent('runout-storage', {
        detail: {
          key: prefixedKey,
          value: null,
          type,
          removed: true
        }
      });
      window.dispatchEvent(event);
    }
  } catch (error) {
    console.error('Error removing item from storage:', error);
  }
}

/**
 * Xóa tất cả dữ liệu có prefix trong storage
 * @param {Object} options - Các tùy chọn
 * @returns {void}
 */
function clear(options = {}) {
  const {
    type = STORAGE_TYPES.LOCAL,
    prefix = KEY_PREFIX
  } = options;
  
  const storage = getStorage(type);
  
  try {
    // Nếu prefix là KEY_PREFIX, xóa tất cả
    if (prefix === KEY_PREFIX) {
      storage.clear();
    } else {
      // Xóa các item có prefix cụ thể
      const keys = [];
      
      // Lấy tất cả keys có prefix
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key && key.startsWith(prefix)) {
          keys.push(key);
        }
      }
      
      // Xóa từng key
      keys.forEach(key => {
        storage.removeItem(key);
      });
    }
    
    // Dispatch event để thông báo cho các tab khác
    if (!isServer && type !== STORAGE_TYPES.MEMORY) {
      const event = new CustomEvent('runout-storage', {
        detail: {
          key: null,
          value: null,
          type,
          cleared: true,
          prefix
        }
      });
      window.dispatchEvent(event);
    }
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
}

/**
 * Lấy tất cả keys trong storage
 * @param {Object} options - Các tùy chọn
 * @returns {Array} - Mảng các keys
 */
function getAllKeys(options = {}) {
  const {
    type = STORAGE_TYPES.LOCAL,
    prefix = KEY_PREFIX
  } = options;
  
  const storage = getStorage(type);
  const keys = [];
  
  try {
    // Lấy tất cả keys có prefix
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key && key.startsWith(prefix)) {
        keys.push(key.replace(prefix, ''));
      }
    }
  } catch (error) {
    console.error('Error getting all keys from storage:', error);
  }
  
  return keys;
}

/**
 * Lấy tất cả items trong storage
 * @param {Object} options - Các tùy chọn
 * @returns {Object} - Object chứa tất cả items
 */
function getAllItems(options = {}) {
  const {
    type = STORAGE_TYPES.LOCAL,
    prefix = KEY_PREFIX,
    parse = true
  } = options;
  
  const keys = getAllKeys({ type, prefix });
  const items = {};
  
  // Lấy giá trị cho từng key
  keys.forEach(key => {
    items[key] = getItem(key, { type, prefix, parse });
  });
  
  return items;
}

/**
 * Hook để sử dụng localStorage
 * @param {string} key - Key để lưu dữ liệu
 * @param {any} initialValue - Giá trị ban đầu
 * @param {Object} options - Các tùy chọn
 * @returns {Array} - [value, setValue, removeValue]
 */
function useLocalStorage(key, initialValue, options = {}) {
  const [storedValue, setStoredValue] = useState(() => {
    // Lấy giá trị từ localStorage khi component mount
    return getItem(key, { ...options, type: STORAGE_TYPES.LOCAL, defaultValue: initialValue });
  });
  
  // Lắng nghe sự kiện thay đổi từ các tab khác
  useEffect(() => {
    if (isServer) return;
    
    const handleStorageChange = (event) => {
      if (event.detail && event.detail.type === STORAGE_TYPES.LOCAL) {
        const prefixedKey = `${options.prefix || KEY_PREFIX}${key}`;
        
        if (event.detail.key === prefixedKey) {
          if (event.detail.removed) {
            setStoredValue(initialValue);
          } else if (event.detail.value !== null) {
            try {
              const newValue = options.parse !== false ? JSON.parse(event.detail.value) : event.detail.value;
              
              // Kiểm tra expiry nếu có
              if (newValue && newValue.expiry) {
                const now = Date.now();
                
                if (now > newValue.expiry) {
                  setStoredValue(initialValue);
                } else {
                  setStoredValue(newValue.data);
                }
              } else {
                setStoredValue(newValue);
              }
            } catch (error) {
              console.error('Error parsing storage event value:', error);
            }
          }
        }
      }
    };
    
    window.addEventListener('runout-storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('runout-storage', handleStorageChange);
    };
  }, [key, initialValue, options]);
  
  // Hàm để cập nhật giá trị
  const setValue = useCallback((value) => {
    // Cập nhật state
    setStoredValue(value);
    
    // Cập nhật localStorage
    setItem(key, value, { ...options, type: STORAGE_TYPES.LOCAL });
  }, [key, options]);
  
  // Hàm để xóa giá trị
  const removeValue = useCallback(() => {
    // Cập nhật state
    setStoredValue(initialValue);
    
    // Xóa khỏi localStorage
    removeItem(key, { ...options, type: STORAGE_TYPES.LOCAL });
  }, [key, initialValue, options]);
  
  return [storedValue, setValue, removeValue];
}

/**
 * Hook để sử dụng sessionStorage
 * @param {string} key - Key để lưu dữ liệu
 * @param {any} initialValue - Giá trị ban đầu
 * @param {Object} options - Các tùy chọn
 * @returns {Array} - [value, setValue, removeValue]
 */
function useSessionStorage(key, initialValue, options = {}) {
  const [storedValue, setStoredValue] = useState(() => {
    // Lấy giá trị từ sessionStorage khi component mount
    return getItem(key, { ...options, type: STORAGE_TYPES.SESSION, defaultValue: initialValue });
  });
  
  // Lắng nghe sự kiện thay đổi từ các tab khác
  useEffect(() => {
    if (isServer) return;
    
    const handleStorageChange = (event) => {
      if (event.detail && event.detail.type === STORAGE_TYPES.SESSION) {
        const prefixedKey = `${options.prefix || KEY_PREFIX}${key}`;
        
        if (event.detail.key === prefixedKey) {
          if (event.detail.removed) {
            setStoredValue(initialValue);
          } else if (event.detail.value !== null) {
            try {
              const newValue = options.parse !== false ? JSON.parse(event.detail.value) : event.detail.value;
              
              // Kiểm tra expiry nếu có
              if (newValue && newValue.expiry) {
                const now = Date.now();
                
                if (now > newValue.expiry) {
                  setStoredValue(initialValue);
                } else {
                  setStoredValue(newValue.data);
                }
              } else {
                setStoredValue(newValue);
              }
            } catch (error) {
              console.error('Error parsing storage event value:', error);
            }
          }
        }
      }
    };
    
    window.addEventListener('runout-storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('runout-storage', handleStorageChange);
    };
  }, [key, initialValue, options]);
  
  // Hàm để cập nhật giá trị
  const setValue = useCallback((value) => {
    // Cập nhật state
    setStoredValue(value);
    
    // Cập nhật sessionStorage
    setItem(key, value, { ...options, type: STORAGE_TYPES.SESSION });
  }, [key, options]);
  
  // Hàm để xóa giá trị
  const removeValue = useCallback(() => {
    // Cập nhật state
    setStoredValue(initialValue);
    
    // Xóa khỏi sessionStorage
    removeItem(key, { ...options, type: STORAGE_TYPES.SESSION });
  }, [key, initialValue, options]);
  
  return [storedValue, setValue, removeValue];
}

/**
 * Hook để sử dụng memory storage
 * @param {string} key - Key để lưu dữ liệu
 * @param {any} initialValue - Giá trị ban đầu
 * @param {Object} options - Các tùy chọn
 * @returns {Array} - [value, setValue, removeValue]
 */
function useMemoryStorage(key, initialValue, options = {}) {
  const [storedValue, setStoredValue] = useState(() => {
    // Lấy giá trị từ memory storage khi component mount
    return getItem(key, { ...options, type: STORAGE_TYPES.MEMORY, defaultValue: initialValue });
  });
  
  // Hàm để cập nhật giá trị
  const setValue = useCallback((value) => {
    // Cập nhật state
    setStoredValue(value);
    
    // Cập nhật memory storage
    setItem(key, value, { ...options, type: STORAGE_TYPES.MEMORY });
  }, [key, options]);
  
  // Hàm để xóa giá trị
  const removeValue = useCallback(() => {
    // Cập nhật state
    setStoredValue(initialValue);
    
    // Xóa khỏi memory storage
    removeItem(key, { ...options, type: STORAGE_TYPES.MEMORY });
  }, [key, initialValue, options]);
  
  return [storedValue, setValue, removeValue];
}

/**
 * Redux Storage Adapter - Sử dụng cho giao diện User
 */
export class ReduxStorageAdapter {
  /**
   * Tạo các action types cho Redux
   * @returns {Object} - Các action types
   */
  static getActionTypes() {
    return {
      SET_ITEM: 'STORAGE_SET_ITEM',
      REMOVE_ITEM: 'STORAGE_REMOVE_ITEM',
      CLEAR: 'STORAGE_CLEAR'
    };
  }

  /**
   * Tạo các action creators cho Redux
   * @returns {Object} - Các action creators
   */
  static getActionCreators() {
    const actionTypes = this.getActionTypes();
    
    return {
      setItem: (key, value, options = {}) => ({
        type: actionTypes.SET_ITEM,
        payload: { key, value, options }
      }),
      
      removeItem: (key, options = {}) => ({
        type: actionTypes.REMOVE_ITEM,
        payload: { key, options }
      }),
      
      clear: (options = {}) => ({
        type: actionTypes.CLEAR,
        payload: { options }
      })
    };
  }

  /**
   * Tạo middleware cho Redux
   * @returns {Function} - Redux middleware
   */
  static createMiddleware() {
    const actionTypes = this.getActionTypes();
    
    return store => next => action => {
      const result = next(action);
      
      // Xử lý các action liên quan đến storage
      switch (action.type) {
        case actionTypes.SET_ITEM:
          const { key, value, options } = action.payload;
          setItem(key, value, options);
          break;
          
        case actionTypes.REMOVE_ITEM:
          removeItem(action.payload.key, action.payload.options);
          break;
          
        case actionTypes.CLEAR:
          clear(action.payload.options);
          break;
      }
      
      return result;
    };
  }
}

/**
 * Context API Storage Adapter - Sử dụng cho giao diện Client
 */
export class ContextStorageAdapter {
  /**
   * Tạo Context cho storage
   * @returns {React.Context} - Storage Context
   */
  static createContext() {
    return React.createContext({
      setItem: () => {},
      getItem: () => {},
      removeItem: () => {},
      clear: () => {},
      getAllKeys: () => [],
      getAllItems: () => ({}),
      useLocalStorage: () => [null, () => {}, () => {}],
      useSessionStorage: () => [null, () => {}, () => {}],
      useMemoryStorage: () => [null, () => {}, () => {}]
    });
  }

  /**
   * Tạo Provider cho storage context
   * @param {React.Context} StorageContext - Storage context
   * @returns {Function} - Provider component
   */
  static createProvider(StorageContext) {
    return ({ children }) => {
      // Context value
      const value = {
        setItem,
        getItem,
        removeItem,
        clear,
        getAllKeys,
        getAllItems,
        useLocalStorage,
        useSessionStorage,
        useMemoryStorage
      };
      
      return (
        <StorageContext.Provider value={value}>
          {children}
        </StorageContext.Provider>
      );
    };
  }

  /**
   * Tạo hook để sử dụng storage
   * @param {React.Context} StorageContext - Storage context
   * @returns {Function} - Hook function
   */
  static createHook(StorageContext) {
    return () => React.useContext(StorageContext);
  }
}

/**
 * Storage Adapter - Sử dụng cho cả hai giao diện
 */
export default {
  // Các constants
  STORAGE_TYPES,
  KEY_PREFIX,
  
  // Các phương thức chính
  setItem,
  getItem,
  removeItem,
  clear,
  getAllKeys,
  getAllItems,
  
  // Các hooks
  useLocalStorage,
  useSessionStorage,
  useMemoryStorage,
  
  // Các utility functions
  isStorageAvailable,
  
  // Adapter classes
  ReduxStorageAdapter,
  ContextStorageAdapter
};