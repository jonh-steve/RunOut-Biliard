# Thiết lập Routing cho Client

## Tổng quan

Tài liệu này mô tả quá trình thiết lập routing cho thư mục Client, bao gồm cấu hình routes, route guards và cách tổ chức cấu trúc routing.

## Cấu trúc Routing

### Các file chính

1. **routes.client.js**: Chứa cấu hình tất cả các routes của ứng dụng
2. **RouterConfig.jsx**: Component cấu hình và khởi tạo router
3. **AuthGuard.jsx**: Component bảo vệ các routes yêu cầu xác thực
4. **GuestGuard.jsx**: Component bảo vệ các routes chỉ dành cho khách

### Phân loại Routes

Routes được tổ chức theo layout:

1. **Main Layout**: Các trang công khai (home, about, products, cart, v.v.)
2. **Auth Layout**: Các trang xác thực (login, register, forgot password, v.v.)
3. **Dashboard Layout**: Các trang tài khoản (profile, orders, addresses, v.v.)

## So sánh với User

### Cấu trúc Routes

Cấu trúc routes giữa User và Client về cơ bản là giống nhau, với một số cải tiến nhỏ:

- Tổ chức pages theo thư mục rõ ràng hơn (auth/, account/)
- Thêm comments và documentation
- Cải thiện cách đặt tên và tổ chức code

### Route Guards

Cả hai phiên bản đều sử dụng hai loại guards:

1. **AuthGuard**: Bảo vệ các routes yêu cầu người dùng đã đăng nhập
2. **GuestGuard**: Bảo vệ các routes chỉ dành cho người dùng chưa đăng nhập

## Cách sử dụng

### Cấu hình Routes

```jsx
// Thêm route mới
const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // Thêm route mới vào đây
      { path: '/new-page', element: <NewPage /> },
    ],
  },
  // ...
];
```

### Bảo vệ Route

```jsx
// Bảo vệ route yêu cầu xác thực
{
  path: '/protected-page',
  element: (
    <AuthGuard>
      <ProtectedPage />
    </AuthGuard>
  ),
}

// Bảo vệ route chỉ dành cho khách
{
  path: '/guest-only',
  element: (
    <GuestGuard>
      <GuestOnlyPage />
    </GuestGuard>
  ),
}
```

### Sử dụng trong App.js

```jsx
import RouterConfig from './routing/RouterConfig';

function App() {
  return (
    <AuthProvider>
      <RouterConfig />
    </AuthProvider>
  );
}
```

## Các tính năng

### Redirect sau khi đăng nhập

- Khi người dùng cố gắng truy cập một trang được bảo vệ, họ sẽ được chuyển hướng đến trang đăng nhập
- Sau khi đăng nhập thành công, họ sẽ được chuyển hướng trở lại trang ban đầu
- Điều này được thực hiện bằng cách lưu trữ URL gốc trong location state

### Nested Routes

- Sử dụng nested routes để tổ chức các trang theo layout
- Mỗi layout có thể có nhiều trang con
- Điều này giúp tránh lặp lại code layout cho mỗi trang

### Lazy Loading

Để cải thiện hiệu suất, chúng ta có thể thêm lazy loading cho các routes:

```jsx
import React, { lazy, Suspense } from 'react';
import LoadingScreen from '../components/common/LoadingScreen';

// Lazy load components
const HomePage = lazy(() => import('../pages/HomePage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
// ...

// Wrap with Suspense
const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { 
        path: '/', 
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <HomePage />
          </Suspense>
        ) 
      },
      // ...
    ],
  },
  // ...
];
```

## Lưu ý khi chuyển đổi

1. **Đảm bảo tất cả các routes được chuyển đổi**:
   - Kiểm tra kỹ tất cả các routes trong User và đảm bảo chúng được chuyển sang Client
   - Đảm bảo các route guards hoạt động chính xác

2. **Kiểm tra các edge cases**:
   - Xử lý đúng các trường hợp redirect
   - Xử lý đúng các trường hợp 404
   - Xử lý đúng các trường hợp refresh token

3. **Tối ưu hóa hiệu suất**:
   - Sử dụng lazy loading cho các components lớn
   - Sử dụng memoization để tránh re-renders không cần thiết

## Các cải tiến có thể thực hiện trong tương lai

1. **Route-based code splitting**: Tự động lazy load tất cả các routes
2. **Route transitions**: Thêm animations khi chuyển đổi giữa các routes
3. **Route analytics**: Theo dõi navigation patterns của người dùng
4. **Breadcrumbs**: Tự động tạo breadcrumbs dựa trên route hierarchy
5. **Permission-based routing**: Mở rộng AuthGuard để hỗ trợ permissions