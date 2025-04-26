/**
 * Route Adapter
 * 
 * Lớp adapter này giúp đồng bộ hóa hệ thống routing giữa giao diện User và Client
 * Cung cấp interface thống nhất để quản lý routing trong cả hai giao diện
 */

import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
  Link
} from 'react-router-dom';
import AuthAdapter from './authAdapter';

// Kiểm tra môi trường hiện tại
const isClientInterface = process.env.REACT_APP_INTERFACE === 'client';

/**
 * Ánh xạ route giữa hai giao diện
 * @type {Object}
 */
const ROUTE_MAPPING = {
  // Trang chính
  '/': '/',
  '/home': '/',
  
  // Xác thực
  '/login': '/auth/login',
  '/register': '/auth/register',
  '/forgot-password': '/auth/forgot-password',
  '/reset-password': '/auth/reset-password',
  
  // Trang người dùng
  '/profile': '/user/profile',
  '/settings': '/user/settings',
  '/notifications': '/user/notifications',
  
  // Trang sản phẩm
  '/products': '/catalog',
  '/products/:id': '/catalog/:id',
  '/products/category/:category': '/catalog/category/:category',
  
  // Trang giỏ hàng và thanh toán
  '/cart': '/checkout/cart',
  '/checkout': '/checkout/payment',
  '/order-confirmation': '/checkout/confirmation',
  '/orders': '/user/orders',
  '/orders/:id': '/user/orders/:id',
  
  // Trang admin
  '/admin': '/admin/dashboard',
  '/admin/products': '/admin/catalog',
  '/admin/orders': '/admin/orders',
  '/admin/users': '/admin/users',
  
  // Trang khác
  '/about': '/about',
  '/contact': '/contact',
  '/faq': '/help/faq',
  '/terms': '/legal/terms',
  '/privacy': '/legal/privacy',
  
  // Trang lỗi
  '/404': '/not-found',
  '/403': '/forbidden',
  '/500': '/error'
};

/**
 * Ánh xạ ngược route từ Client sang User
 * @type {Object}
 */
const REVERSE_ROUTE_MAPPING = Object.entries(ROUTE_MAPPING).reduce((acc, [userRoute, clientRoute]) => {
  acc[clientRoute] = userRoute;
  return acc;
}, {});

/**
 * Chuyển đổi route từ User sang Client
 * @param {string} path - Route trong User
 * @returns {string} - Route tương ứng trong Client
 */
function mapUserToClientRoute(path) {
  // Kiểm tra các route có pattern
  for (const [userPattern, clientPattern] of Object.entries(ROUTE_MAPPING)) {
    if (userPattern.includes(':')) {
      const userRegex = new RegExp('^' + userPattern.replace(/:\w+/g, '([^/]+)') + '$');
      const match = path.match(userRegex);
      
      if (match) {
        let clientPath = clientPattern;
        const params = userPattern.match(/:\w+/g) || [];
        
        params.forEach((param, index) => {
          clientPath = clientPath.replace(param, match[index + 1]);
        });
        
        return clientPath;
      }
    }
  }
  
  // Kiểm tra các route cố định
  return ROUTE_MAPPING[path] || path;
}

/**
 * Chuyển đổi route từ Client sang User
 * @param {string} path - Route trong Client
 * @returns {string} - Route tương ứng trong User
 */
function mapClientToUserRoute(path) {
  // Kiểm tra các route có pattern
  for (const [clientPattern, userPattern] of Object.entries(REVERSE_ROUTE_MAPPING)) {
    if (clientPattern.includes(':')) {
      const clientRegex = new RegExp('^' + clientPattern.replace(/:\w+/g, '([^/]+)') + '$');
      const match = path.match(clientRegex);
      
      if (match) {
        let userPath = userPattern;
        const params = clientPattern.match(/:\w+/g) || [];
        
        params.forEach((param, index) => {
          userPath = userPath.replace(param, match[index + 1]);
        });
        
        return userPath;
      }
    }
  }
  
  // Kiểm tra các route cố định
  return REVERSE_ROUTE_MAPPING[path] || path;
}

/**
 * Chuyển đổi route giữa hai giao diện
 * @param {string} path - Route cần chuyển đổi
 * @returns {string} - Route đã được chuyển đổi
 */
export function getAdaptiveRoute(path) {
  if (isClientInterface) {
    return mapUserToClientRoute(path);
  } else {
    return mapClientToUserRoute(path);
  }
}

