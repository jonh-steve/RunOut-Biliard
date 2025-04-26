/**
 * Data Fetching Adapter
 * 
 * Lớp adapter này giúp đồng bộ hóa việc fetching dữ liệu giữa Redux (User) và React Query/SWR (Client)
 * Cung cấp interface thống nhất để fetch dữ liệu trong cả hai giao diện
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from 'react-query';
import ApiService from './apiAdapter';
import ErrorHandlingAdapter from './errorHandlingAdapter';

// Kiểm tra môi trường hiện tại
const isClientInterface = process.env.REACT_APP_INTERFACE === 'client';

/**
 * Tạo action types cho Redux
 * @param {string} baseType - Base type cho action
 * @returns {Object} - Object chứa các action types
 */
export function createActionTypes(baseType) {
  return {
    REQUEST: `${baseType}_REQUEST`,
    SUCCESS: `${baseType}_SUCCESS`,
    FAILURE: `${baseType}_FAILURE`,
    RESET: `${baseType}_RESET`
  };
}

/**
 * Tạo reducer cho Redux
 * @param {Object} actionTypes - Action types
 * @param {Object} initialState - State ban đầu
 * @returns {Function} - Reducer function
 */
export function createReducer(actionTypes, initialState = {
  data: null,
  loading: false,
  error: null,
  lastUpdated: null
}) {
  return (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.REQUEST:
        return {
          ...state,
          loading: true,
          error: null
        };
      case actionTypes.SUCCESS:
        return {
          ...state,
          loading: false,
          data: action.payload,
          error: null,
          lastUpdated: Date.now()
        };
      case actionTypes.FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload
        };
      case actionTypes.RESET:
        return initialState;
      default:
        return state;
    }
  };
}

/**
 * Tạo action creators cho Redux
 * @param {Object} actionTypes - Action types
 * @returns {Object} - Object chứa các action creators
 */
export function createActionCreators(actionTypes) {
  return {
    request: () => ({ type: actionTypes.REQUEST }),
    success: (data) => ({ type: actionTypes.SUCCESS, payload: data }),
    failure: (error) => ({ type: actionTypes.FAILURE, payload: error }),
    reset: () => ({ type: actionTypes.RESET })
  };
}

/**
 * Tạo thunk action cho Redux
 * @param {Object} actionCreators - Action creators
 * @param {Function} apiCall - API call function
 * @returns {Function} - Thunk action
 */
export function createThunkAction(actionCreators, apiCall) {
  return (...args) => async (dispatch) => {
    dispatch(actionCreators.request());
    
    try {
      const response = await apiCall(...args);
      dispatch(actionCreators.success(response));
      return response;
    } catch (error) {
      dispatch(actionCreators.failure(error));
      throw error;
    }
  };
}

/**
 * Tạo selector cho Redux
 * @param {string} stateKey - Key trong Redux state
 * @returns {Object} - Object chứa các selectors
 */
export function createSelectors(stateKey) {
  return {
    getData: (state) => state[stateKey]?.data,
    getLoading: (state) => state[stateKey]?.loading || false,
    getError: (state) => state[stateKey]?.error,
    getLastUpdated: (state) => state[stateKey]?.lastUpdated
  };
}

/**
 * Hook để fetch dữ liệu trong Redux
 * @param {Function} thunkAction - Thunk action để fetch dữ liệu
 * @param {Object} selectors - Selectors để lấy dữ liệu từ Redux state
 * @param {Array} deps - Dependencies cho useEffect
 * @param {Object} options - Các tùy chọn
 * @returns {Object} - Object chứa data, loading, error và refetch function
 */
