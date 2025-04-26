/**
 * Authentication Adapter
 * 
 * Lớp adapter này giúp đồng bộ hóa hệ thống xác thực giữa giao diện User (Redux) và Client (Context API)
 * Cung cấp interface thống nhất để quản lý xác thực trong cả hai giao diện
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApiService from './apiAdapter';
import StorageAdapter from './storageAdapter';
import { useAdaptiveNavigate } from './routeAdapter';
import jwtDecode from 'jwt-decode'; // Giả sử đã cài đặt jwt-decode

// Kiểm tra môi trường hiện tại
const isClientInterface = process.env.REACT_APP_INTERFACE === 'client';

// Các action types cho auth reducer
const AUTH_ACTION_TYPES = {
  LOGIN_REQUEST: 'AUTH_LOGIN_REQUEST',
  LOGIN_SUCCESS: 'AUTH_LOGIN_SUCCESS',
  LOGIN_FAILURE: 'AUTH_LOGIN_FAILURE',
  LOGOUT: 'AUTH_LOGOUT',
  REFRESH_TOKEN: 'AUTH_REFRESH_TOKEN',
  UPDATE_PROFILE: 'AUTH_UPDATE_PROFILE'
};

// Các key cho storage
const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'auth_user'
};

/**
 * Auth Service - Cung cấp các phương thức quản lý xác thực
 */
