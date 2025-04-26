# Tài liệu hướng dẫn phát triển

## 1. Quy tắc chung

### Cấu trúc thư mục và đặt tên file

- Sử dụng PascalCase cho tên component: `Button.jsx`, `ProductCard.jsx`
- Sử dụng camelCase cho tên file utility và hook: `useAuth.js`, `formatCurrency.js`
- Sử dụng kebab-case cho tên thư mục: `product-list`, `auth-service`
- Mỗi component nên có thư mục riêng với cấu trúc:
  ```
  Button/
  ├── Button.jsx        # Component chính
  ├── Button.test.jsx   # Test file
  ├── Button.module.css # Styles (nếu sử dụng CSS modules)
  └── index.js          # Re-export component
  ```

### Coding style

- Sử dụng functional components và hooks thay vì class components
- Sử dụng destructuring cho props
- Sử dụng named exports thay vì default exports khi có thể
- Sử dụng async/await thay vì promises chains
- Sử dụng optional chaining (`?.`) và nullish coalescing (`??`)

### Quy tắc commit

- Sử dụng conventional commits:
  - `feat:` cho tính năng mới
  - `fix:` cho bug fixes
  - `refactor:` cho refactoring code
  - `docs:` cho thay đổi documentation
  - `test:` cho thêm hoặc sửa tests
  - `chore:` cho các thay đổi khác
- Mỗi commit nên tập trung vào một thay đổi cụ thể
- Commit message nên rõ ràng và mô tả đầy đủ thay đổi

## 2. Hướng dẫn chuyển đổi component

### Quy trình chuyển đổi

1. **Phân tích component gốc**:
   - Xác định props, state, và behaviors
   - Xác định dependencies và side effects
   - Xác định các edge cases

2. **Tạo component mới**:
   - Tạo file mới trong thư mục Client
   - Giữ nguyên tên và props API
   - Chuyển đổi từ Material UI sang Tailwind CSS

3. **Kiểm thử**:
   - Viết unit tests
   - Kiểm tra visual regression
   - Kiểm tra accessibility

4. **Documentation**:
   - Thêm JSDoc comments
   - Cập nhật README nếu cần

### Ví dụ chuyển đổi

#### Component gốc (Material UI)

```jsx
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
  },
}));

const MyButton = ({ children, color = 'primary', ...props }) => {
  const classes = useStyles();
  
  return (
    <Button 
      className={classes.root}
      color={color}
      variant="contained"
      {...props}
    >
      {children}
    </Button>
  );
};

export default MyButton;
```

#### Component mới (Tailwind CSS)