export function useReduxQuery(thunkAction, selectors, deps = [], options = {}) {
  const dispatch = useDispatch();
  const data = useSelector(selectors.getData);
  const loading = useSelector(selectors.getLoading);
  const error = useSelector(selectors.getError);
  const lastUpdated = useSelector(selectors.getLastUpdated);
  
  const { enabled = true, refetchOnMount = true, refetchInterval = null } = options;
  
  const fetch = useCallback((...args) => {
    return dispatch(thunkAction(...args));
  }, [dispatch, thunkAction]);
  
  useEffect(() => {
    let intervalId = null;
    
    if (enabled && (refetchOnMount || !lastUpdated)) {
      fetch();
    }
    
    if (refetchInterval && enabled) {
      intervalId = setInterval(() => {
        fetch();
      }, refetchInterval);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [fetch, enabled, refetchOnMount, refetchInterval, lastUpdated, ...deps]);
  
  return { data, loading, error, refetch: fetch };
}

/**
 * Hook để fetch dữ liệu với phân trang trong Redux
 * @param {Function} thunkAction - Thunk action để fetch dữ liệu
 * @param {Object} selectors - Selectors để lấy dữ liệu từ Redux state
 * @param {Object} options - Các tùy chọn
 * @returns {Object} - Object chứa data, loading, error, pagination và refetch function
 */
export function useReduxPaginatedQuery(thunkAction, selectors, options = {}) {
  const [page, setPage] = useState(options.initialPage || 1);
  const [pageSize, setPageSize] = useState(options.initialPageSize || 10);
  
  const deps = [page, pageSize];
  const queryResult = useReduxQuery(thunkAction, selectors, deps, options);
  
  const pagination = {
    page,
    pageSize,
    setPage,
    setPageSize,
    nextPage: () => setPage(prev => prev + 1),
    prevPage: () => setPage(prev => Math.max(1, prev - 1)),
    goToPage: (newPage) => setPage(newPage)
  };
  
  const refetch = useCallback(() => {
    return queryResult.refetch(page, pageSize);
  }, [queryResult.refetch, page, pageSize]);
  
  return { ...queryResult, pagination, refetch };
}

/**
 * Hook để fetch dữ liệu chi tiết trong Redux
 * @param {Function} thunkAction - Thunk action để fetch dữ liệu
 * @param {Object} selectors - Selectors để lấy dữ liệu từ Redux state
 * @param {string|number} id - ID của item cần fetch
 * @param {Object} options - Các tùy chọn
 * @returns {Object} - Object chứa data, loading, error và refetch function
 */
export function useReduxDetailQuery(thunkAction, selectors, id, options = {}) {
  const deps = [id];
  return useReduxQuery(thunkAction, selectors, deps, options);
}

/**
 * Hook để thực hiện mutation trong Redux
 * @param {Function} thunkAction - Thunk action để thực hiện mutation
 * @param {Object} options - Các tùy chọn
 * @returns {Object} - Object chứa mutate function, loading và error
 */
export function useReduxMutation(thunkAction, options = {}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const mutate = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await dispatch(thunkAction(data));
      
      if (options.onSuccess) {
        options.onSuccess(response);
      }
      
      setLoading(false);
      return response;
    } catch (error) {
      setError(error);
      
      if (options.onError) {
        options.onError(error);
      }
      
      setLoading(false);
      throw error;
    }
  }, [dispatch, thunkAction, options]);
  
  return { mutate, loading, error };
}

/**
 * Hook để fetch dữ li��u trong React Query
 * @param {string} queryKey - Key cho React Query
 * @param {Function} queryFn - Function để fetch dữ liệu
 * @param {Object} options - Các tùy chọn cho React Query
 * @returns {Object} - Kết quả từ useQuery
 */
export function useReactQuery(queryKey, queryFn, options = {}) {
  return useQuery(queryKey, queryFn, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    ...options,
    onError: (error) => {
      ErrorHandlingAdapter.handleApiError(error);
      if (options.onError) {
        options.onError(error);
      }
    }
  });
}

/**
 * Hook để fetch dữ liệu với phân trang trong React Query
 * @param {string} queryKey - Key cho React Query
 * @param {Function} queryFn - Function để fetch dữ liệu
 * @param {Object} options - Các tùy chọn
 * @returns {Object} - Object chứa data, loading, error, pagination và refetch function
 */
export function useReactPaginatedQuery(queryKey, queryFn, options = {}) {
  const [page, setPage] = useState(options.initialPage || 1);
  const [pageSize, setPageSize] = useState(options.initialPageSize || 10);
  
  const queryResult = useReactQuery(
    [queryKey, page, pageSize],
    () => queryFn(page, pageSize),
    options
  );
  
  const pagination = {
    page,
    pageSize,
    setPage,
    setPageSize,
    nextPage: () => setPage(prev => prev + 1),
    prevPage: () => setPage(prev => Math.max(1, prev - 1)),
    goToPage: (newPage) => setPage(newPage)
  };
  
  return { ...queryResult, pagination };
}

