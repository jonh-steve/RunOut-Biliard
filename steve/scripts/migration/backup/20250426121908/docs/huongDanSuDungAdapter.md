# Hướng dẫn sử dụng các Adapter trong quá trình đồng bộ hóa

## Giới thiệu

Tài liệu này cung cấp hướng dẫn chi tiết về cách sử dụng các adapter đã được phát triển để đồng bộ hóa giữa giao diện User (sử dụng Material UI và Redux) và giao diện Client (sử dụng Tailwind CSS và Context API).

Các adapter này giúp đảm bảo tính nhất quán giữa hai giao diện, giảm thiểu công sức phát triển và bảo trì, đồng thời tạo điều kiện cho việc chuyển đổi dần dần từ giao diện cũ sang giao diện mới.

## Danh sách các Adapter

1. [API Adapter](#api-adapter)
2. [Authentication Adapter](#authentication-adapter)
3. [Data Fetching Adapter](#data-fetching-adapter)
4. [Error Handling Adapter](#error-handling-adapter)
5. [Form Adapter](#form-adapter)
6. [Internationalization Adapter](#internationalization-adapter)
7. [Notification Adapter](#notification-adapter)
8. [Route Adapter](#route-adapter)
9. [Storage Adapter](#storage-adapter)
10. [Theme Adapter](#theme-adapter)
11. [Utility Adapter](#utility-adapter)

## API Adapter

API Adapter cung cấp interface thống nhất để gọi API trong cả hai giao diện.

### Cách sử dụng trong giao diện User (Redux)

```javascript
import ApiAdapter from 'src/services/apiAdapter';
import { useDispatch } from 'react-redux';

function UserComponent() {
  const dispatch = useDispatch();
  
  // Tạo API service cho resource "products"
  const productService = ApiAdapter.ReduxApiAdapter.createApiService('products', '/api/products');
  
  // Sử dụng thunk actions
  const fetchProducts = () => {
    dispatch(productService.thunkActions.fetchAll());
  };
  
  return (
    <button onClick={fetchProducts}>Fetch Products</button>
  );
}
```

### Cách sử dụng trong giao diện Client (Context API)

```javascript
import React from 'react';
import ApiAdapter from 'src/services/apiAdapter';

// Tạo context và provider
const ApiContext = ApiAdapter.ContextApiAdapter.createContext();
const ApiProvider = ApiAdapter.ContextApiAdapter.createProvider(ApiContext);
const useApi = ApiAdapter.ContextApiAdapter.createHook(ApiContext);

function ClientApp() {
  return (
    <ApiProvider>
      <ClientComponent />
    </ApiProvider>
  );
}

function ClientComponent() {
  const api = useApi();
  const productApi = api.createApiService('/api/products');
  
  const fetchProducts = async () => {
    try {
      const products = await productApi.getAll();
      console.log(products);
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <button onClick={fetchProducts}>Fetch Products</button>
  );
}
```

## Authentication Adapter

Authentication Adapter cung cấp interface thống nhất để quản lý xác thực trong cả hai giao diện.

### Cách sử dụng trong giao diện User (Redux)

```javascript
import AuthAdapter from 'src/services/authAdapter';
import { useDispatch, useSelector } from 'react-redux';

function LoginForm() {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.auth.isLoading);
  const error = useSelector(state => state.auth.error);
  
  const handleLogin = (credentials) => {
    dispatch(AuthAdapter.ReduxAuthAdapter.getActionCreators().login(credentials));
  };
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleLogin({ email: 'user@example.com', password: 'password' });
    }}>
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Cách sử dụng trong giao diện Client (Context API)

```javascript
import React, { useState } from 'react';
import AuthAdapter from 'src/services/authAdapter';

// Tạo context và provider
const AuthContext = AuthAdapter.ContextAuthAdapter.createContext();
const AuthProvider = AuthAdapter.ContextAuthAdapter.createProvider(AuthContext);
const useAuth = AuthAdapter.ContextAuthAdapter.createHook(AuthContext);

function ClientApp() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}

function LoginForm() {
  const { login, isLoading, error } = useAuth();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    await login({ email: 'user@example.com', password: 'password' });
  };
  
  return (
    <form onSubmit={handleLogin}>
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

## Data Fetching Adapter

Data Fetching Adapter cung cấp interface thống nhất để fetch dữ liệu trong cả hai giao diện.

### Cách sử dụng trong giao diện User (Redux)

```javascript
import DataFetchingAdapter from 'src/services/dataFetchingAdapter';
import { useDispatch, useSelector } from 'react-redux';

function ProductList() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(state => state.products);
  
  // Sử dụng hook từ adapter
  const { fetchData } = DataFetchingAdapter.useDataFetching();
  
  useEffect(() => {
    dispatch(fetchData('/api/products'));
  }, [dispatch, fetchData]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <ul>
      {data.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

### Cách sử dụng trong giao diện Client (Context API)

```javascript
import React from 'react';
import DataFetchingAdapter from 'src/services/dataFetchingAdapter';

function ProductList() {
  // Sử dụng hook từ adapter
  const { data, loading, error, fetchData } = DataFetchingAdapter.useDataFetching();
  
  useEffect(() => {
    fetchData('/api/products');
  }, [fetchData]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <ul>
      {data.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

## Error Handling Adapter

Error Handling Adapter cung cấp interface thống nhất để xử lý lỗi trong cả hai giao diện.

### Cách sử dụng trong giao diện User (Redux)

```javascript
import ErrorHandlingAdapter from 'src/services/errorHandlingAdapter';
import { useDispatch } from 'react-redux';

function UserComponent() {
  const dispatch = useDispatch();
  
  const handleApiCall = async () => {
    try {
      const response = await fetch('/api/data');
      const data = await response.json();
      return data;
    } catch (error) {
      // Phân loại lỗi
      const errorInfo = ErrorHandlingAdapter.classifyError(error);
      
      // Dispatch action để xử lý lỗi
      dispatch({ type: 'ERROR_OCCURRED', payload: errorInfo });
      
      // Hiển thị thông báo lỗi
      ErrorHandlingAdapter.showErrorNotification(errorInfo);
    }
  };
  
  return (
    <button onClick={handleApiCall}>Fetch Data</button>
  );
}
```

### Cách sử dụng trong giao diện Client (Context API)

```javascript
import React from 'react';
import ErrorHandlingAdapter from 'src/services/errorHandlingAdapter';

function ClientComponent() {
  const { useErrorHandler } = ErrorHandlingAdapter;
  const { handleError } = useErrorHandler();
  
  const handleApiCall = async () => {
    try {
      const response = await fetch('/api/data');
      const data = await response.json();
      return data;
    } catch (error) {
      // Xử lý lỗi với hook
      handleError(error);
    }
  };
  
  return (
    <button onClick={handleApiCall}>Fetch Data</button>
  );
}
```

## Form Adapter

Form Adapter cung cấp interface thống nhất để quản lý form trong cả hai giao diện.

### Cách sử dụng trong giao diện User (Redux)

```javascript
import FormAdapter from 'src/services/formAdapter';
import { useDispatch, useSelector } from 'react-redux';

function UserForm() {
  const dispatch = useDispatch();
  const formState = useSelector(state => state.form.userForm);
  
  // Sử dụng hook từ adapter
  const { useForm } = FormAdapter;
  const { register, handleSubmit, errors } = useForm({
    defaultValues: {
      name: '',
      email: ''
    },
    onSubmit: (values) => {
      dispatch({ type: 'SUBMIT_FORM', payload: values });
    }
  });
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name</label>
        <input {...register('name', { required: 'Name is required' })} />
        {errors.name && <span>{errors.name.message}</span>}
      </div>
      
      <div>
        <label>Email</label>
        <input {...register('email', { 
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address'
          }
        })} />
        {errors.email && <span>{errors.email.message}</span>}
      </div>
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Cách sử dụng trong giao diện Client (Context API)

```javascript
import React from 'react';
import FormAdapter from 'src/services/formAdapter';

function ClientForm() {
  // Sử dụng hook từ adapter
  const { useForm } = FormAdapter;
  const { register, handleSubmit, errors } = useForm({
    defaultValues: {
      name: '',
      email: ''
    },
    onSubmit: (values) => {
      console.log(values);
    }
  });
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name</label>
        <input {...register('name', { required: 'Name is required' })} />
        {errors.name && <span>{errors.name.message}</span>}
      </div>
      
      <div>
        <label>Email</label>
        <input {...register('email', { 
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address'
          }
        })} />
        {errors.email && <span>{errors.email.message}</span>}
      </div>
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Internationalization Adapter

Internationalization Adapter cung cấp interface thống nhất để quản lý đa ngôn ngữ trong cả hai giao diện.

### Cách sử dụng trong giao diện User (Redux)

```javascript
import I18nAdapter from 'src/services/i18nAdapter';
import { useDispatch, useSelector } from 'react-redux';

function UserComponent() {
  const dispatch = useDispatch();
  const { language } = useSelector(state => state.i18n);
  
  // Sử dụng hook từ adapter
  const { t, changeLanguage } = I18nAdapter.useTranslation();
  
  const handleLanguageChange = (lang) => {
    dispatch(I18nAdapter.ReduxI18nAdapter.getActionCreators().changeLanguage(lang));
  };
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('description')}</p>
      
      <select 
        value={language} 
        onChange={(e) => handleLanguageChange(e.target.value)}
      >
        <option value="en">English</option>
        <option value="vi">Tiếng Việt</option>
        <option value="fr">Français</option>
      </select>
    </div>
  );
}
```

### Cách sử dụng trong giao diện Client (Context API)

```javascript
import React from 'react';
import I18nAdapter from 'src/services/i18nAdapter';

// Tạo context và provider
const I18nContext = I18nAdapter.ContextI18nAdapter.createContext();
const I18nProvider = I18nAdapter.ContextI18nAdapter.createProvider(I18nContext);
const useI18n = I18nAdapter.ContextI18nAdapter.createHook(I18nContext);

function ClientApp() {
  return (
    <I18nProvider>
      <ClientComponent />
    </I18nProvider>
  );
}

function ClientComponent() {
  const { t, language, changeLanguage } = useI18n();
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('description')}</p>
      
      <select 
        value={language} 
        onChange={(e) => changeLanguage(e.target.value)}
      >
        <option value="en">English</option>
        <option value="vi">Tiếng Việt</option>
        <option value="fr">Français</option>
      </select>
    </div>
  );
}
```

## Notification Adapter

Notification Adapter cung cấp interface thống nhất để hiển thị thông báo trong cả hai giao diện.

### Cách sử dụng trong giao diện User (Redux)

```javascript
import NotificationAdapter from 'src/services/notificationAdapter';
import { useDispatch } from 'react-redux';

function UserComponent() {
  const dispatch = useDispatch();
  
  const showSuccessNotification = () => {
    dispatch(NotificationAdapter.ReduxNotificationAdapter.getActionCreators().showNotification({
      message: 'Operation successful!',
      type: NotificationAdapter.NOTIFICATION_TYPES.SUCCESS
    }));
  };
  
  const showErrorNotification = () => {
    dispatch(NotificationAdapter.ReduxNotificationAdapter.getActionCreators().showNotification({
      message: 'An error occurred!',
      type: NotificationAdapter.NOTIFICATION_TYPES.ERROR
    }));
  };
  
  return (
    <div>
      <button onClick={showSuccessNotification}>Show Success</button>
      <button onClick={showErrorNotification}>Show Error</button>
    </div>
  );
}
```

### Cách sử dụng trong giao diện Client (Context API)

```javascript
import React from 'react';
import NotificationAdapter from 'src/services/notificationAdapter';

// Tạo context và provider
const NotificationContext = NotificationAdapter.ContextNotificationAdapter.createContext();
const NotificationProvider = NotificationAdapter.ContextNotificationAdapter.createProvider(NotificationContext);
const useNotification = NotificationAdapter.ContextNotificationAdapter.createHook(NotificationContext);

function ClientApp() {
  return (
    <NotificationProvider>
      <ClientComponent />
    </NotificationProvider>
  );
}

function ClientComponent() {
  const { showNotification } = useNotification();
  
  const showSuccessNotification = () => {
    showNotification({
      message: 'Operation successful!',
      type: NotificationAdapter.NOTIFICATION_TYPES.SUCCESS
    });
  };
  
  const showErrorNotification = () => {
    showNotification({
      message: 'An error occurred!',
      type: NotificationAdapter.NOTIFICATION_TYPES.ERROR
    });
  };
  
  return (
    <div>
      <button onClick={showSuccessNotification}>Show Success</button>
      <button onClick={showErrorNotification}>Show Error</button>
    </div>
  );
}
```

## Route Adapter

Route Adapter cung cấp interface thống nhất để quản lý routing trong cả hai giao diện.

### Cách sử dụng trong giao diện User (Redux)

```javascript
import RouteAdapter from 'src/services/routeAdapter';
import { useDispatch } from 'react-redux';

function UserComponent() {
  const dispatch = useDispatch();
  
  const navigateToProfile = () => {
    dispatch(RouteAdapter.ReduxRouteAdapter.getActionCreators().navigate('/profile'));
  };
  
  return (
    <div>
      <RouteAdapter.AdaptiveLink to="/home">Home</RouteAdapter.AdaptiveLink>
      <button onClick={navigateToProfile}>Go to Profile</button>
    </div>
  );
}

// Bảo vệ route yêu cầu xác thực
const ProtectedUserComponent = RouteAdapter.withProtectedRoute(UserComponent, {
  redirectTo: '/login'
});
```

### Cách sử dụng trong giao diện Client (Context API)

```javascript
import React from 'react';
import RouteAdapter from 'src/services/routeAdapter';

// Tạo context và provider
const RouteContext = RouteAdapter.ContextRouteAdapter.createContext();
const RouteProvider = RouteAdapter.ContextRouteAdapter.createProvider(RouteContext);
const useRoute = RouteAdapter.ContextRouteAdapter.createHook(RouteContext);

function ClientApp() {
  return (
    <RouteProvider>
      <ClientComponent />
    </RouteProvider>
  );
}

function ClientComponent() {
  const { navigate } = useRoute();
  
  return (
    <div>
      <RouteAdapter.AdaptiveLink to="/home">Home</RouteAdapter.AdaptiveLink>
      <button onClick={() => navigate('/profile')}>Go to Profile</button>
    </div>
  );
}

// Bảo vệ route yêu cầu xác thực
const ProtectedClientComponent = RouteAdapter.withProtectedRoute(ClientComponent, {
  redirectTo: '/login'
});
```

## Storage Adapter

Storage Adapter cung cấp interface thống nhất để lưu trữ dữ liệu trong cả hai giao diện.

### Cách sử dụng trong giao diện User (Redux)

```javascript
import StorageAdapter from 'src/services/storageAdapter';
import { useDispatch } from 'react-redux';

function UserComponent() {
  const dispatch = useDispatch();
  
  const saveData = () => {
    dispatch(StorageAdapter.ReduxStorageAdapter.getActionCreators().setItem('user_preferences', {
      theme: 'dark',
      fontSize: 'large'
    }));
  };
  
  const loadData = () => {
    const preferences = StorageAdapter.getItem('user_preferences');
    console.log(preferences);
  };
  
  const clearData = () => {
    dispatch(StorageAdapter.ReduxStorageAdapter.getActionCreators().removeItem('user_preferences'));
  };
  
  return (
    <div>
      <button onClick={saveData}>Save Preferences</button>
      <button onClick={loadData}>Load Preferences</button>
      <button onClick={clearData}>Clear Preferences</button>
    </div>
  );
}
```

### Cách sử dụng trong giao diện Client (Context API)

```javascript
import React from 'react';
import StorageAdapter from 'src/services/storageAdapter';

// Tạo context và provider
const StorageContext = StorageAdapter.ContextStorageAdapter.createContext();
const StorageProvider = StorageAdapter.ContextStorageAdapter.createProvider(StorageContext);
const useStorage = StorageAdapter.ContextStorageAdapter.createHook(StorageContext);

function ClientApp() {
  return (
    <StorageProvider>
      <ClientComponent />
    </StorageProvider>
  );
}

function ClientComponent() {
  const { setItem, getItem, removeItem } = useStorage();
  
  const saveData = () => {
    setItem('user_preferences', {
      theme: 'dark',
      fontSize: 'large'
    });
  };
  
  const loadData = () => {
    const preferences = getItem('user_preferences');
    console.log(preferences);
  };
  
  const clearData = () => {
    removeItem('user_preferences');
  };
  
  return (
    <div>
      <button onClick={saveData}>Save Preferences</button>
      <button onClick={loadData}>Load Preferences</button>
      <button onClick={clearData}>Clear Preferences</button>
    </div>
  );
}
```

## Theme Adapter

Theme Adapter cung cấp interface thống nhất để quản lý theme trong cả hai giao diện.

### Cách sử dụng trong giao diện User (Redux)

```javascript
import ThemeAdapter from 'src/services/themeAdapter';
import { useDispatch, useSelector } from 'react-redux';

function UserComponent() {
  const dispatch = useDispatch();
  const { mode } = useSelector(state => state.theme);
  
  // Sử dụng hook từ adapter
  const { useTheme } = ThemeAdapter;
  const { theme, toggleMode } = useTheme();
  
  const handleToggleTheme = () => {
    dispatch({ type: 'theme/toggleMode' });
  };
  
  // Sử dụng makeStyles
  const useStyles = ThemeAdapter.makeStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
      padding: theme.spacing(2)
    },
    button: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      padding: theme.spacing(1, 2),
      borderRadius: theme.shape.borderRadius
    }
  }));
  
  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <h1>Current Theme: {mode}</h1>
      <button className={classes.button} onClick={handleToggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
}
```

### Cách sử dụng trong giao diện Client (Context API)

```javascript
import React from 'react';
import ThemeAdapter from 'src/services/themeAdapter';

function ClientComponent() {
  // Sử dụng hook từ adapter
  const { useTheme } = ThemeAdapter;
  const { theme, mode, toggleMode } = useTheme();
  
  return (
    <div className="bg-background-default text-text-primary p-4">
      <h1>Current Theme: {mode}</h1>
      <button 
        className="bg-primary-500 text-white px-4 py-2 rounded"
        onClick={toggleMode}
      >
        Toggle Theme
      </button>
    </div>
  );
}
```

## Utility Adapter

Utility Adapter cung cấp các tiện ích chung cho cả hai giao diện.

### Cách sử dụng trong cả hai giao diện

```javascript
import UtilityAdapter from 'src/services/utilityAdapter';

function Component() {
  // Format date
  const formattedDate = UtilityAdapter.formatDate(new Date(), 'DD/MM/YYYY');
  
  // Format currency
  const formattedPrice = UtilityAdapter.formatCurrency(1000, 'USD');
  
  // Validate email
  const isValidEmail = UtilityAdapter.validateEmail('user@example.com');
  
  // Generate unique ID
  const uniqueId = UtilityAdapter.generateId();
  
  return (
    <div>
      <p>Date: {formattedDate}</p>
      <p>Price: {formattedPrice}</p>
      <p>Email valid: {isValidEmail ? 'Yes' : 'No'}</p>
      <p>ID: {uniqueId}</p>
    </div>
  );
}
```

## Kết hợp nhiều Adapter

Trong thực tế, bạn thường cần kết hợp nhiều adapter để xây dựng một ứng dụng hoàn chỉnh.

### Ví dụ trong giao diện User (Redux)

```javascript
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApiAdapter from 'src/services/apiAdapter';
import AuthAdapter from 'src/services/authAdapter';
import NotificationAdapter from 'src/services/notificationAdapter';
import ThemeAdapter from 'src/services/themeAdapter';

function UserDashboard() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { data: products, loading } = useSelector(state => state.products);
  
  // Tạo API service
  const productService = ApiAdapter.ReduxApiAdapter.createApiService('products', '/api/products');
  
  // Sử dụng theme
  const { theme } = ThemeAdapter.useTheme();
  const useStyles = ThemeAdapter.makeStyles((theme) => ({
    dashboard: {
      padding: theme.spacing(3),
      backgroundColor: theme.palette.background.default
    },
    title: {
      color: theme.palette.primary.main,
      marginBottom: theme.spacing(2)
    }
  }));
  const classes = useStyles();
  
  // Fetch products khi component mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(productService.thunkActions.fetchAll())
        .catch(error => {
          dispatch(NotificationAdapter.ReduxNotificationAdapter.getActionCreators().showNotification({
            message: 'Failed to load products',
            type: NotificationAdapter.NOTIFICATION_TYPES.ERROR
          }));
        });
    }
  }, [dispatch, isAuthenticated]);
  
  // Xử lý logout
  const handleLogout = () => {
    dispatch(AuthAdapter.ReduxAuthAdapter.getActionCreators().logout());
  };
  
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  
  return (
    <div className={classes.dashboard}>
      <h1 className={classes.title}>Welcome, {user.name}</h1>
      
      <button onClick={handleLogout}>Logout</button>
      
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <ul>
          {products.map(product => (
            <li key={product.id}>{product.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Ví dụ trong giao diện Client (Context API)

```javascript
import React, { useEffect } from 'react';
import ApiAdapter from 'src/services/apiAdapter';
import AuthAdapter from 'src/services/authAdapter';
import NotificationAdapter from 'src/services/notificationAdapter';
import ThemeAdapter from 'src/services/themeAdapter';

// Tạo các context và provider
const ApiContext = ApiAdapter.ContextApiAdapter.createContext();
const ApiProvider = ApiAdapter.ContextApiAdapter.createProvider(ApiContext);
const useApi = ApiAdapter.ContextApiAdapter.createHook(ApiContext);

const AuthContext = AuthAdapter.ContextAuthAdapter.createContext();
const AuthProvider = AuthAdapter.ContextAuthAdapter.createProvider(AuthContext);
const useAuth = AuthAdapter.ContextAuthAdapter.createHook(AuthContext);

const NotificationContext = NotificationAdapter.ContextNotificationAdapter.createContext();
const NotificationProvider = NotificationAdapter.ContextNotificationAdapter.createProvider(NotificationContext);
const useNotification = NotificationAdapter.ContextNotificationAdapter.createHook(NotificationContext);

function ClientApp() {
  return (
    <ThemeAdapter.ThemeProvider>
      <ApiProvider>
        <AuthProvider>
          <NotificationProvider>
            <ClientDashboar
            <ClientDashboard />
            </NotificationProvider>
          </AuthProvider>
        </ApiProvider>
      </ThemeAdapter.ThemeProvider>
    );
  }
  
  function ClientDashboard() {
    // Sử dụng các hook từ adapter
    const { isAuthenticated, user, logout } = useAuth();
    const { createApiService } = useApi();
    const { showNotification } = useNotification();
    const { theme } = ThemeAdapter.useTheme();
    
    // Tạo API service
    const productApi = createApiService('/api/products');
    
    // State cho products
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Fetch products khi component mount
    useEffect(() => {
      if (isAuthenticated) {
        setLoading(true);
        productApi.getAll()
          .then(data => {
            setProducts(data);
            setLoading(false);
          })
          .catch(error => {
            showNotification({
              message: 'Failed to load products',
              type: NotificationAdapter.NOTIFICATION_TYPES.ERROR
            });
            setLoading(false);
          });
      }
    }, [isAuthenticated, productApi, showNotification]);
    
    // Xử lý logout
    const handleLogout = () => {
      logout();
    };
    
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    
    return (
      <div className="p-6 bg-background-default">
        <h1 className="text-primary-500 mb-4">Welcome, {user.name}</h1>
        
        <button 
          className="bg-primary-500 text-white px-4 py-2 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
        
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <ul className="mt-4">
            {products.map(product => (
              <li key={product.id} className="p-2 border-b border-gray-200">
                {product.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  ```
  
  ## Các vấn đề thường gặp và cách giải quyết
  
  ### 1. Xung đột giữa Redux và Context API
  
  **Vấn đề**: Khi sử dụng cả Redux (trong giao diện User) và Context API (trong giao diện Client), có thể xảy ra xung đột về state management.
  
  **Giải pháp**:
  - Sử dụng các adapter để tách biệt logic nghiệp vụ khỏi state management
  - Đảm bảo mỗi adapter có interface thống nhất cho cả hai giao diện
  - Sử dụng các hook tùy chỉnh để trừu tượng hóa việc truy cập state
  
  ```javascript
  // Ví dụ về hook tùy chỉnh để trừu tượng hóa việc truy cập state
  import { useSelector, useDispatch } from 'react-redux';
  import { useContext } from 'react';
  import { SomeContext } from './contexts';
  
  // Hook này hoạt động với cả Redux và Context API
  export function useData() {
    // Kiểm tra xem đang ở giao diện nào
    const isClientInterface = process.env.INTERFACE_TYPE === 'client';
    
    if (isClientInterface) {
      // Sử dụng Context API
      const context = useContext(SomeContext);
      return {
        data: context.data,
        loading: context.loading,
        error: context.error,
        fetchData: context.fetchData
      };
    } else {
      // Sử dụng Redux
      const dispatch = useDispatch();
      const { data, loading, error } = useSelector(state => state.someData);
      
      return {
        data,
        loading,
        error,
        fetchData: (params) => dispatch({ type: 'FETCH_DATA', payload: params })
      };
    }
  }
  ```
  
  ### 2. Đồng bộ hóa state giữa hai giao diện
  
  **Vấn đề**: Khi người dùng chuyển đổi giữa hai giao diện, state có thể bị mất.
  
  **Giải pháp**:
  - Sử dụng Storage Adapter để lưu trữ state quan trọng
  - Đồng bộ hóa state thông qua localStorage hoặc sessionStorage
  - Sử dụng các event để thông báo giữa các giao diện
  
  ```javascript
  // Ví dụ về đồng bộ hóa state giữa hai giao diện
  import StorageAdapter from 'src/services/storageAdapter';
  
  // Lưu state khi thay đổi
  function saveState(state) {
    StorageAdapter.setItem('app_state', state);
    
    // Thông báo cho các tab khác
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('app_state_changed', { detail: state }));
    }
  }
  
  // Lắng nghe sự thay đổi từ các tab khác
  function listenForStateChanges(callback) {
    if (typeof window !== 'undefined') {
      window.addEventListener('app_state_changed', (event) => {
        callback(event.detail);
      });
      
      return () => {
        window.removeEventListener('app_state_changed', callback);
      };
    }
    
    return () => {};
  }
  
  // Khôi phục state
  function restoreState() {
    return StorageAdapter.getItem('app_state') || {};
  }
  ```
  
  ### 3. Xử lý các tính năng chỉ có trong một giao diện
  
  **Vấn đề**: Một số tính năng có thể chỉ có trong một giao diện nhưng không có trong giao diện còn lại.
  
  **Giải pháp**:
  - Sử dụng feature flags để bật/tắt tính năng
  - Tạo các component fallback cho các tính năng không được hỗ trợ
  - Sử dụng các adapter để cung cấp interface thống nhất, ngay cả khi implementation khác nhau
  
  ```javascript
  // Ví dụ về feature flags
  import FeatureFlagAdapter from 'src/services/featureFlagAdapter';
  
  function FeatureComponent() {
    const { isFeatureEnabled } = FeatureFlagAdapter.useFeatureFlags();
    
    if (!isFeatureEnabled('advanced_analytics')) {
      return <BasicAnalytics />;
    }
    
    return <AdvancedAnalytics />;
  }
  ```
  
  ### 4. Hiệu suất khi sử dụng nhiều adapter
  
  **Vấn đề**: Sử dụng nhiều adapter có thể ảnh hưởng đến hiệu suất.
  
  **Giải pháp**:
  - Sử dụng memoization để tránh tính toán lại
  - Lazy loading các adapter khi cần thiết
  - Tối ưu hóa re-render bằng cách sử dụng React.memo, useMemo và useCallback
  
  ```javascript
  // Ví dụ về lazy loading adapter
  import React, { lazy, Suspense } from 'react';
  
  // Lazy load adapter
  const ThemeAdapter = lazy(() => import('src/services/themeAdapter'));
  
  function App() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <ThemeAdapter.ThemeProvider>
          <AppContent />
        </ThemeAdapter.ThemeProvider>
      </Suspense>
    );
  }
  ```
  
  ## Quy trình chuyển đổi từ giao diện User sang Client
  
  Dưới đây là quy trình đề xuất để chuyển đổi dần dần từ giao diện User (Material UI + Redux) sang giao diện Client (Tailwind CSS + Context API):
  
  ### Bước 1: Chuẩn bị
  
  1. **Phân tích hiện trạng**:
     - Liệt kê tất cả các component, state, và logic nghiệp vụ
     - Xác định các phụ thuộc và mối quan hệ giữa chúng
  
  2. **Thiết kế adapter**:
     - Xác định các adapter cần thiết
     - Thiết kế interface thống nhất cho mỗi adapter
  
  3. **Thiết lập môi trường phát triển**:
     - Cấu hình để có thể chạy cả hai giao diện
     - Thiết lập các công cụ kiểm thử
  
  ### Bước 2: Triển khai các adapter
  
  1. **Phát triển từng adapter**:
     - Bắt đầu với các adapter cơ bản như Storage, Theme, và Utility
     - Tiếp tục với các adapter phức tạp hơn như API, Auth, và Route
  
  2. **Kiểm thử adapter**:
     - Viết unit test cho mỗi adapter
     - Đảm bảo adapter hoạt động đúng trong cả hai giao diện
  
  ### Bước 3: Chuyển đổi component
  
  1. **Bắt đầu với các component đơn giản**:
     - Chuyển đổi các component UI cơ bản
     - Sử dụng các adapter đã phát triển
  
  2. **Tiến đến các component phức tạp hơn**:
     - Chuyển đổi các container component
     - Đảm bảo logic nghiệp vụ được giữ nguyên
  
  3. **Kiểm thử component**:
     - Viết integration test
     - Đảm bảo component hoạt động đúng trong cả hai giao diện
  
  ### Bước 4: Chuyển đổi trang và luồng
  
  1. **Chuyển đổi từng trang**:
     - Bắt đầu với các trang đơn giản
     - Tiến đến các trang phức tạp hơn
  
  2. **Kiểm thử end-to-end**:
     - Viết E2E test cho mỗi luồng
     - Đảm bảo luồng hoạt động đúng trong cả hai giao diện
  
  ### Bước 5: Hoàn thiện và tối ưu hóa
  
  1. **Tối ưu hóa hiệu suất**:
     - Phân tích và cải thiện thời gian tải
     - Tối ưu hóa re-render
  
  2. **Cải thiện UX**:
     - Đảm bảo trải nghiệm người dùng nhất quán
     - Thu thập phản hồi và cải thiện
  
  3. **Hoàn thiện tài liệu**:
     - Cập nhật tài liệu cho các adapter
     - Viết hướng dẫn sử dụng
  
  ## Kết luận
  
  Các adapter đóng vai trò quan trọng trong quá trình đồng bộ hóa giữa giao diện User và Client. Chúng cung cấp interface thống nhất, giúp giảm thiểu công sức phát triển và bảo trì, đồng thời tạo điều kiện cho việc chuyển đổi dần dần từ giao diện cũ sang giao diện mới.
  
  Bằng cách tuân theo hướng dẫn này và sử dụng các adapter đã được phát triển, bạn có thể đảm bảo tính nhất quán giữa hai giao diện và cung cấp trải nghiệm người dùng tốt nhất.
  
  ## Tài liệu tham khảo
  
  - [React Documentation](https://reactjs.org/docs/getting-started.html)
  - [Redux Documentation](https://redux.js.org/introduction/getting-started)
  - [Context API Documentation](https://reactjs.org/docs/context.html)
  - [Material UI Documentation](https://material-ui.com/getting-started/installation/)
  - [Tailwind CSS Documentation](https://tailwindcss.com/docs)
  - [Adapter Pattern](https://refactoring.guru/design-patterns/adapter)
  - [React Hooks API Reference](https://reactjs.org/docs/hooks-reference.html)