class AuthService {
  /**
   * Đăng nhập người dùng
   * @param {Object} credentials - Thông tin đăng nhập
   * @returns {Promise} - Promise với kết quả đăng nhập
   */
  static async login(credentials) {
    try {
      const response = await ApiService.post('/auth/login', credentials);
      
      // Lưu token và thông tin người dùng
      this.setAuthData(response);
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Đăng xuất người dùng
   */
  static async logout() {
    try {
      // Gọi API đăng xuất nếu cần
      const token = this.getToken();
      if (token) {
        await ApiService.post('/auth/logout', { token });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Xóa dữ liệu xác thực
      this.clearAuthData();
    }
  }

  /**
   * Đăng ký người dùng mới
   * @param {Object} userData - Thông tin người dùng
   * @returns {Promise} - Promise với kết quả đăng ký
   */
  static async register(userData) {
    try {
      const response = await ApiService.post('/auth/register', userData);
      
      // Lưu token và thông tin người dùng nếu API trả về
      if (response.token) {
        this.setAuthData(response);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Làm mới token
   * @returns {Promise} - Promise với token mới
   */
  static async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await ApiService.post('/auth/refresh-token', { refreshToken });
      
      // Lưu token mới
      this.setAuthData(response);
      
      return response;
    } catch (error) {
      // Nếu không thể làm mới token, đăng xuất người dùng
      this.clearAuthData();
      throw error;
    }
  }

  /**
   * Cập nhật thông tin người dùng
   * @param {Object} userData - Thông tin người dùng mới
   * @returns {Promise} - Promise với thông tin người dùng đã cập nhật
   */
  static async updateProfile(userData) {
    try {
      const response = await ApiService.put('/users/profile', userData);
      
      // Cập nhật thông tin người dùng trong storage
      const currentUser = this.getCurrentUser();
      const updatedUser = { ...currentUser, ...response };
      
      StorageAdapter.setItem(STORAGE_KEYS.USER, updatedUser);
      
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Thay đổi mật khẩu
   * @param {Object} passwordData - Dữ liệu mật khẩu
   * @returns {Promise} - Promise với kết quả thay đổi mật khẩu
   */
  static async changePassword(passwordData) {
    try {
      return await ApiService.put('/users/change-password', passwordData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Yêu cầu đặt lại mật khẩu
   * @param {string} email - Email người dùng
   * @returns {Promise} - Promise với kết quả yêu cầu
   */
  static async requestPasswordReset(email) {
    try {
      return await ApiService.post('/auth/forgot-password', { email });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Đặt lại mật khẩu
   * @param {Object} resetData - Dữ liệu đặt lại mật khẩu
   * @returns {Promise} - Promise với kết quả đặt lại mật khẩu
   */
  static async resetPassword(resetData) {
    try {
      return await ApiService.post('/auth/reset-password', resetData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Kiểm tra trạng thái xác thực
   * @returns {boolean} - true nếu đã xác thực, false nếu chưa
   */
  static isAuthenticated() {
    const token = this.getToken();
    
    if (!token) {
      return false;
    }
    
    try {
      // Kiểm tra token có hết hạn không
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  /**
   * Lấy thông tin người dùng hiện tại
   * @returns {Object|null} - Thông tin người dùng hoặc null nếu chưa đăng nhập
   */
  static getCurrentUser() {
    return StorageAdapter.getItem(STORAGE_KEYS.USER);
  }

  /**
   * Lấy token hiện tại
   * @returns {string|null} - Token hoặc null nếu chưa đăng nhập
   */
  static getToken() {
    return StorageAdapter.getItem(STORAGE_KEYS.TOKEN);
  }

  /**
   * Lấy refresh token hiện tại
   * @returns {string|null} - Refresh token hoặc null nếu chưa đăng nhập
   */
  static getRefreshToken() {
    return StorageAdapter.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Lưu dữ liệu xác thực
   * @param {Object} authData - Dữ liệu xác thực
   */
  static setAuthData(authData) {
    const { token, refreshToken, user } = authData;
    
    if (token) {
      StorageAdapter.setItem(STORAGE_KEYS.TOKEN, token);
    }
    
    if (refreshToken) {
      StorageAdapter.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
    
    if (user) {
      StorageAdapter.setItem(STORAGE_KEYS.USER, user);
    }
  }

  /**
   * Xóa dữ liệu xác thực
   */
  static clearAuthData() {
    StorageAdapter.removeItem(STORAGE_KEYS.TOKEN);
    StorageAdapter.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    StorageAdapter.removeItem(STORAGE_KEYS.USER);
  }

  /**
   * Kiểm tra quyền của người dùng
   * @param {string|Array} requiredRole - Quyền yêu cầu
   * @returns {boolean} - true nếu có quyền, false nếu không
   */
  static hasRole(requiredRole) {
    const user = this.getCurrentUser();
    
    if (!user || !user.roles) {
      return false;
    }
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.some(role => user.roles.includes(role));
    }
    
    return user.roles.includes(requiredRole);
  }

  /**
   * Kiểm tra quyền admin
   * @returns {boolean} - true nếu là admin, false nếu không
   */
  static isAdmin() {
    return this.hasRole('admin');
  }
}

/**
 * Auth Reducer - Xử lý các action liên quan đến xác thực
 * @param {Object} state - State hiện tại
 * @param {Object} action - Action được dispatch
 * @returns {Object} - State mới
 */
function authReducer(state = {
  isAuthenticated: AuthService.isAuthenticated(),
  user: AuthService.getCurrentUser(),
  loading: false,
  error: null
}, action) {
  switch (action.type) {
    case AUTH_ACTION_TYPES.LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
      
    case AUTH_ACTION_TYPES.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        loading: false,
        error: null
      };
      
    case AUTH_ACTION_TYPES.LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: action.payload
      };
      
    case AUTH_ACTION_TYPES.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      };
      
    case AUTH_ACTION_TYPES.REFRESH_TOKEN:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        error: null
      };
      
    case AUTH_ACTION_TYPES.UPDATE_PROFILE:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      };
      
    default:
      return state;
  }
}

/**
 * Redux Auth Adapter - Sử dụng cho giao diện User
 */
export class ReduxAuthAdapter {
  /**
   * Tạo các action creators cho Redux
   * @returns {Object} - Các action creators
   */
  static getActionCreators() {
    return {
      loginRequest: () => ({
        type: AUTH_ACTION_TYPES.LOGIN_REQUEST
      }),
      
      loginSuccess: (data) => ({
        type: AUTH_ACTION_TYPES.LOGIN_SUCCESS,
        payload: data
      }),
      
      loginFailure: (error) => ({
        type: AUTH_ACTION_TYPES.LOGIN_FAILURE,
        payload: error
      }),
      
      logout: () => ({
        type: AUTH_ACTION_TYPES.LOGOUT
      }),
      
      refreshToken: (data) => ({
        type: AUTH_ACTION_TYPES.REFRESH_TOKEN,
        payload: data
      }),
      
      updateProfile: (data) => ({
        type: AUTH_ACTION_TYPES.UPDATE_PROFILE,
        payload: data
      })
    };
  }

  /**
   * Tạo các thunk actions cho Redux
   * @returns {Object} - Các thunk actions
   */
  static getThunkActions() {
    const actions = this.getActionCreators();
    
    return {
      login: (credentials) => async (dispatch) => {
        dispatch(actions.loginRequest());
        
        try {
          const response = await AuthService.login(credentials);
          dispatch(actions.loginSuccess(response));
          return response;
        } catch (error) {
          dispatch(actions.loginFailure(error));
          throw error;
        }
      },
      
      logout: () => async (dispatch) => {
        await AuthService.logout();
        dispatch(actions.logout());
      },
      
      register: (userData) => async (dispatch) => {
        dispatch(actions.loginRequest());
        
        try {
          const response = await AuthService.register(userData);
          
          if (response.token) {
            dispatch(actions.loginSuccess(response));
          }
          
          return response;
        } catch (error) {
          dispatch(actions.loginFailure(error));
          throw error;
        }
      },
      
      refreshToken: () => async (dispatch) => {
        try {
          const response = await AuthService.refreshToken();
          dispatch(actions.refreshToken(response));
          return response;
        } catch (error) {
          dispatch(actions.logout());
          throw error;
        }
      },
      
      updateProfile: (userData) => async (dispatch) => {
        try {
          const updatedUser = await AuthService.updateProfile(userData);
          dispatch(actions.updateProfile(updatedUser));
          return updatedUser;
        } catch (error) {
          throw error;
        }
      },
      
      changePassword: (passwordData) => async () => {
        return await AuthService.changePassword(passwordData);
      },
      
      requestPasswordReset: (email) => async () => {
        return await AuthService.requestPasswordReset(email);
      },
      
      resetPassword: (resetData) => async () => {
        return await AuthService.resetPassword(resetData);
      }
    };
  }

  /**
   * Tạo reducer cho Redux
   * @returns {Function} - Reducer function
   */
  static createReducer() {
    return authReducer;
  }

  /**
   * Tạo các selectors cho Redux
   * @returns {Object} - Các selectors
   */
  static getSelectors() {
    return {
      isAuthenticated: (state) => state.auth.isAuthenticated,
      getCurrentUser: (state) => state.auth.user,
      getAuthLoading: (state) => state.auth.loading,
      getAuthError: (state) => state.auth.error,
      hasRole: (state, role) => {
        const user = state.auth.user;
        if (!user || !user.roles) return false;
        
        if (Array.isArray(role)) {
          return role.some(r => user.roles.includes(r));
        }
        
        return user.roles.includes(role);
      },
      isAdmin: (state) => {
        const user = state.auth.user;
        return user && user.roles && user.roles.includes('admin');
      }
    };
  }
}

/**
 * Context API Auth Adapter - Sử dụng cho giao diện Client
 */
export class ContextAuthAdapter {
  /**
   * Tạo Context cho auth
   * @returns {React.Context} - Auth Context
   */
  static createContext() {
    return createContext({
      isAuthenticated: AuthService.isAuthenticated(),
      user: AuthService.getCurrentUser(),
      loading: false,
      error: null,
      login: () => {},
      logout: () => {},
      register: () => {},
      refreshToken: () => {},
      updateProfile: () => {},
      changePassword: () => {},
      requestPasswordReset: () => {},
      resetPassword: () => {},
      hasRole: () => {},
      isAdmin: () => {}
    });
  }

  /**
   * Tạo Provider cho auth context
   * @param {React.Context} AuthContext - Auth context
   * @returns {Function} - Provider component
   */
  static createProvider(AuthContext) {
    return ({ children }) => {
      const [state, dispatch] = useReducer(authReducer, {
        isAuthenticated: AuthService.isAuthenticated(),
        user: AuthService.getCurrentUser(),
        loading: false,
        error: null
      });
      
      const navigate = useAdaptiveNavigate();
      
      // Login
      const login = async (credentials) => {
        dispatch({ type: AUTH_ACTION_TYPES.LOGIN_REQUEST });
        
        try {
          const response = await AuthService.login(credentials);
          dispatch({ type: AUTH_ACTION_TYPES.LOGIN_SUCCESS, payload: response });
          return response;
        } catch (error) {
          dispatch({ type: AUTH_ACTION_TYPES.LOGIN_FAILURE, payload: error });
          throw error;
        }
      };
      
      // Logout
      const logout = async () => {
        await AuthService.logout();
        dispatch({ type: AUTH_ACTION_TYPES.LOGOUT });
        navigate('/login');
      };
      
      // Register
      const register = async (userData) => {
        dispatch({ type: AUTH_ACTION_TYPES.LOGIN_REQUEST });
        
        try {
          const response = await AuthService.register(userData);
          
          if (response.token) {
            dispatch({ type: AUTH_ACTION_TYPES.LOGIN_SUCCESS, payload: response });
          }
          
          return response;
        } catch (error) {
          dispatch({ type: AUTH_ACTION_TYPES.LOGIN_FAILURE, payload: error });
          throw error;
        }
      };
      
      // Refresh token
      const refreshToken = async () => {
        try {
          const response = await AuthService.refreshToken();
          dispatch({ type: AUTH_ACTION_TYPES.REFRESH_TOKEN, payload: response });
          return response;
        } catch (error) {
          dispatch({ type: AUTH_ACTION_TYPES.LOGOUT });
          navigate('/login');
          throw error;
        }
      };
      
      // Update profile
      const updateProfile = async (userData) => {
        try {
          const updatedUser = await AuthService.updateProfile(userData);
          dispatch({ type: AUTH_ACTION_TYPES.UPDATE_PROFILE, payload: updatedUser });
          return updatedUser;
        } catch (error) {
          throw error;
        }
      };
      
      // Change password
      const changePassword = async (passwordData) => {
        return await AuthService.changePassword(passwordData);
      };
      
      // Request password reset
      const requestPasswordReset = async (email) => {
        return await AuthService.requestPasswordReset(email);
      };
      
      // Reset password
      const resetPassword = async (resetData) => {
        return await AuthService.resetPassword(resetData);
      };
      
      // Check role
      const hasRole = (role) => {
        const { user } = state;
        if (!user || !user.roles) return false;
        
        if (Array.isArray(role)) {
          return role.some(r => user.roles.includes(r));
        }
        
        return user.roles.includes(role);
      };
      
      // Check admin
      const isAdmin = () => {
        return hasRole('admin');
      };
      
      // Kiểm tra token hết hạn khi component mount
      useEffect(() => {
        if (state.isAuthenticated) {
          const token = AuthService.getToken();
          
          if (token) {
            try {
              const decoded = jwtDecode(token);
              const currentTime = Date.now() / 1000;
              
              // Nếu token sắp hết hạn (còn 5 phút), làm mới token
              if (decoded.exp - currentTime < 300) {
                refreshToken().catch(() => {});
              }
            } catch (error) {
              logout();
            }
          } else {
            logout();
          }
        }
      }, []);
      
      // Context value
      const value = {
        ...state,
        login,
        logout,
        register,
        refreshToken,
        updateProfile,
        changePassword,
        requestPasswordReset,
        resetPassword,
        hasRole,
        isAdmin
      };
      
      return (
        <AuthContext.Provider value={value}>
          {children}
        </AuthContext.Provider>
      );
    };
  }

  /**
   * Tạo hook để sử dụng auth
   * @param {React.Context} AuthContext - Auth context
   * @returns {Function} - Hook function
   */
  static createHook(AuthContext) {
    return () => useContext(AuthContext);
  }
}

/**
 * Hook để sử dụng auth trong cả hai giao diện
 * @returns {Object} - Auth state và methods
 */
export function useAuth() {
  if (isClientInterface) {
    // Client interface sử dụng Context API
    const AuthContext = React.createContext();
    return useContext(AuthContext);
  } else {
    // User interface sử dụng Redux
    const dispatch = useDispatch();
    const thunkActions = ReduxAuthAdapter.getThunkActions();
    const selectors = ReduxAuthAdapter.getSelectors();
    
    const isAuthenticated = useSelector(selectors.isAuthenticated);
    const user = useSelector(selectors.getCurrentUser);
    const loading = useSelector(selectors.getAuthLoading);
    const error = useSelector(selectors.getAuthError);
    
    return {
      isAuthenticated,
      user,
      loading,
      error,
      login: (credentials) => dispatch(thunkActions.login(credentials)),
      logout: () => dispatch(thunkActions.logout()),
      register: (userData) => dispatch(thunkActions.register(userData)),
      refreshToken: () => dispatch(thunkActions.refreshToken()),
      updateProfile: (userData) => dispatch(thunkActions.updateProfile(userData)),
      changePassword: (passwordData) => dispatch(thunkActions.changePassword(passwordData)),
      requestPasswordReset: (email) => dispatch(thunkActions.requestPasswordReset(email)),
      resetPassword: (resetData) => dispatch(thunkActions.resetPassword(resetData)),
      hasRole: (role) => selectors.hasRole(useSelector(state => state), role),
      isAdmin: () => selectors.isAdmin(useSelector(state => state))
    };
  }
}

/**
 * HOC để bảo vệ route yêu cầu xác thực
 * @param {React.Component} Component - Component cần bảo vệ
 * @param {Object} options - Các tùy chọn
 * @returns {React.Component} - Protected component
 */
export function withAuth(Component, options = {}) {
  return (props) => {
    const auth = useAuth();
    
    return <Component {...props} auth={auth} />;
  };
}

/**
 * HOC để bảo vệ route yêu cầu quyền admin
 * @param {React.Component} Component - Component cần bảo vệ
 * @returns {React.Component} - Protected component
 */
export function withAdmin(Component) {
  return (props) => {
    const auth = useAuth();
    const navigate = useAdaptiveNavigate();
    
    useEffect(() => {
      if (!auth.isAuthenticated) {
        navigate('/login');
      } else if (!auth.isAdmin()) {
        navigate('/403');
      }
    }, [auth.isAuthenticated, navigate]);
    
    if (!auth.isAuthenticated || !auth.isAdmin()) {
      return null;
    }
    
    return <Component {...props} auth={auth} />;
  };
}

/**
 * Authentication Adapter - Sử dụng cho cả hai giao diện
 */
export default {
  // Service methods
  login: AuthService.login.bind(AuthService),
  logout: AuthService.logout.bind(AuthService),
  register: AuthService.register.bind(AuthService),
  refreshToken: AuthService.refreshToken.bind(AuthService),
  updateProfile: AuthService.updateProfile.bind(AuthService),
  changePassword: AuthService.changePassword.bind(AuthService),
  requestPasswordReset: AuthService.requestPasswordReset.bind(AuthService),
  resetPassword: AuthService.resetPassword.bind(AuthService),
  isAuthenticated: AuthService.isAuthenticated.bind(AuthService),
  getCurrentUser: AuthService.getCurrentUser.bind(AuthService),
  getToken: AuthService.getToken.bind(AuthService),
  hasRole: AuthService.hasRole.bind(AuthService),
  isAdmin: AuthService.isAdmin.bind(AuthService),
  
  // Hooks and HOCs
  useAuth,
  withAuth,
  withAdmin,
  
  // Adapter classes
  ReduxAuthAdapter,
  ContextAuthAdapter
};