/**
 * Hook để fetch dữ liệu chi tiết trong React Query
 * @param {string} queryKey - Key cho React Query
 * @param {Function} queryFn - Function để fetch dữ liệu
 * @param {string|number} id - ID của item cần fetch
 * @param {Object} options - Các tùy chọn
 * @returns {Object} - Kết quả từ useQuery
 */
export function useReactDetailQuery(queryKey, queryFn, id, options = {}) {
  return useReactQuery(
    [queryKey, id],
    () => queryFn(id),
    options
  );
}

/**
 * Hook để thực hiện mutation trong React Query
 * @param {string} mutationKey - Key cho React Query mutation
 * @param {Function} mutationFn - Function để thực hiện mutation
 * @param {Object} options - Các tùy chọn
 * @returns {Object} - Kết quả từ useMutation
 */
export function useReactMutation(mutationKey, mutationFn, options = {}) {
  const queryClient = useQueryClient();
  
  return useMutation(mutationFn, {
    ...options,
    onSuccess: (data, variables, context) => {
      // Invalidate queries nếu cần
      if (options.invalidateQueries) {
        const queriesToInvalidate = Array.isArray(options.invalidateQueries)
          ? options.invalidateQueries
          : [options.invalidateQueries];
        
        queriesToInvalidate.forEach(queryKey => {
          queryClient.invalidateQueries(queryKey);
        });
      }
      
      // Update query cache nếu cần
      if (options.updateQuery) {
        const { queryKey, updater } = options.updateQuery;
        queryClient.setQueryData(queryKey, updater);
      }
      
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      ErrorHandlingAdapter.handleApiError(error);
      
      if (options.onError) {
        options.onError(error, variables, context);
      }
    }
  });
}

/**
 * Hook để fetch dữ liệu vô hạn (infinite scroll) trong React Query
 * @param {string} queryKey - Key cho React Query
 * @param {Function} queryFn - Function để fetch dữ liệu
 * @param {Object} options - Các tùy chọn
 * @returns {Object} - Kết quả từ useInfiniteQuery
 */
export function useReactInfiniteQuery(queryKey, queryFn, options = {}) {
  return useInfiniteQuery(
    queryKey,
    ({ pageParam = 1 }) => queryFn(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (options.getNextPageParam) {
          return options.getNextPageParam(lastPage, allPages);
        }
        
        // Mặc định: nếu không có dữ liệu hoặc ít hơn pageSize, không có trang tiếp theo
        if (!lastPage || !lastPage.data || lastPage.data.length < (options.pageSize || 10)) {
          return undefined;
        }
        
        return allPages.length + 1;
      },
      ...options,
      onError: (error) => {
        ErrorHandlingAdapter.handleApiError(error);
        if (options.onError) {
          options.onError(error);
        }
      }
    }
  );
}

/**
 * Hook để fetch dữ liệu trong cả hai giao diện
 * @param {Object} options - Các tùy chọn
 * @returns {Object} - Object chứa data, loading, error và refetch function
 */
export function useFetchData(options) {
  const {
    queryKey,
    queryFn,
    thunkAction,
    selectors,
    deps = [],
    ...restOptions
  } = options;
  
  if (isClientInterface) {
    // Client interface sử dụng React Query
    return useReactQuery(queryKey, queryFn, restOptions);
  } else {
    // User interface sử dụng Redux
    return useReduxQuery(thunkAction, selectors, deps, restOptions);
  }
}

/**
 * Hook để fetch dữ liệu với phân trang trong cả hai giao diện
 * @param {Object} options - Các tùy chọn
 * @returns {Object} - Object chứa data, loading, error, pagination và refetch function
 */
export function usePaginatedData(options) {
  const {
    queryKey,
    queryFn,
    thunkAction,
    selectors,
    ...restOptions
  } = options;
  
  if (isClientInterface) {
    // Client interface sử dụng React Query
    return useReactPaginatedQuery(queryKey, queryFn, restOptions);
  } else {
    // User interface sử dụng Redux
    return useReduxPaginatedQuery(thunkAction, selectors, restOptions);
  }
}

/**
 * Hook để fetch dữ liệu chi tiết trong cả hai giao diện
 * @param {Object} options - Các tùy chọn
 * @returns {Object} - Object chứa data, loading, error và refetch function
 */
export function useDetailData(options) {
  const {
    queryKey,
    queryFn,
    thunkAction,
    selectors,
    id,
    ...restOptions
  } = options;
  
  if (isClientInterface) {
    // Client interface sử dụng React Query
    return useReactDetailQuery(queryKey, queryFn, id, restOptions);
  } else {
    // User interface sử dụng Redux
    return useReduxDetailQuery(thunkAction, selectors, id, restOptions);
  }
}

/**
 * Hook để thực hiện mutation trong cả hai giao diện
 * @param {Object} options - Các tùy chọn
 * @returns {Object} - Object chứa mutate function, loading và error
 */
export function useMutationData(options) {
  const {
    mutationKey,
    mutationFn,
    thunkAction,
    ...restOptions
  } = options;
  
  if (isClientInterface) {
    // Client interface sử dụng React Query
    return useReactMutation(mutationKey, mutationFn, restOptions);
  } else {
    // User interface sử dụng Redux
    return useReduxMutation(thunkAction, restOptions);
  }
}

/**
 * Hook để fetch dữ liệu vô hạn (infinite scroll) trong cả hai giao diện
 * @param {Object} options - Các tùy chọn
 * @returns {Object} - Object chứa data, loading, error và fetch more function
 */
export function useInfiniteData(options) {
  const {
    queryKey,
    queryFn,
    thunkAction,
    selectors,
    ...restOptions
  } = options;
  
  if (isClientInterface) {
    // Client interface sử dụng React Query
    return useReactInfiniteQuery(queryKey, queryFn, restOptions);
  } else {
    // User interface sử dụng Redux
    // Implement infinite scroll cho Redux
    const [page, setPage] = useState(1);
    const [allData, setAllData] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    
    const { data, loading, error, refetch } = useReduxQuery(
      thunkAction,
      selectors,
      [page],
      restOptions
    );
    
    useEffect(() => {
      if (data) {
        if (Array.isArray(data)) {
          if (data.length === 0 || data.length < (restOptions.pageSize || 10)) {
            setHasMore(false);
          }
          
          setAllData(prev => [...prev, ...data]);
        } else if (data.data && Array.isArray(data.data)) {
          if (data.data.length === 0 || data.data.length < (restOptions.pageSize || 10)) {
            setHasMore(false);
          }
          
          setAllData(prev => [...prev, ...data.data]);
        }
      }
    }, [data]);
    
    const fetchMore = useCallback(() => {
      if (!loading && hasMore) {
        setPage(prev => prev + 1);
      }
    }, [loading, hasMore]);
    
    return {
      data: allData,
      loading,
      error,
      fetchMore,
      hasMore,
      refetch: () => {
        setPage(1);
        setAllData([]);
        setHasMore(true);
        return refetch();
      }
    };
  }
}

/**
 * Tạo service để fetch dữ liệu
 * @param {string} baseUrl - Base URL cho API
 * @returns {Object} - Object chứa các phương thức để fetch dữ liệu
 */
export function createDataService(baseUrl) {
  return {
    getAll: (params) => ApiService.get(baseUrl, params),
    getById: (id) => ApiService.get(`${baseUrl}/${id}`),
    create: (data) => ApiService.post(baseUrl, data),
    update: (id, data) => ApiService.put(`${baseUrl}/${id}`, data),
    patch: (id, data) => ApiService.patch(`${baseUrl}/${id}`, data),
    remove: (id) => ApiService.delete(`${baseUrl}/${id}`),
    getPaginated: (page, pageSize) => ApiService.get(baseUrl, { page, pageSize })
  };
}

/**
 * Tạo hooks để fetch dữ liệu từ service
 * @param {Object} service - Service để fetch dữ liệu
 * @param {string} resourceName - Tên resource
 * @returns {Object} - Object chứa các hooks để fetch dữ liệu
 */