/**
 * Hook để sử dụng navigate với route đã được chuyển đổi
 * @returns {Function} - Navigate function
 */
export function useAdaptiveNavigate() {
  const navigate = useNavigate();
  
  return (path, options) => {
    const adaptedPath = getAdaptiveRoute(path);
    navigate(adaptedPath, options);
  };
}

/**
 * Hook để sử dụng location với route đã được chuyển đổi
 * @returns {Object} - Location object
 */
export function useAdaptiveLocation() {
  const location = useLocation();
  
  return {
    ...location,
    pathname: isClientInterface
      ? mapClientToUserRoute(location.pathname)
      : mapUserToClientRoute(location.pathname)
  };
}

/**
 * Component Link với route đã được chuyển đổi
 * @param {Object} props - Component props
 * @returns {React.Element} - React element
 */
export function AdaptiveLink({ to, children, ...props }) {
  const adaptedTo = getAdaptiveRoute(to);
  
  return (
    <Link to={adaptedTo} {...props}>
      {children}
    </Link>
  );
}

/**
 * HOC để bảo vệ route yêu cầu xác thực
 * @param {React.Component} Component - Component cần bảo vệ
 * @param {Object} options - Các tùy chọn
 * @returns {React.Component} - Protected component
 */
export function withProtectedRoute(Component, options = {}) {
  const {
    redirectTo = '/login',
    checkPermission = null
  } = options;
  
  return (props) => {
    const isAuthenticated = AuthAdapter.isAuthenticated();
    const hasPermission = checkPermission ? checkPermission() : true;
    
    if (!isAuthenticated) {
      return <Navigate to={getAdaptiveRoute(redirectTo)} replace />;
    }
    
    if (!hasPermission) {
      return <Navigate to={getAdaptiveRoute('/403')} replace />;
    }
    
    return <Component {...props} />;
  };
}

/**
 * Component để render route với layout
 * @param {Object} props - Component props
 * @returns {React.Element} - React element
 */
export function RouteWithLayout({ element: Element, layout: Layout, ...rest }) {
  return (
    <Route
      {...rest}
      element={
        <Layout>
          <Element />
        </Layout>
      }
    />
  );
}

/**
 * Component để render route với permission check
 * @param {Object} props - Component props
 * @returns {React.Element} - React element
 */
export function PermissionRoute({ element: Element, permission, fallback: Fallback, ...rest }) {
  const hasPermission = AuthAdapter.hasPermission(permission);
  
  return (
    <Route
      {...rest}
      element={hasPermission ? <Element /> : Fallback ? <Fallback /> : <Navigate to="/403" replace />}
    />
  );
}

/**
 * Component để render route với role check
 * @param {Object} props - Component props
 * @returns {React.Element} - React element
 */
export function RoleRoute({ element: Element, roles, fallback: Fallback, ...rest }) {
  const hasRole = AuthAdapter.hasRole(roles);
  
  return (
    <Route
      {...rest}
      element={hasRole ? <Element /> : Fallback ? <Fallback /> : <Navigate to="/403" replace />}
    />
  );
}

/**
 * Component để render route với authentication check
 * @param {Object} props - Component props
 * @returns {React.Element} - React element
 */
export function AuthRoute({ element: Element, redirectTo = '/login', ...rest }) {
  const isAuthenticated = AuthAdapter.isAuthenticated();
  
  return (
    <Route
      {...rest}
      element={isAuthenticated ? <Element /> : <Navigate to={getAdaptiveRoute(redirectTo)} replace />}
    />
  );
}

/**
 * Component để render route với guest check (chỉ cho phép người dùng chưa đăng nhập)
 * @param {Object} props - Component props
 * @returns {React.Element} - React element
 */
export function GuestRoute({ element: Element, redirectTo = '/', ...rest }) {
  const isAuthenticated = AuthAdapter.isAuthenticated();
  
  return (
    <Route
      {...rest}
      element={!isAuthenticated ? <Element /> : <Navigate to={getAdaptiveRoute(redirectTo)} replace />}
    />
  );
}

/**
 * Hook để lấy params từ URL
 * @returns {Object} - Params object
 */
export function useAdaptiveParams() {
  return useParams();
}

/**
 * Hook để lấy và set query params
 * @returns {Array} - [searchParams, setSearchParams]
 */
export function useAdaptiveSearchParams() {
  return useSearchParams();
}

