# Cấu Trúc Thư Mục Mới

## Tổng Quan

Cấu trúc thư mục mới được tổ chức trong thư mục `steve` với mục tiêu:
- Phân chia rõ ràng giữa frontend và backend
- Tách biệt config, utilities, và business logic
- Tổ chức theo chức năng thay vì theo loại tệp
- Đặt tài liệu và công cụ vào thư mục riêng

## Cấu Trúc Chi Tiết

```
steve/
├── api/                      # Backend API
│   ├── controllers/          # API controllers (xử lý logic)
│   │   ├── auth/             # Authentication controllers
│   │   ├── products/         # Product controllers
│   │   ├── users/            # User controllers
│   │   └── ...
│   ├── middlewares/          # Express middlewares
│   │   ├── auth/             # Authentication middlewares
│   │   ├── validation/       # Validation middlewares
│   │   └── ...
│   ├── models/               # Database models
│   │   ├── bill.js           # Bill model
│   │   ��── product.js        # Product model
│   │   ├── user.js           # User model
│   │   └── ...
│   ├── routes/               # API routes
│   │   ├── auth.js           # Auth routes
│   │   ├── products.js       # Product routes
│   │   └── ...
│   ├── services/             # Business logic services
│   │   ├── auth/             # Authentication services
│   │   ├── email/            # Email services
│   │   ├── payment/          # Payment services
│   │   └── ...
│   ├── utils/                # API utilities
│   │   ├── errorHandler.js   # Error handling utilities
│   │   ├── validation.js     # Validation utilities
│   │   └── ...
│   └── server.js             # Main server file
│
├── apps/                     # Main applications
│   ├── admin/                # Admin application
│   │   ├── public/           # Public assets
│   │   ├── src/              # Source code
│   │   │   ├── components/   # UI components
│   │   │   ├── pages/        # Admin pages
│   │   │   ├── services/     # Admin services
│   │   │   └── ...
│   │   ├── index.html        # Main HTML file
│   │   └── ...
│   │
│   ├── client/               # Client application
│   │   ├── public/           # Public assets
│   │   ├── src/              # Source code
│   │   │   ├── components/   # UI components
│   │   │   ├── context/      # React context
│   │   │   ├── hooks/        # Custom hooks
│   │   │   ├── pages/        # Client pages
│   │   │   ├── services/     # Client services
│   │   │   └── ...
│   │   ├── package.json      # Package config
│   │   └── ...
│   │
│   └── user/                 # User application
│       ├── public/           # Public assets
│       ├── src/              # Source code
│       │   ├── components/   # UI components
│       │   ├── pages/        # User pages
│       │   ├── services/     # User services
│       │   └── ...
│       ├── index.html        # Main HTML file
│       └── ...
│
├── common/                   # Shared code
│   ├── components/           # Shared UI components
│   │   ├── Button/           # Button component
│   │   ├── Card/             # Card component
│   │   ├── Form/             # Form components
│   │   └── ...
│   ├── hooks/                # Shared React hooks
│   │   ├── useAuth.js        # Authentication hook
│   │   ├── useForm.js        # Form handling hook
│   │   └── ...
│   ├── services/             # Shared services
│   │   ├── api/              # API services
│   │   ├── auth/             # Authentication services
│   │   └── ...
│   └── utils/                # Shared utilities
│       ├── formatting.js     # Formatting utilities
│       ├── validation.js     # Validation utilities
│       └── ...
│
├── config/                   # Configuration files
│   ├── .eslintrc.js          # ESLint configuration
│   ├── .prettierrc           # Prettier configuration
│   ├── database.js           # Database configuration
│   ├── environment.js        # Environment configuration
│   └── ...
│
├── docs/                     # Documentation
│   ├── api/                  # API documentation
│   │   ├── auth.md           # Auth API docs
│   │   ├── products.md       # Products API docs
│   │   └── ...
│   ├── architecture/         # Architecture documentation
│   │   ├── database-schema.md # Database schema docs
│   │   ├── folder-structure-guide.md # Folder structure guide
│   │   └── ...
│   ├── development/          # Development guides
│   │   ├── code-style.md     # Code style guide
│   │   ├── git-workflow.md   # Git workflow guide
│   │   └── ...
│   ├── migration/            # Migration guides
│   │   ├── file-migration-guide.md # File migration guide
│   │   └── ...
│   ├── deployment-guide.md   # Deployment guide
│   ├── development-guide.md  # Development guide
│   ├── project-overview-and-usage.md # Project overview
│   └── setup-guide.md        # Setup guide
│
├── scripts/                  # Scripts
│   ├── build/                # Build scripts
│   │   ├── build-all.sh      # Build all applications
│   │   ├── build-client.sh   # Build client application
│   │   └── ...
│   ├── deployment/           # Deployment scripts
│   │   ├── deploy-prod.sh    # Production deployment
│   │   ├── deploy-staging.sh # Staging deployment
│   │   └── ...
│   ├── migration/            # Migration scripts
│   │   ├── backup/           # Backup directory
│   │   ├── move-all-files.sh # Move all files
│   │   ├── move-api-files.sh # Move API files
│   │   ├── move-ui-files.sh  # Move UI files
│   │   └── ...
│   └── setup/                # Setup scripts
│       ├── init-db.js        # Initialize database
│       ├── setup-env.sh      # Setup environment
│       └── ...
│
├── static/                   # Static assets
│   ├── fonts/                # Font files
│   ├── images/               # Image files
│   │   ├── logos/            # Logo images
│   │   ├── products/         # Product images
│   │   └── ...
│   ├── styles/               # Global styles
│   │   ├── global.css        # Global CSS
│   ��   ├── themes/           # Theme styles
│   │   └── ...
│   └── vendor/               # Third-party libraries
│       ├── bootstrap/        # Bootstrap
│       ├── jquery/           # jQuery
│       └── ...
│
├── tools/                    # Development tools
│   ├── analyzers/            # Code analyzers
│   │   ├── api-analyzer.js   # API analyzer
│   │   ├── component-analyzer.js # Component analyzer
│   │   └── ...
│   ├── generators/           # Code generators
│   │   ├── component-generator.js # Component generator
│   │   ├── model-generator.js # Model generator
│   │   └── ...
│   └── converters/           # Code converters
│       ├── mui-to-tailwind.js # MUI to Tailwind converter
│       └── ...
│
├── .env.example              # Example environment variables
├── .gitignore                # Git ignore file
├── docker-compose.yml        # Docker Compose configuration
├── package.json              # Root package.json
└── README.md                 # Project README
```