```jsx
import React from 'react';

const colorClasses = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
  success: 'bg-green-600 hover:bg-green-700 text-white',
  error: 'bg-red-600 hover:bg-red-700 text-white',
};

const MyButton = ({ 
  children, 
  color = 'primary', 
  className = '',
  ...props 
}) => {
  return (
    <button 
      className={`px-4 py-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 m-2 ${colorClasses[color] || colorClasses.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default MyButton;
```

## 3. Hướng dẫn sử dụng API

### Cấu trúc service

```javascript
// api-client.js - Cấu hình axios instance
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptors ở đây

export default apiClient;

// user-service.js - Service cụ thể
import apiClient from './api-client';

const UserService = {
  getProfile: async () => {
    return await apiClient.get('/users/profile');
  },
  
  updateProfile: async (data) => {
    return await apiClient.put('/users/profile', data);
  },
  
  // Các methods khác
};

export default UserService;
```

### Xử lý lỗi

```javascript
try {
  const response = await UserService.updateProfile(data);
  // Xử lý response
} catch (error) {
  if (error.response) {
    // Server trả về response với status code nằm ngoài range 2xx
    console.error('Error data:', error.response.data);
    console.error('Error status:', error.response.status);
    
    // Xử lý các status code cụ thể
    if (error.response.status === 401) {
      // Unauthorized - Redirect to login
    } else if (error.response.status === 403) {
      // Forbidden - Show permission error
    } else if (error.response.status === 404) {
      // Not found
    } else {
      // Other errors
    }
  } else if (error.request) {
    // Request đã được gửi nhưng không nhận được response
    console.error('Error request:', error.request);
  } else {
    // Có lỗi khi setting up request
    console.error('Error message:', error.message);
  }
}
```

## 4. Hướng dẫn sử dụng Context API

### Cấu trúc Context

```javascript
// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AuthService from '../services/auth-service';

// Tạo context
const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Các methods và effects
  
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    // Các methods khác
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook để sử dụng context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### Sử dụng Context

```javascript
import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, loading, error, updateProfile } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Please login</div>;
  
  const handleSubmit = async (data) => {
    try {
      await updateProfile(data);
      // Show success message
    } catch (error) {
      // Handle error
    }
  };
  
  return (
    <div>
      <h1>Profile</h1>
      {/* Form và UI khác */}
    </div>
  );
};

export default ProfilePage;
```

## 5. Hướng dẫn testing

### Unit Testing

```javascript
// Button.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button component', () => {
  test('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  test('applies correct color class', () => {
    render(<Button color="secondary">Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toHaveClass('bg-gray-600');
  });
});
```

### Integration Testing

```javascript
// LoginForm.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '../context/AuthContext';
import LoginForm from './LoginForm';
import AuthService from '../services/auth-service';

// Mock the auth service
jest.mock('../services/auth-service');

describe('LoginForm component', () => {
  test('submits form with correct data', async () => {
    // Setup mock
    AuthService.login.mockResolvedValueOnce({ user: { id: 1, name: 'Test User' } });
    
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Assert
    await waitFor(() => {
      expect(AuthService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});
```

## 6. Hướng dẫn performance optimization

### Code splitting

```javascript
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Loading from './components/common/Loading';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
```

### Memoization

```javascript
import React, { useMemo, useCallback } from 'react';

const ExpensiveComponent = ({ data, onItemClick }) => {
  // Memoize expensive calculations
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      fullName: `${item.firstName} ${item.lastName}`,
      total: item.price * item.quantity
    }));
  }, [data]);
  
  // Memoize callbacks
  const handleItemClick = useCallback((id) => {
    console.log(`Item clicked: ${id}`);
    onItemClick(id);
  }, [onItemClick]);
  
  return (
    <div>
      {processedData.map(item => (
        <div key={item.id} onClick={() => handleItemClick(item.id)}>
          {item.fullName}: ${item.total}
        </div>
      ))}
    </div>
  );
};

// Memoize the entire component
export default React.memo(ExpensiveComponent);
```

### Image optimization

```jsx
// Lazy loading images
<img 
  src="large-image.jpg" 
  loading="lazy" 
  alt="Description" 
  width="800" 
  height="600"
/>

// Using responsive images
<picture>
  <source media="(max-width: 600px)" srcSet="small-image.jpg" />
  <source media="(max-width: 1200px)" srcSet="medium-image.jpg" />
  <img src="large-image.jpg" alt="Description" />
</picture>
```

## 7. Checklist chuyển đổi

### Trước khi bắt đầu

- [ ] Đã đọc và hiểu tài liệu hướng dẫn
- [ ] Đã cài đặt các dependencies cần thiết
- [ ] Đã thiết lập môi trường phát triển
- [ ] Đã hiểu rõ component/feature cần chuyển đổi

### Trong quá trình chuyển đổi

- [ ] Giữ nguyên API của component (props, events)
- [ ] Chuyển đổi styles từ Material UI sang Tailwind CSS
- [ ] Đảm bảo responsive trên các kích thước màn hình
- [ ] Đảm bảo accessibility (ARIA attributes, keyboard navigation)
- [ ] Tối ưu hóa performance

### Sau khi chuyển đổi

- [ ] Viết tests cho component mới
- [ ] Kiểm tra visual regression
- [ ] C���p nhật documentation
- [ ] Code review
- [ ] Merge vào codebase chính