/**
 * Redux Route Adapter - Sử dụng cho giao diện User
 */
export class ReduxRouteAdapter {
  /**
   * Tạo các action types cho Redux
   * @returns {Object} - Các action types
   */
  static getActionTypes() {
    return {
      NAVIGATE: 'ROUTE_NAVIGATE',
      SET_CURRENT_ROUTE: 'ROUTE_SET_CURRENT'
    };
  }

  /**
   * Tạo các action creators cho Redux
   * @returns {Object} - Các action creators
   */
  static getActionCreators() {
    const actionTypes = this.getActionTypes();
    
    return {
      navigate: (path, options) => ({
        type: actionTypes.NAVIGATE,
        payload: { path, options }
      }),
      
      setCurrentRoute: (route) => ({
        type: actionTypes.SET_CURRENT_ROUTE,
        payload: route
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
      if (action.type === actionTypes.NAVIGATE) {
        const { path, options } = action.payload;
        const adaptedPath = getAdaptiveRoute(path);
        
        // Sử dụng history API để navigate
        if (options && options.replace) {
          window.history.replaceState(null, '', adaptedPath);
        } else {
          window.history.pushState(null, '', adaptedPath);
        }
        
        // Dispatch một event để thông báo cho router
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
      
      return next(action);
    };
  }

  /**
   * Tạo reducer cho Redux
   * @returns {Function} - Reducer function
   */
  static createReducer() {
    const actionTypes = this.getActionTypes();
    
    const initialState = {
      currentRoute: window.location.pathname,
      previousRoute: null
    };
    
    return (state = initialState, action) => {
      switch (action.type) {
        case actionTypes.SET_CURRENT_ROUTE:
          return {
            ...state,
            previousRoute: state.currentRoute,
            currentRoute: action.payload
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
      getCurrentRoute: (state) => state.route.currentRoute,
      getPreviousRoute: (state) => state.route.previousRoute
    };
  }
}

/**
 * Context API Route Adapter - Sử dụng cho giao diện Client
 */
export class ContextRouteAdapter {
  /**
   * Tạo Context cho route
   * @returns {React.Context} - Route Context
   */
  static createContext() {
    return React.createContext({
      currentRoute: window.location.pathname,
      previousRoute: null,
      navigate: () => {},
      goBack: () => {}
    });
  }

  /**
   * Tạo Provider cho route context
   * @param {React.Context} RouteContext - Route context
   * @returns {Function} - Provider component
   */
  static createProvider(RouteContext) {
    return ({ children }) => {
      const navigate = useNavigate();
      const location = useLocation();
      const [previousRoute, setPreviousRoute] = useState(null);
      
      // Cập nhật previousRoute khi location thay đổi
      useEffect(() => {
        setPreviousRoute(prev => {
          if (prev !== location.pathname) {
            return prev;
          }
          return null;
        });
      }, [location.pathname]);
      
      // Hàm navigate với route đã được chuyển đổi
      const adaptiveNavigate = (path, options) => {
        const adaptedPath = getAdaptiveRoute(path);
        navigate(adaptedPath, options);
      };
      
      // Hàm goBack
      const goBack = () => {
        if (previousRoute) {
          navigate(previousRoute);
        } else {
          navigate(-1);
        }
      };
      
      // Context value
      const value = {
        currentRoute: location.pathname,
        previousRoute,
        navigate: adaptiveNavigate,
        goBack
      };
      
      return (
        <RouteContext.Provider value={value}>
          {children}
        </RouteContext.Provider>
      );
    };
  }

  /**
   * Tạo hook để sử dụng route
   * @param {React.Context} RouteContext - Route context
   * @returns {Function} - Hook function
   */
  static createHook(RouteContext) {
    return () => useContext(RouteContext);
  }
}

/**
 * Route Adapter - Sử dụng cho cả hai giao diện
 */
export default {
  // Các phương thức chính
  getAdaptiveRoute,
  
  // Các hooks
  useAdaptiveNavigate,
  useAdaptiveLocation,
  useAdaptiveParams,
  useAdaptiveSearchParams,
  
  // Các components
  AdaptiveLink,
  RouteWithLayout,
  AuthRoute,
  GuestRoute,
  PermissionRoute,
  RoleRoute,
  
  // Các HOCs
  withProtectedRoute,
  
  // Adapter classes
  ReduxRouteAdapter,
  ContextRouteAdapter
};