## Mô Tả Thư Mục

### api/

Chứa tất cả mã nguồn liên quan đến backend API. Bao gồm:

- **controllers/**: Xử lý logic cho các API endpoints
- **middlewares/**: Express middlewares cho xác thực, validation, error handling, v.v.
- **models/**: Schema và models cho database (MongoDB)
- **routes/**: Định nghĩa API routes
- **services/**: Business logic và services
- **utils/**: Các tiện ích hỗ trợ cho API
- **server.js**: File chính để khởi động server

### apps/

Chứa mã nguồn cho các ứng dụng chính:

- **admin/**: Ứng dụng quản trị
- **client/**: Ứng dụng người dùng cuối (React)
- **user/**: Ứng dụng quản lý tài khoản

### common/

Chứa mã nguồn được chia sẻ giữa các ứng dụng:

- **components/**: UI components dùng chung
- **hooks/**: React hooks dùng chung
- **services/**: Services dùng chung
- **utils/**: Tiện ích dùng chung

### config/

Chứa tất cả file cấu hình cho dự án:

- **ESLint, Prettier**: Cấu hình linting và formatting
- **Database**: Cấu hình kết nối database
- **Environment**: Cấu hình môi trường (development, production)

### docs/

Chứa tất cả tài liệu cho dự án:

- **api/**: Tài liệu API
- **architecture/**: Tài liệu kiến trúc
- **development/**: Hướng dẫn phát triển
- **migration/**: Hướng dẫn di chuyển
- Các hướng dẫn chính như setup, development, deployment

### scripts/

Chứa các scripts để tự động hóa các tác vụ:

- **build/**: Scripts build
- **deployment/**: Scripts triển khai
- **migration/**: Scripts di chuyển file
- **setup/**: Scripts thiết lập

### static/

Chứa tất cả tài nguyên tĩnh:

- **fonts/**: Font files
- **images/**: Hình ảnh
- **styles/**: CSS và themes
- **vendor/**: Thư viện bên thứ ba

### tools/

Chứa các công cụ phát triển:

- **analyzers/**: Công cụ phân tích mã nguồn
- **generators/**: Công cụ tạo mã tự động
- **converters/**: Công cụ chuyển đổi mã

## Hướng Dẫn Sử Dụng Cấu Trúc Mới

### Thêm Component Mới

1. Xác định loại component:
   - Component dùng chung: Thêm vào `steve/common/components/`
   - Component riêng cho ứng dụng: Thêm vào `steve/apps/<app-name>/src/components/`

2. Tạo thư mục cho component:
   ```
   mkdir -p steve/common/components/NewComponent
   ```

3. Tạo các file cần thiết:
   ```
   touch steve/common/components/NewComponent/index.jsx
   touch steve/common/components/NewComponent/styles.css
   ```

### Thêm API Endpoint Mới

1. Tạo controller mới:
   ```
   mkdir -p steve/api/controllers/newFeature
   touch steve/api/controllers/newFeature/index.js
   ```

2. Tạo model nếu cần:
   ```
   touch steve/api/models/newFeature.js
   ```

3. Tạo route mới:
   ```
   touch steve/api/routes/newFeature.js
   ```

4. Cập nhật server.js để sử dụng route mới

### Lưu Ý Quan Trọng

- **Imports Relativos**: Sử dụng đường dẫn tương đối khi import giữa các files trong cùng một module
- **Módulo Aliases**: Sử dụng aliases như `@common`, `@api` khi import giữa các modules
- **Dependencies**: Mỗi ứng dụng có package.json riêng, nhưng cũng có một root package.json
- **Environment**: Sử dụng các file .env riêng cho từng môi trường

## Kế Hoạch Di Chuyển

Xem chi tiết trong [Hướng Dẫn Di Chuyển Tệp](../migration/file-migration-guide.md).
# Hướng dẫn Cấu trúc Thư mục Dự án RunOut

## Giới thiệu

Tài liệu này mô tả chi tiết cấu trúc thư mục mới của dự án RunOut sau khi tái tổ chức. Cấu trúc mới tập trung vào tính module hóa, khả năng mở rộng và dễ bảo trì.

## Tổng quan cấu trúc thư mục

Cấu trúc thư mục chính trong dự án RunOut sau khi di chuyển sang thư mục `steve`:

```
steve/
├── apps/                # Các ứng dụng chính 
│   ├── admin/           # Ứng dụng quản trị
│   ├── client/          # Ứng dụng khách hàng (React)
│   ├── server/          # Backend API (Node.js)
│   └── user/            # Ứng dụng người dùng (Angular)
├── common/              # Mã nguồn dùng chung
│   ├── components/      # Components dùng chung
│   ├── services/        # Services dùng chung
│   ├── utils/           # Tiện ích dùng chung
│   └── validators/      # Validators dùng chung
├── config/              # Cấu hình chung
├── docs/                # Tài liệu dự án
├── resources/           # Tài nguyên chung
│   ├── assets/          # Asset tĩnh (hình ảnh, fonts)
│   └── templates/       # Templates dùng chung
├── scripts/             # Scripts tự động hóa
│   └── migration/       # Scripts di chuyển tệp
└── tools/               # Công cụ phát triển
```

## Chi tiết cấu trúc từng thư mục

### 1. apps/

Thư mục `apps/` chứa tất cả các ứng dụng chính của dự án, được tổ chức thành các module riêng biệt.

#### 1.1. apps/admin/

```
admin/
├── node_modules/        # Thư viện của admin
├── public/              # Tệp tĩnh công khai
├── src/                 # Mã nguồn chính
│   ├── app.js           # Điểm khởi đầu ứng dụng
│   ├── assets/          # Tài nguyên (CSS, JS, hình ảnh)
│   ├── components/      # Các component
│   ├── controllers/     # Các controller Angular
│   ├── pages/           # Trang giao diện
│   └── services/        # Các service
├── index.html           # Trang chính
├── package.json         # Cấu hình npm
└── README.md            # Tài liệu riêng cho admin
```

#### 1.2. apps/client/

```
client/
├── node_modules/        # Thư viện của client
├── public/              # Tệp tĩnh công khai
├── src/                 # Mã nguồn chính
│   ├── assets/          # Tài nguyên (CSS, hình ảnh)
│   ├── components/      # React components
│   │   ├── common/      # Components dùng chung
│   │   ├── features/    # Components tính năng đặc biệt
│   │   └── layout/      # Components layout
│   ├── context/         # React contexts
│   ├── hooks/           # React hooks
│   ├── pages/           # Các trang
│   ├── services/        # Các service gọi API
│   │   ├── adapters/    # Adapters
│   │   └── api/         # Các service API
│   ├── utils/           # Ti��n ích
│   └── validators/      # Validators
├── package.json         # Cấu hình npm
└── README.md            # Tài liệu riêng cho client
```

#### 1.3. apps/server/

```
server/
├── configs/             # Cấu hình
│   ├── Cloudinary.js    # Cấu hình Cloudinary
│   ├── ConnectDB.js     # Kết nối database
│   └── security.js      # Cấu hình bảo mật
├── controllers/         # Xử lý logic
│   ├── bill.js          # Xử lý đơn hàng
│   ├── product.js       # Xử lý sản phẩm
│   ├── user.js          # Xử lý người dùng
│   └── ...
├── middlewares/         # Middleware
│   ├── ErrorHandler.js  # Xử lý lỗi
│   ├── jwt.js           # Xác thực JWT
│   ├── rateLimit.js     # Giới hạn request
│   ├── validation.js    # Xác thực đầu vào
│   └── validators/      # Validators
├── models/              # Schema database
│   ├── bill.js          # Model đơn hàng  
│   ├── product.js       # Model sản phẩm
│   ├── user.js          # Model người dùng
│   └── ...
├── routes/              # Định tuyến API
│   ├── bill.js          # Route đơn hàng
│   ├── product.js       # Route sản phẩm
│   ├── user.js          # Route người dùng
│   └── ...
├── utils/               # Tiện ích
│   └── sendMail.js      # Gửi email
├── .env                 # Biến môi trường
├── package.json         # Cấu hình npm
└── server.js            # Điểm khởi đầu server
```

#### 1.4. apps/user/

```
user/
├── node_modules/        # Thư viện của user
├── public/              # Tệp tĩnh công khai
├── src/                 # Mã nguồn chính
│   ├── app.js           # Điểm khởi đầu ứng dụng
│   ├── assets/          # Tài nguyên (CSS, JS, hình ảnh)
│   ├── components/      # Các component
│   ├── controllers/     # Các controller Angular
│   ├── pages/           # Trang giao diện
│   └── services/        # Các service
├── index.html           # Trang chính
├── package.json         # Cấu hình npm
└── README.md            # Tài liệu riêng cho user
```

### 2. common/

Thư mục `common/` chứa các thành phần dùng chung có thể sử dụng lại trong nhiều ứng dụng của dự án.

```
common/
├── components/          # Components dùng chung
│   ├── Alert/           # Component thông báo  
│   ├── Button/          # Component nút
│   ├── Card/            # Component thẻ
│   ├── Form/            # Component biểu mẫu
│   ├── Input/           # Component nhập liệu
│   ├── Modal/           # Component hộp thoại
│   └── ...
├── services/            # Services dùng chung
│   ├── auth/            # Service xác thực
│   ├── api/             # Service API
│   └── ...
├── utils/               # Tiện ích dùng chung
│   ├── formatUtils.js   # Định dạng dữ liệu
│   ├── storageUtils.js  # Xử lý lưu trữ
│   ├── validationUtils.js # Xác thực
│   └── ...
└── validators/          # Validators dùng chung
    ├── addressValidator.js
    ├── productValidator.js
    ├── userValidator.js
    └── ...
```

### 3. config/

Thư mục `config/` chứa các cấu hình chung của dự án:

```
config/
├── .env.development     # Biến môi trường phát triển
├── .env.production      # Biến môi trường sản xuất
├── .eslintrc.js         # Cấu hình ESLint
├── .prettierrc          # Cấu hình Prettier
└── docker-compose.yml   # Cấu hình Docker Compose
```

### 4. docs/

Thư mục `docs/` chứa tất cả tài liệu của dự án:

```
docs/
├── api/
│   ├── api-reference.md        # Tài liệu tham khảo API
│   └── api-migration-guide.md  # Hướng dẫn di chuyển API
├── guides/
│   ├── setup-guide.md          # Hướng dẫn thiết lập
│   ├── development-guide.md    # Hướng dẫn phát triển
│   ├── deployment-guide.md     # Hướng dẫn triển khai
│   ├── maintenance-guide.md    # Hướng dẫn bảo trì
│   ├── folder-structure-guide.md # Hướng dẫn cấu trúc thư mục
│   └── file-migration-guide.md # Hướng dẫn di chuyển tệp
├── project-overview-and-usage.md # Tổng quan và hướng dẫn sử dụng
├── sync-plan.md               # Kế hoạch đồng bộ
└── sync-plan-supplement/      # Bổ sung kế hoạch đồng bộ
    ├── ke-hoach-kiem-thu.md
    ├── ke-hoach-trien-khai.md
    └── ...
```

### 5. resources/

Thư mục `resources/` chứa các tài nguyên dùng chung:

```
resources/
├── assets/              # Tài nguyên tĩnh
│   ├── css/             # Stylesheet dùng chung
│   ├── img/             # Hình ảnh dùng chung
│   └── js/              # JavaScript dùng chung
└── templates/           # Các template dùng chung
    ├── email/           # Template email
    └── pdf/             # Template PDF
```

### 6. scripts/

Thư mục `scripts/` chứa các script tự động hóa:

```
scripts/
├── migration/           # Scripts di chuyển tệp
│   ├── move-ui-files.sh      # Di chuyển tệp UI
│   ├── move-api-files.sh     # Di chuyển tệp API
│   ├── move-config-files.sh  # Di chuyển tệp cấu hình
│   └── move-all-files.sh     # Di chuyển tất cả tệp
├── build/               # Scripts build
└── deploy/              # Scripts triển khai
```

### 7. tools/

Thư mục `tools/` chứa các công cụ hỗ trợ phát triển:

```
tools/
├── api-analyzer.js            # Phân tích API
├── component-consistency-checker.js # Kiểm tra tính nhất quán component
├── folder-structure-analyzer.js # Phân tích cấu trúc thư mục
├── route-mapping-tool.js      # Công cụ ánh xạ route
└── state-management-analyzer.js # Phân tích quản lý trạng thái
```

## Quy tắc tổ chức và đặt tên

### Quy tắc chung

1. **Tính module hóa**: Mỗi module đặt trong một thư mục riêng.
2. **Tính tái sử dụng**: Mã nguồn dùng chung đặt trong thư mục `common/`.
3. **Nhất quán về đặt tên**:
   - Thư mục: Sử dụng kebab-case (ví dụ: `form-validation`) hoặc camelCase (ví dụ: `formValidation`)
   - Tệp component: Sử dụng PascalCase (ví dụ: `Button.jsx`, `UserProfile.jsx`)
   - Tệp utility: Sử dụng camelCase (ví dụ: `formatUtils.js`, `apiClient.js`)

### Quy tắc import

1. **Đường dẫn tuyệt đối**: Ưu tiên sử dụng đường dẫn tuyệt đối từ gốc dự án:
   ```javascript
   // Thay vì
   import Button from '../../../common/components/Button';
   
   // Sử dụng
   import Button from '@common/components/Button';
   ```

2. **Thứ tự import**:
   - Thư viện bên ngoài
   - Components
   - Hooks
   - Utils
   - Styles

## Lợi ích của cấu trúc mới

1. **Dễ tìm kiếm**: Tổ chức logic, dễ tìm và xác định thành phần.
2. **Khả năng mở rộng**: Dễ dàng thêm module mới mà không ảnh hưởng đến các module khác.
3. **Tái sử dụng**: Các components, services, utilities dùng chung được tổ chức tốt hơn.
4. **Phát triển song song**: Các nhóm có thể làm việc trên các module khác nhau mà không xung đột.
5. **Dễ bảo trì**: Các thành phần liên quan được nhóm lại, dễ dàng hiểu và bảo trì.

## Hướng dẫn mở rộng

### Thêm tính năng mới

1. **Xác định phạm vi**: Tính năng thuộc về ứng dụng nào (admin, client, user, server).
2. **Tạo module**: Tạo thư mục module trong ứng dụng tương ứng.
3. **Phân chia thành phần**: Components, services, utils, v.v.
4. **Tái sử dụng**: Sử dụng lại các thành phần từ `common/` khi có thể.

### Thêm ứng dụng mới

1. **Tạo thư mục trong `apps/`**: Ví dụ: `apps/mobile/` cho ứng dụng di động.
2. **Thiết lập cấu trúc**: Tuân theo cấu trúc tương tự như các ứng dụng khác.
3. **Tích hợp**: Kết nối với server API và sử dụng lại các thành phần từ `common/`.

## Tài liệu liên quan

- [Hướng dẫn thiết lập dự án](/steve/docs/setup-guide.md)
- [Hướng dẫn phát triển](/steve/docs/development-guide.md)
- [Hướng dẫn di chuyển tệp](/steve/docs/file-migration-guide.md)