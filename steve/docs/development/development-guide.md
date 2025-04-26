# Hướng dẫn Phát triển Dự án RunOut

## Giới thiệu

Tài liệu này cung cấp hướng dẫn về quy trình phát triển, các tiêu chuẩn mã nguồn và cách làm việc với các thành phần khác nhau trong dự án RunOut.

## Cấu trúc dự án

Dự án RunOut được tổ chức theo cấu trúc sau:

```
steve/
├── apps/                  # Các ứng dụng chính
│   ├── admin/             # Ứng dụng Admin (Angular)
│   ├── client/            # Ứng dụng Client (React)
│   ├── server/            # API Backend (Node.js)
│   └── user/              # Ứng dụng User (Angular)
├── common/                # Mã dùng chung
│   ├── components/        # Components dùng chung
│   ├── services/          # Services dùng chung
│   ├── validators/        # Validators dùng chung
│   └── utils/             # Ti��n ích dùng chung
├── config/                # Cấu hình dự án
├── docs/                  # Tài liệu
├── resources/             # Tài nguyên
│   ├── assets/            # Hình ảnh, CSS, JS
│   └── templates/         # Các template
└── tools/                 # Công cụ phát triển
```

## Quy tắc phát triển

### Tiêu chuẩn mã nguồn

- **JavaScript/TypeScript**: Sử dụng tiêu chuẩn ES6+ và tuân thủ cấu hình ESLint
- **CSS**: Tuân thủ quy tắc BEM và sử dụng các biến CSS
- **Commit**: Sử dụng Conventional Commits để cấu trúc message commit

### Thêm tính năng mới

1. **Tạo nhánh tính năng**: Tạo nhánh mới từ `develop` cho mỗi tính năng:
   ```bash
   git checkout develop
   git pull
   git checkout -b feature/ten-tinh-nang
   ```

2. **Phát triển và kiểm tra**: Phát triển tính năng và đảm bảo nó hoạt động tốt trên môi trường local

3. **Gửi Pull Request**: Tạo Pull Request vào nhánh `develop`

### Sử dụng components

Các components dùng chung được đặt trong thư mục `common/components`. Để sử dụng:

#### Trong React (client):

```jsx
import { Button } from '@common/components/Button';

function MyComponent() {
  return <Button type="primary">Click Me</Button>;
}
```

#### Trong Angular (admin/user):

```typescript
// Import trong module
import { CommonComponentsModule } from '@common/components';

@NgModule({
  imports: [CommonComponentsModule],
  // ...
})
```

```html
<!-- Sử dụng trong template -->
<app-button type="primary">Click Me</app-button>
```

## Services và API

### Gọi API

Sử dụng các service có sẵn để gọi API:

#### Trong React:

```javascript
import { productService } from '@/services/api/productService';

// Lấy danh sách sản phẩm
const fetchProducts = async () => {
  try {
    const products = await productService.getProducts();
    setProducts(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
};
```

#### Trong Angular:

```typescript
import { ProductService } from '@/services/product.service';

constructor(private productService: ProductService) {}

ngOnInit() {
  this.productService.getProducts().subscribe({
    next: (products) => this.products = products,
    error: (error) => console.error('Failed to fetch products:', error)
  });
}
```

### Thêm API mới

1. Tạo route mới trong `apps/server/routes/`:

```javascript
const express = require('express');
const router = express.Router();
const controller = require('../controllers/newFeature');
const { validateNewFeature } = require('../middlewares/validators');

router.get('/', controller.getAll);
router.post('/', validateNewFeature, controller.create);

module.exports = router;
```

2. Tạo controller trong `apps/server/controllers/`:

```javascript
const NewFeature = require('../models/newFeature');

exports.getAll = async (req, res) => {
  try {
    const items = await NewFeature.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newItem = new NewFeature(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

3. Thêm model trong `apps/server/models/`:

```javascript
const mongoose = require('mongoose');

const newFeatureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('NewFeature', newFeatureSchema);
```

4. Đăng ký route trong `apps/server/server.js` hoặc `routes/index.js`:

```javascript
const newFeatureRoutes = require('./routes/newFeature');
app.use('/api/new-feature', newFeatureRoutes);
```

## Xử lý lỗi

- Luôn sử dụng try/catch trong các hàm async
- Sử dụng middleware errorHandler trong Express
- Sử dụng Error Boundary trong React
- Sử dụng HTTP Interceptor trong Angular

## Kiểm thử

### Unit Tests

Viết unit tests cho tất cả các components, services và utils:

```javascript
// Ví dụ Jest test
describe('ProductService', () => {
  it('should fetch products successfully', async () => {
    // Arrange
    const mockProducts = [{ id: 1, name: 'Product 1' }];
    jest.spyOn(api, 'get').mockResolvedValue({ data: mockProducts });
    
    // Act
    const result = await productService.getProducts();
    
    // Assert
    expect(result).toEqual(mockProducts);
    expect(api.get).toHaveBeenCalledWith('/products');
  });
});
```

### E2E Tests

Sử dụng Cypress (client) hoặc Protractor (admin/user) để viết E2E tests.

## Triển khai

Xem [Hướng dẫn triển khai](/steve/docs/deployment-guide.md) để biết thêm chi tiết về quy trình triển khai.

## Tài liệu bổ sung

- [API Reference](/steve/docs/api/api-reference.md)
- [Folder Structure Guide](/steve/docs/development/folder-structure-guide.md)
- [Component Library](/steve/docs/component-library.md)