export function createDataHooks(service, resourceName) {
  // Tạo action types, action creators, reducer và selectors cho Redux
  const actionTypes = {
    getAll: createActionTypes(`${resourceName.toUpperCase()}_GET_ALL`),
    getById: createActionTypes(`${resourceName.toUpperCase()}_GET_BY_ID`),
    create: createActionTypes(`${resourceName.toUpperCase()}_CREATE`),
    update: createActionTypes(`${resourceName.toUpperCase()}_UPDATE`),
    remove: createActionTypes(`${resourceName.toUpperCase()}_REMOVE`)
  };
  
  const actionCreators = {
    getAll: createActionCreators(actionTypes.getAll),
    getById: createActionCreators(actionTypes.getById),
    create: createActionCreators(actionTypes.create),
    update: createActionCreators(actionTypes.update),
    remove: createActionCreators(actionTypes.remove)
  };
  
  const thunkActions = {
    getAll: createThunkAction(actionCreators.getAll, service.getAll),
    getById: createThunkAction(actionCreators.getById, service.getById),
    create: createThunkAction(actionCreators.create, service.create),
    update: createThunkAction(actionCreators.update, service.update),
    remove: createThunkAction(actionCreators.remove, service.remove)
  };
  
  const selectors = {
    getAll: createSelectors(`${resourceName}List`),
    getById: createSelectors(`${resourceName}Detail`),
    create: createSelectors(`${resourceName}Create`),
    update: createSelectors(`${resourceName}Update`),
    remove: createSelectors(`${resourceName}Remove`)
  };
  
  // Tạo reducers cho Redux
  const reducers = {
    [`${resourceName}List`]: createReducer(actionTypes.getAll),
    [`${resourceName}Detail`]: createReducer(actionTypes.getById),
    [`${resourceName}Create`]: createReducer(actionTypes.create),
    [`${resourceName}Update`]: createReducer(actionTypes.update),
    [`${resourceName}Remove`]: createReducer(actionTypes.remove)
  };
  
  // Tạo hooks cho cả hai giao diện
  return {
    useGetAll: (options = {}) => useFetchData({
      queryKey: `${resourceName}List`,
      queryFn: service.getAll,
      thunkAction: thunkActions.getAll,
      selectors: selectors.getAll,
      ...options
    }),
    
    useGetById: (id, options = {}) => useDetailData({
      queryKey: `${resourceName}Detail`,
      queryFn: service.getById,
      thunkAction: thunkActions.getById,
      selectors: selectors.getById,
      id,
      ...options
    }),
    
    useCreate: (options = {}) => useMutationData({
      mutationKey: `${resourceName}Create`,
      mutationFn: service.create,
      thunkAction: thunkActions.create,
      ...options
    }),
    
    useUpdate: (options = {}) => useMutationData({
      mutationKey: `${resourceName}Update`,
      mutationFn: ({ id, data }) => service.update(id, data),
      thunkAction: thunkActions.update,
      ...options
    }),
    
    useRemove: (options = {}) => useMutationData({
      mutationKey: `${resourceName}Remove`,
      mutationFn: service.remove,
      thunkAction: thunkActions.remove,
      ...options
    }),
    
    usePaginated: (options = {}) => usePaginatedData({
      queryKey: `${resourceName}List`,
      queryFn: service.getPaginated,
      thunkAction: thunkActions.getAll,
      selectors: selectors.getAll,
      ...options
    }),
    
    useInfinite: (options = {}) => useInfiniteData({
      queryKey: `${resourceName}Infinite`,
      queryFn: service.getPaginated,
      thunkAction: thunkActions.getAll,
      selectors: selectors.getAll,
      ...options
    }),
    
    // Trả về các thành phần Redux để sử dụng trong User interface
    redux: {
      actionTypes,
      actionCreators,
      thunkActions,
      selectors,
      reducers
    }
  };
}

/**
 * Data Fetching Adapter - Sử dụng cho cả hai giao diện
 */
export default {
  // Các hooks chính
  useFetchData,
  usePaginatedData,
  useDetailData,
  useMutationData,
  useInfiniteData,
  
  // Các helpers
  createDataService,
  createDataHooks,
  
  // Redux helpers
  createActionTypes,
  createActionCreators,
  createThunkAction,
  createReducer,
  createSelectors,
  
  // Redux hooks
  useReduxQuery,
  useReduxPaginatedQuery,
  useReduxDetailQuery,
  useReduxMutation,
  
  // React Query hooks
  useReactQuery,
  useReactPaginatedQuery,
  useReactDetailQuery,
  useReactMutation,
  useReactInfiniteQuery
};