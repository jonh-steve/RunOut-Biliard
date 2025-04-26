/**
 * State Management Adapter
 * 
 * Lớp adapter này giúp đồng bộ hóa state management giữa Redux (User) và Context API (Client)
 * Cung cấp interface thống nhất để truy cập và cập nhật state từ cả hai giao diện
 */

import { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

/**
 * Hook để truy cập state từ cả Redux và Context API
 * @param {string} reduxSelector - Selector function hoặc path để truy cập Redux state
 * @param {Object} context - React Context để truy cập Context state
 * @param {string|Function} contextSelector - Selector function hoặc path để truy cập Context state
 * @returns {Array} - [state, setState] tương tự như useState
 */
export function useAdaptiveState(reduxSelector, context, contextSelector) {
  // Kiểm tra môi trường hiện tại (User hoặc Client)
  const isClientInterface = process.env.REACT_APP_INTERFACE === 'client';
  
  // Truy cập state từ Redux (cho User interface)
  const reduxState = useSelector(
    typeof reduxSelector === 'function' 
      ? reduxSelector 
      : (state) => {
          // Hỗ trợ truy cập bằng string path (e.g., 'auth.user.name')
          return reduxSelector.split('.').reduce(
            (obj, key) => (obj && obj[key] !== undefined ? obj[key] : undefined),
            state
          );
        }
  );
  
  // Truy cập state từ Context (cho Client interface)
  const contextValue = context ? useContext(context) : null;
  const contextState = contextValue && contextSelector ? (
    typeof contextSelector === 'function'
      ? contextSelector(contextValue)
      : contextSelector.split('.').reduce(
          (obj, key) => (obj && obj[key] !== undefined ? obj[key] : undefined),
          contextValue
        )
  ) : null;
  
  // Sử dụng state phù hợp với môi trường
  const state = isClientInterface ? contextState : reduxState;
  
  // Dispatch function cho Redux
  const dispatch = useDispatch();
  
  // Hàm setState tương thích với cả hai môi trường
  const setState = (action) => {
    if (isClientInterface) {
      // Gọi setter function từ context nếu có
      if (contextValue && contextValue.setters && typeof contextSelector === 'string') {
        const setterName = `set${contextSelector.charAt(0).toUpperCase() + contextSelector.slice(1)}`;
        if (typeof contextValue.setters[setterName] === 'function') {
          contextValue.setters[setterName](
            typeof action === 'function' ? action(contextState) : action
          );
          return;
        }
      }
      
      // Fallback: Gọi update function chung nếu có
      if (contextValue && typeof contextValue.update === 'function') {
        contextValue.update(contextSelector, 
          typeof action === 'function' ? action(contextState) : action
        );
      }
    } else {
      // Dispatch action cho Redux
      if (typeof action === 'object' && action.type) {
        dispatch(action);
      } else if (typeof action === 'function') {
        // Thunk-like behavior
        dispatch((dispatch, getState) => {
          const currentState = reduxSelector(getState());
          const newState = action(currentState);
          // Cần có action creator tương ứng
          dispatch({ type: 'UPDATE_STATE', payload: { path: reduxSelector, value: newState } });
        });
      } else {
        // Simple value update
        dispatch({ type: 'UPDATE_STATE', payload: { path: reduxSelector, value: action } });
      }
    }
  };
  
  return [state, setState];
}

/**
 * Hook để truy cập và cập nhật user state
 * @param {Object} AuthContext - Context API cho authentication (Client interface)
 * @returns {Object} - { user, isAuthenticated, login, logout, updateProfile }
 */
export function useAuth(AuthContext = null) {
  const isClientInterface = process.env.REACT_APP_INTERFACE === 'client';
  
  if (isClientInterface && AuthContext) {
    // Client interface với Context API
    const authContext = useContext(AuthContext);
    
    return {
      user: authContext.user,
      isAuthenticated: !!authContext.user,
      login: authContext.login,
      logout: authContext.logout,
      updateProfile: authContext.updateProfile
    };
  } else {
    // User interface với Redux
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    
    return {
      user,
      isAuthenticated: !!user,
      login: (credentials) => dispatch({ type: 'LOGIN_REQUEST', payload: credentials }),
      logout: () => dispatch({ type: 'LOGOUT_REQUEST' }),
      updateProfile: (data) => dispatch({ type: 'UPDATE_PROFILE_REQUEST', payload: data })
    };
  }
}

/**
 * Hook để truy cập và cập nhật notification state
 * @param {Object} NotificationContext - Context API cho notifications (Client interface)
 * @returns {Object} - { notifications, addNotification, removeNotification, clearNotifications }
 */
export function useNotifications(NotificationContext = null) {
  const isClientInterface = process.env.REACT_APP_INTERFACE === 'client';
  
  if (isClientInterface && NotificationContext) {
    // Client interface với Context API
    const notificationContext = useContext(NotificationContext);
    
    return {
      notifications: notificationContext.notifications,
      addNotification: notificationContext.addNotification,
      removeNotification: notificationContext.removeNotification,
      clearNotifications: notificationContext.clearNotifications
    };
  } else {
    // User interface với Redux
    const dispatch = useDispatch();
    const notifications = useSelector(state => state.notifications.items);
    
    return {
      notifications,
      addNotification: (notification) => 
        dispatch({ type: 'ADD_NOTIFICATION', payload: notification }),
      removeNotification: (id) => 
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: id }),
      clearNotifications: () => 
        dispatch({ type: 'CLEAR_NOTIFICATIONS' })
    };
  }
}

/**
 * Hook để truy cập v�� cập nhật loading state
 * @param {Object} LoadingContext - Context API cho loading state (Client interface)
 * @returns {Object} - { isLoading, startLoading, stopLoading }
 */
export function useLoading(LoadingContext = null) {
  const isClientInterface = process.env.REACT_APP_INTERFACE === 'client';
  
  if (isClientInterface && LoadingContext) {
    // Client interface với Context API
    const loadingContext = useContext(LoadingContext);
    
    return {
      isLoading: loadingContext.isLoading,
      startLoading: loadingContext.startLoading,
      stopLoading: loadingContext.stopLoading
    };
  } else {
    // User interface với Redux
    const dispatch = useDispatch();
    const isLoading = useSelector(state => state.ui.loading);
    
    return {
      isLoading,
      startLoading: () => dispatch({ type: 'START_LOADING' }),
      stopLoading: () => dispatch({ type: 'STOP_LOADING' })
    };
  }
}

/**
 * Hàm tạo Context Provider với state management tương thích Redux
 * @param {React.Context} Context - Context object
 * @param {Object} initialState - State ban đầu
 * @param {Object} reducers - Các reducer functions
 * @returns {Function} - Provider component
 */
export function createCompatibleProvider(Context, initialState, reducers) {
  return ({ children }) => {
    const [state, setState] = useState(initialState);
    
    // Tạo dispatch function tương tự Redux
    const dispatch = (action) => {
      if (typeof action === 'function') {
        // Thunk-like behavior
        action(dispatch, () => state);
        return;
      }
      
      const { type, payload } = action;
      if (reducers[type]) {
        const newState = reducers[type](state, payload);
        setState(newState);
      }
    };
    
    // Tạo các setter functions cho từng property
    const setters = {};
    Object.keys(initialState).forEach(key => {
      const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
      setters[`set${capitalizedKey}`] = (value) => {
        setState(prevState => ({
          ...prevState,
          [key]: value
        }));
      };
    });
    
    // Hàm update chung
    const update = (path, value) => {
      if (typeof path === 'string') {
        const keys = path.split('.');
        setState(prevState => {
          const newState = { ...prevState };
          let current = newState;
          for (let i = 0; i < keys.length - 1; i++) {
            current[keys[i]] = { ...current[keys[i]] };
            current = current[keys[i]];
          }
          current[keys[keys.length - 1]] = value;
          return newState;
        });
      }
    };
    
    return (
      <Context.Provider value={{ ...state, dispatch, setters, update }}>
        {children}
      </Context.Provider>
    );
  };
}

export default {
  useAdaptiveState,
  useAuth,
  useNotifications,
  useLoading,
  createCompatibleProvider
};