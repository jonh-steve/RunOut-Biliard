/**
 * API Adapter
 * 
 * Lớp adapter này giúp đồng bộ hóa việc gọi API giữa giao diện User và Client
 * Cung cấp interface thống nhất để gọi API trong cả hai giao diện
 */

import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import ErrorHandlingAdapter from './errorHandlingAdapter';
import StorageAdapter from './storageAdapter';

// Kiểm tra môi trường hiện tại
const isClientInterface = process.env.REACT_APP_INTERFACE === 'client';
const isServer = typeof window === 'undefined';

// Cấu hình mặc định
const DEFAULT_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'https://api.runout.com/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Key lưu trữ token trong storage
const TOKEN_STORAGE_KEY = 'auth_token';

/**
 * Tạo instance axios với cấu hình mặc định
 * @param {Object} config - Cấu hình cho axios
 * @returns {Object} - Instance axios
 */
function createAxiosInstance(config = {}) {
  const instance = axios.create({
    ...DEFAULT_CONFIG,
    ...config
  });
  
  // Thêm interceptor request
  instance.interceptors.request.use(
    (config) => {
      // Thêm token vào header nếu có
      const token = StorageAdapter.getItem(TOKEN_STORAGE_KEY);
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  // Thêm interceptor response
  instance.interceptors.response.use(
    (response) => {
      // Xử lý response thành công
      return response.data;
    },
    (error) => {
      // Xử lý response lỗi
      if (error.response) {
        // Nếu token hết hạn (401), thử refresh token
        if (error.response.status === 401) {
          // Xử lý refresh token sẽ được thực hiện trong AuthAdapter
          // Ở đây chỉ reject error để AuthAdapter xử lý
        }
      }
      
      return Promise.reject(error);
    }
  );
  
  return instance;
}

// Tạo instance axios mặc định
const axiosInstance = createAxiosInstance();

/**
 * Thực hiện request GET
 * @param {string} url - URL endpoint
 * @param {Object} params - Query params
 * @param {Object} config - Cấu hình cho axios
 * @returns {Promise} - Promise với kết quả request
 */
function get(url, params = {}, config = {}) {
  return axiosInstance.get(url, { ...config, params });
}

/**
 * Thực hiện request POST
 * @param {string} url - URL endpoint
 * @param {Object} data - Body data
 * @param {Object} config - Cấu hình cho axios
 * @returns {Promise} - Promise với kết quả request
 */
function post(url, data = {}, config = {}) {
  return axiosInstance.post(url, data, config);
}

/**
 * Thực hiện request PUT
 * @param {string} url - URL endpoint
 * @param {Object} data - Body data
 * @param {Object} config - Cấu hình cho axios
 * @returns {Promise} - Promise với kết quả request
 */
function put(url, data = {}, config = {}) {
  return axiosInstance.put(url, data, config);
}

/**
 * Thực hiện request PATCH
 * @param {string} url - URL endpoint
 * @param {Object} data - Body data
 * @param {Object} config - Cấu hình cho axios
 * @returns {Promise} - Promise với kết quả request
 */
function patch(url, data = {}, config = {}) {
  return axiosInstance.patch(url, data, config);
}

/**
 * Thực hiện request DELETE
 * @param {string} url - URL endpoint
 * @param {Object} config - Cấu hình cho axios
 * @returns {Promise} - Promise với kết quả request
 */
function del(url, config = {}) {
  return axiosInstance.delete(url, config);
}

/**
 * Thực hiện nhiều requests đồng thời
 * @param {Array} requests - Mảng các requests
 * @returns {Promise} - Promise với kết quả của tất cả requests
 */
function all(requests) {
  return axios.all(requests);
}

/**
 * Tạo một cancel token
 * @returns {Object} - Cancel token source
 */
function createCancelToken() {
  return axios.CancelToken.source();
}

/**
 * Kiểm tra xem request có bị cancel không
 * @param {Error} error - Lỗi từ axios
 * @returns {boolean} - true nếu request bị cancel, false nếu không
 */
function isCancel(error) {
  return axios.isCancel(error);
}

/**
 * Tạo API service cho một resource
 * @param {string} baseUrl - Base URL cho resource
 * @returns {Object} - API service
 */
function createApiService(baseUrl) {
  return {
    getAll: (params) => get(baseUrl, params),
    getById: (id) => get(`${baseUrl}/${id}`),
    create: (data) => post(baseUrl, data),
    update: (id, data) => put(`${baseUrl}/${id}`, data),
    patch: (id, data) => patch(`${baseUrl}/${id}`, data),
    remove: (id) => del(`${baseUrl}/${id}`),
    custom: (method, path, data, config) => {
      const url = path ? `${baseUrl}/${path}` : baseUrl;
      
      switch (method.toLowerCase()) {
        case 'get':
          return get(url, data, config);
        case 'post':
          return post(url, data, config);
        case 'put':
          return put(url, data, config);
        case 'patch':
          return patch(url, data, config);
        case 'delete':
          return del(url, config);
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
    }
  };
}

/**
 * Hook để sử dụng API trong component
 * @param {string} baseUrl - Base URL cho resource
 * @returns {Object} - API methods và state
 */
function useApi(baseUrl) {
  const apiService = createApiService(baseUrl);
  
  return {
    ...apiService,
    axios: axiosInstance,
    createCancelToken,
    isCancel
  };
}

/**
 * Redux API Adapter - Sử dụng cho giao diện User
 */
export class ReduxApiAdapter {
  /**
   * Tạo các action types cho Redux
   * @param {string} resourceName - Tên resource
   * @returns {Object} - Các action types
   */
  static getActionTypes(resourceName) {
    const name = resourceName.toUpperCase();
    
    return {
      FETCH_ALL_REQUEST: `${name}_FETCH_ALL_REQUEST`,
      FETCH_ALL_SUCCESS: `${name}_FETCH_ALL_SUCCESS`,
      FETCH_ALL_FAILURE: `${name}_FETCH_ALL_FAILURE`,
      
      FETCH_ONE_REQUEST: `${name}_FETCH_ONE_REQUEST`,
      FETCH_ONE_SUCCESS: `${name}_FETCH_ONE_SUCCESS`,
      FETCH_ONE_FAILURE: `${name}_FETCH_ONE_FAILURE`,
      
      CREATE_REQUEST: `${name}_CREATE_REQUEST`,
      CREATE_SUCCESS: `${name}_CREATE_SUCCESS`,
      CREATE_FAILURE: `${name}_CREATE_FAILURE`,
      
      UPDATE_REQUEST: `${name}_UPDATE_REQUEST`,
      UPDATE_SUCCESS: `${name}_UPDATE_SUCCESS`,
      UPDATE_FAILURE: `${name}_UPDATE_FAILURE`,
      
      PATCH_REQUEST: `${name}_PATCH_REQUEST`,
      PATCH_SUCCESS: `${name}_PATCH_SUCCESS`,
      PATCH_FAILURE: `${name}_PATCH_FAILURE`,
      
      DELETE_REQUEST: `${name}_DELETE_REQUEST`,
      DELETE_SUCCESS: `${name}_DELETE_SUCCESS`,
      DELETE_FAILURE: `${name}_DELETE_FAILURE`,
      
      RESET: `${name}_RESET`
    };
  }

  /**
   * Tạo các action creators cho Redux
   * @param {Object} actionTypes - Action types
   * @returns {Object} - Các action creators
   */
  static getActionCreators(actionTypes) {
    return {
      fetchAllRequest: () => ({ type: actionTypes.FETCH_ALL_REQUEST }),
      fetchAllSuccess: (data) => ({ type: actionTypes.FETCH_ALL_SUCCESS, payload: data }),
      fetchAllFailure: (error) => ({ type: actionTypes.FETCH_ALL_FAILURE, payload: error }),
      
      fetchOneRequest: () => ({ type: actionTypes.FETCH_ONE_REQUEST }),
      fetchOneSuccess: (data) => ({ type: actionTypes.FETCH_ONE_SUCCESS, payload: data }),
      fetchOneFailure: (error) => ({ type: actionTypes.FETCH_ONE_FAILURE, payload: error }),
      
      createRequest: () => ({ type: actionTypes.CREATE_REQUEST }),
      createSuccess: (data) => ({ type: actionTypes.CREATE_SUCCESS, payload: data }),
      createFailure: (error) => ({ type: actionTypes.CREATE_FAILURE, payload: error }),
      
      updateRequest: () => ({ type: actionTypes.UPDATE_REQUEST }),
      updateSuccess: (data) => ({ type: actionTypes.UPDATE_SUCCESS, payload: data }),
      updateFailure: (error) => ({ type: actionTypes.UPDATE_FAILURE, payload: error }),
      
      patchRequest: () => ({ type: actionTypes.PATCH_REQUEST }),
      patchSuccess: (data) => ({ type: actionTypes.PATCH_SUCCESS, payload: data }),
      patchFailure: (error) => ({ type: actionTypes.PATCH_FAILURE, payload: error }),
      
      deleteRequest: () => ({ type: actionTypes.DELETE_REQUEST }),
      deleteSuccess: (data) => ({ type: actionTypes.DELETE_SUCCESS, payload: data }),
      deleteFailure: (error) => ({ type: actionTypes.DELETE_FAILURE, payload: error }),
      
      reset: () => ({ type: actionTypes.RESET })
    };
  }

  /**
   * Tạo các thunk actions cho Redux
   * @param {Object} actionCreators - Action creators
   * @param {Object} apiService - API service
   * @returns {Object} - Các thunk actions
   */
  static getThunkActions(actionCreators, apiService) {
    return {
      fetchAll: (params) => async (dispatch) => {
        dispatch(actionCreators.fetchAllRequest());
        
        try {
          const response = await apiService.getAll(params);
          dispatch(actionCreators.fetchAllSuccess(response));
          return response;
        } catch (error) {
          const errorInfo = ErrorHandlingAdapter.classifyError(error);
          dispatch(actionCreators.fetchAllFailure(errorInfo));
          throw error;
        }
      },
      
      fetchOne: (id) => async (dispatch) => {
        dispatch(actionCreators.fetchOneRequest());
        
        try {
          const response = await apiService.getById(id);
          dispatch(actionCreators.fetchOneSuccess(response));
          return response;
        } catch (error) {
          const errorInfo = ErrorHandlingAdapter.classifyError(error);
          dispatch(actionCreators.fetchOneFailure(errorInfo));
          throw error;
        }
      },
      
      create: (data) => async (dispatch) => {
        dispatch(actionCreators.createRequest());
        
        try {
          const response = await apiService.create(data);
          dispatch(actionCreators.createSuccess(response));
          return response;
        } catch (error) {
          const errorInfo = ErrorHandlingAdapter.classifyError(error);
          dispatch(actionCreators.createFailure(errorInfo));
          throw error;
        }
      },
      
      update: (id, data) => async (dispatch) => {
        dispatch(actionCreators.updateRequest());
        
        try {
          const response = await apiService.update(id, data);
          dispatch(actionCreators.updateSuccess(response));
          return response;
        } catch (error) {
          const errorInfo = ErrorHandlingAdapter.classifyError(error);
          dispatch(actionCreators.updateFailure(errorInfo));
          throw error;
        }
      },
      
      patch: (id, data) => async (dispatch) => {
        dispatch(actionCreators.patchRequest());
        
        try {
          const response = await apiService.patch(id, data);
          dispatch(actionCreators.patchSuccess(response));
          return response;
        } catch (error) {
          const errorInfo = ErrorHandlingAdapter.classifyError(error);
          dispatch(actionCreators.patchFailure(errorInfo));
          throw error;
        }
      },
      
      remove: (id) => async (dispatch) => {
        dispatch(actionCreators.deleteRequest());
        
        try {
          const response = await apiService.remove(id);
          dispatch(actionCreators.deleteSuccess(response));
          return response;
        } catch (error) {
          const errorInfo = ErrorHandlingAdapter.classifyError(error);
          dispatch(actionCreators.deleteFailure(errorInfo));
          throw error;
        }
      },
      
      custom: (method, path, data, config) => async (dispatch) => {
        // Xác định loại action dựa trên method
        let requestAction, successAction, failureAction;
        
        switch (method.toLowerCase()) {
          case 'get':
            requestAction = actionCreators.fetchAllRequest;
            successAction = actionCreators.fetchAllSuccess;
            failureAction = actionCreators.fetchAllFailure;
            break;
          case 'post':
            requestAction = actionCreators.createRequest;
            successAction = actionCreators.createSuccess;
            failureAction = actionCreators.createFailure;
            break;
          case 'put':
            requestAction = actionCreators.updateRequest;
            successAction = actionCreators.updateSuccess;
            failureAction = actionCreators.updateFailure;
            break;
          case 'patch':
            requestAction = actionCreators.patchRequest;
            successAction = actionCreators.patchSuccess;
            failureAction = actionCreators.patchFailure;
            break;
          case 'delete':
            requestAction = actionCreators.deleteRequest;
            successAction = actionCreators.deleteSuccess;
            failureAction = actionCreators.deleteFailure;
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }
        
        dispatch(requestAction());
        
        try {
          const response = await apiService.custom(method, path, data, config);
          dispatch(successAction(response));
          return response;
        } catch (error) {
          const errorInfo = ErrorHandlingAdapter.classifyError(error);
          dispatch(failureAction(errorInfo));
          throw error;
        }
      }
    };
  }

  /**
   * Tạo reducer cho Redux
   * @param {Object} actionTypes - Action types
   * @returns {Function} - Reducer function
   */
  static createReducer(actionTypes) {
    const initialState = {
      list: {
        data: [],
        loading: false,
        error: null
      },
      detail: {
        data: null,
        loading: false,
        error: null
      },
      create: {
        loading: false,
        error: null,
        success: false
      },
      update: {
        loading: false,
        error: null,
        success: false
      },
      patch: {
        loading: false,
        error: null,
        success: false
      },
      delete: {
        loading: false,
        error: null,
        success: false
      }
    };
    
    return (state = initialState, action) => {
      switch (action.type) {
        // Fetch all
        case actionTypes.FETCH_ALL_REQUEST:
          return {
            ...state,
            list: {
              ...state.list,
              loading: true,
              error: null
            }
          };
          
        case actionTypes.FETCH_ALL_SUCCESS:
          return {
            ...state,
            list: {
              data: action.payload,
              loading: false,
              error: null
            }
          };
          
        case actionTypes.FETCH_ALL_FAILURE:
          return {
            ...state,
            list: {
              ...state.list,
              loading: false,
              error: action.payload
            }
          };
          
        // Fetch one
        case actionTypes.FETCH_ONE_REQUEST:
          return {
            ...state,
            detail: {
              ...state.detail,
              loading: true,
              error: null
            }
          };
          
        case actionTypes.FETCH_ONE_SUCCESS:
          return {
            ...state,
            detail: {
              data: action.payload,
              loading: false,
              error: null
            }
          };
          
        case actionTypes.FETCH_ONE_FAILURE:
          return {
            ...state,
            detail: {
              ...state.detail,
              loading: false,
              error: action.payload
            }
          };
          
        // Create
        case actionTypes.CREATE_REQUEST:
          return {
            ...state,
            create: {
              loading: true,
              error: null,
              success: false
            }
          };
          
        case actionTypes.CREATE_SUCCESS:
          return {
            ...state,
            create: {
              loading: false,
              error: null,
              success: true
            },
            list: {
              ...state.list,
              data: Array.isArray(state.list.data)
                ? [action.payload, ...state.list.data]
                : [action.payload]
            }
          };
          
        case actionTypes.CREATE_FAILURE:
          return {
            ...state,
            create: {
              loading: false,
              error: action.payload,
              success: false
            }
          };
          
        // Update
        case actionTypes.UPDATE_REQUEST:
          return {
            ...state,
            update: {
              loading: true,
              error: null,
              success: false
            }
          };
          
        case actionTypes.UPDATE_SUCCESS:
          return {
            ...state,
            update: {
              loading: false,
              error: null,
              success: true
            },
            detail: {
              ...state.detail,
              data: action.payload
            },
            list: {
              ...state.list,
              data: Array.isArray(state.list.data)
                ? state.list.data.map(item => 
                    item.id === action.payload.id ? action.payload : item
                  )
                : state.list.data
            }
          };
          
        case actionTypes.UPDATE_FAILURE:
          return {
            ...state,
            update: {
              loading: false,
              error: action.payload,
              success: false
            }
          };
          
        // Patch
        case actionTypes.PATCH_REQUEST:
          return {
            ...state,
            patch: {
              loading: true,
              error: null,
              success: false
            }
          };
          
        case actionTypes.PATCH_SUCCESS:
          return {
            ...state,
            patch: {
              loading: false,
              error: null,
              success: true
            },
            detail: {
              ...state.detail,
              data: action.payload
            },
            list: {
              ...state.list,
              data: Array.isArray(state.list.data)
                ? state.list.data.map(item => 
                    item.id === action.payload.id ? action.payload : item
                  )
                : state.list.data
            }
          };
          
        case actionTypes.PATCH_FAILURE:
          return {
            ...state,
            patch: {
              loading: false,
              error: action.payload,
              success: false
            }
          };
          
        // Delete
        case actionTypes.DELETE_REQUEST:
          return {
            ...state,
            delete: {
              loading: true,
              error: null,
              success: false
            }
          };
          
        case actionTypes.DELETE_SUCCESS:
          return {
            ...state,
            delete: {
              loading: false,
              error: null,
              success: true
            },
            list: {
              ...state.list,
              data: Array.isArray(state.list.data)
                ? state.list.data.filter(item => 
                    item.id !== (action.payload.id || action.payload)
                  )
                : state.list.data
            }
          };
          
        case actionTypes.DELETE_FAILURE:
          return {
            ...state,
            delete: {
              loading: false,
              error: action.payload,
              success: false
            }
          };
          
        // Reset
        case actionTypes.RESET:
          return initialState;
          
        default:
          return state;
      }
    };
  }

  /**
   * Tạo các selectors cho Redux
   * @param {string} stateKey - Key trong Redux state
   * @returns {Object} - Các selectors
   */
  static getSelectors(stateKey) {
    return {
      getList: (state) => state[stateKey]?.list?.data || [],
      getListLoading: (state) => state[stateKey]?.list?.loading || false,
      getListError: (state) => state[stateKey]?.list?.error,
      
      getDetail: (state) => state[stateKey]?.detail?.data,
      getDetailLoading: (state) => state[stateKey]?.detail?.loading || false,
      getDetailError: (state) => state[stateKey]?.detail?.error,
      
      getCreateLoading: (state) => state[stateKey]?.create?.loading || false,
      getCreateError: (state) => state[stateKey]?.create?.error,
      getCreateSuccess: (state) => state[stateKey]?.create?.success || false,
      
      getUpdateLoading: (state) => state[stateKey]?.update?.loading || false,
      getUpdateError: (state) => state[stateKey]?.update?.error,
      getUpdateSuccess: (state) => state[stateKey]?.update?.success || false,
      
      getPatchLoading: (state) => state[stateKey]?.patch?.loading || false,
      getPatchError: (state) => state[stateKey]?.patch?.error,
      getPatchSuccess: (state) => state[stateKey]?.patch?.success || false,
      
      getDeleteLoading: (state) => state[stateKey]?.delete?.loading || false,
      getDeleteError: (state) => state[stateKey]?.delete?.error,
      getDeleteSuccess: (state) => state[stateKey]?.delete?.success || false
    };
  }

  /**
   * Tạo API service cho Redux
   * @param {string} resourceName - Tên resource
   * @param {string} baseUrl - Base URL cho resource
   * @returns {Object} - API service cho Redux
   */
  static createApiService(resourceName, baseUrl) {
    const apiService = createApiService(baseUrl);
    const actionTypes = this.getActionTypes(resourceName);
    const actionCreators = this.getActionCreators(actionTypes);
    const thunkActions = this.getThunkActions(actionCreators, apiService);
    const reducer = this.createReducer(actionTypes);
    const selectors = this.getSelectors(resourceName);
    
    return {
      resourceName,
      baseUrl,
      actionTypes,
      actionCreators,
      thunkActions,
      reducer,
      selectors,
      apiService
    };
  }
}

/**
 * Context API Adapter - Sử dụng cho giao diện Client
 */
export class ContextApiAdapter {
  /**
   * Tạo Context cho API
   * @returns {React.Context} - API Context
   */
  static createContext() {
    return React.createContext({
      get: () => {},
      post: () => {},
      put: () => {},
      patch: () => {},
      delete: () => {},
      all: () => {},
      createCancelToken: () => {},
      isCancel: () => {},
      createApiService: () => {},
      useApi: () => {}
    });
  }

  /**
   * Tạo Provider cho API context
   * @param {React.Context} ApiContext - API context
   * @returns {Function} - Provider component
   */
  static createProvider(ApiContext) {
    return ({ children, config }) => {
      // Tạo instance axios với config
      const instance = createAxiosInstance(config);
      
      // Context value
      const value = {
        get: (url, params, config) => get(url, params, config),
        post: (url, data, config) => post(url, data, config),
        put: (url, data, config) => put(url, data, config),
        patch: (url, data, config) => patch(url, data, config),
        delete: (url, config) => del(url, config),
        all,
        createCancelToken,
        isCancel,
        createApiService,
        useApi,
        axios: instance
      };
      
      return (
        <ApiContext.Provider value={value}>
          {children}
        </ApiContext.Provider>
      );
    };
  }

  /**
   * Tạo hook để sử dụng API
   * @param {React.Context} ApiContext - API context
   * @returns {Function} - Hook function
   */
  static createHook(ApiContext) {
    return () => React.useContext(ApiContext);
  }
}

/**
 * API Adapter - Sử dụng cho cả hai giao diện
 */
export default {
  // Các phương thức chính
  get,
  post,
  put,
  patch,
  delete: del,
  all,
  createCancelToken,
  isCancel,
  
  // Các helpers
  createAxiosInstance,
  createApiService,
  useApi,
  
  // Adapter classes
  ReduxApiAdapter,
  ContextApiAdapter,
  
  // Instance axios mặc định
  axios: axiosInstance
};