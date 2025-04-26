# Tài Liệu Tham Khảo API

## Tổng Quan
Tài liệu này mô tả các endpoints API có sẵn trong hệ thống RunOut. API được tổ chức thành các nhóm dịch vụ khác nhau (user, product, order, etc.) và tuân theo các nguyên tắc RESTful.

## Xác Thực
Tất cả các API (trừ login/register) yêu cầu JWT token trong header:

```
Authorization: Bearer <token>
```

Token có thể lấy từ `/auth/login` endpoint.

## User API

### GET /api/users
- **Mô tả**: Lấy danh sách người dùng (chỉ admin)
- **Query params**:
  - `page`: Số trang (mặc định: 1)
  - `limit`: Số lượng kết quả mỗi trang (mặc định: 10)
- **Response**:
  ```json
  {
    "users": [
      {
        "id": "1",
        "email": "user@example.com",
        "name": "User Name",
        "role": "user",
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 10
  }
  ```

### GET /api/users/:id
- **Mô tả**: Lấy thông tin người dùng cụ thể
- **Params**:
  - `id`: ID người dùng
- **Response**:
  ```json
  {
    "id": "1",
    "email": "user@example.com",
    "name": "User Name",
    "role": "user",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "address": "123 Main St",
    "phone": "123-456-7890"
  }
  ```

## Product API

### GET /api/products
- **Mô tả**: Lấy danh sách sản phẩm
- **Query params**:
  - `page`: Số trang (mặc định: 1)
  - `limit`: Số lượng kết quả mỗi trang (mặc định: 10)
  - `category`: ID danh mục (tùy chọn)
  - `brand`: ID thương hiệu (tùy chọn)
  - `sort`: Sắp xếp (price_asc, price_desc, newest) (tùy chọn)
  - `search`: Từ khóa tìm kiếm (tùy chọn)
- **Response**:
  ```json
  {
    "products": [
      {
        "id": "1",
        "name": "Product Name",
        "price": 99.99,
        "description": "Product description",
        "images": ["url1", "url2"],
        "category": {
          "id": "1",
          "name": "Category"
        },
        "brand": {
          "id": "1",
          "name": "Brand"
        },
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 10
  }
  ```

### GET /api/products/:id
- **Mô tả**: Lấy thông tin sản phẩm cụ thể
- **Params**:
  - `id`: ID sản phẩm
- **Response**:
  ```json
  {
    "id": "1",
    "name": "Product Name",
    "price": 99.99,
    "description": "Product description",
    "images": ["url1", "url2"],
    "category": {
      "id": "1",
      "name": "Category"
    },
    "brand": {
      "id": "1",
      "name": "Brand"
    },
    "specs": {
      "weight": "1kg",
      "dimensions": "10x10x10cm"
    },
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z",
    "stock": 100,
    "relatedProducts": [
      {
        "id": "2",
        "name": "Related Product",
        "price": 89.99,
        "images": ["url1"]
      }
    ]
  }
  ```

## Order API

### POST /api/orders
- **Mô tả**: T��o đơn hàng mới
- **Request body**:
  ```json
  {
    "items": [
      {
        "productId": "1",
        "quantity": 2
      }
    ],
    "shippingAddress": {
      "street": "123 Main St",
      "city": "City",
      "state": "State",
      "zip": "12345",
      "country": "Country"
    },
    "paymentMethod": "credit_card"
  }
  ```
- **Response**:
  ```json
  {
    "id": "1",
    "items": [
      {
        "product": {
          "id": "1",
          "name": "Product Name",
          "price": 99.99,
          "image": "url1"
        },
        "quantity": 2,
        "price": 99.99,
        "total": 199.98
      }
    ],
    "subtotal": 199.98,
    "tax": 16.00,
    "shipping": 5.00,
    "total": 220.98,
    "status": "pending",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
  ```

## Các Best Practices
1. Sử dụng pagination cho tất cả API trả về danh sách
2. Luôn xác thực token và kiểm tra quyền trước khi xử lý request
3. Đảm bảo validation đầy đủ cho tất cả input
4. Luôn trả về HTTP status code phù hợp (200, 201, 400, 401, 403, 404, 500)
5. Sử dụng error response format thống nhất:
   ```json
   {
     "error": {
       "code": "INVALID_INPUT",
       "message": "Invalid input data",
       "details": ["Field 'name' is required"]
     }
   }
   ```

## Sử Dụng API Client
Dự án cung cấp API client được xây dựng sẵn tại `/giai-doan-2-xay-dung-nen-tang/2.1-service-api/api-client.js`. Cách sử dụng:

```javascript
import { apiClient } from 'path/to/api-client';

// Lấy danh sách sản phẩm
apiClient.products.getAll({ page: 1, limit: 10 })
  .then(response => console.log(response))
  .catch(error => console.error(error));

// Lấy chi tiết sản phẩm
apiClient.products.getById('123')
  .then(response => console.log(response))
  .catch(error => console.error(error));
```
</qodoArtifact>

3. **Cập nhật tài liệu migration**: