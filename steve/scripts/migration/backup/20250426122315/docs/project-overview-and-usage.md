# Tổng quan và Hướng dẫn Sử dụng Dự án

## Giới thiệu

Dự án RunOut là một nền tảng thương mại điện tử toàn diện bao gồm nhiều thành phần:

- **Giao diện người dùng**: Cung cấp trải nghiệm mua sắm trực tuyến
- **Bảng quản trị**: Cho phép quản lý sản phẩm, đơn hàng, người dùng và nội dung
- **Backend API**: Xử lý logic nghiệp vụ và tương tác cơ sở dữ liệu
- **Công cụ hỗ trợ**: Phân tích, chuyển đổi và tối ưu hóa mã nguồn

Dự án đang trong quá trình chuyển đổi từ cấu trúc cũ (RunOut) sang cấu trúc mới được tổ chức tốt hơn (steve).

## Cấu trúc dự án

### Cấu trúc hiện tại (RunOut)

```
RunOut/
├── Admin/                # Bảng quản trị (Angular.js)
├── User/                 # Giao diện người dùng (Angular.js)
├── Server/               # Backend API (Node.js)
├── client/               # Phiên bản React mới của giao diện người dùng
├── src/                  # Mã nguồn React chung
├── tools/                # Công cụ phân tích và chuyển đổi
├── docs/                 # Tài liệu dự án
└── [Các tệp cấu hình]    # .env, .eslintrc.js, docker-compose.yml, v.v.
```

### Cấu trúc mới (steve)

```
steve/
├── ui/                   # Tất cả các thành phần giao diện người dùng
│   ├── admin/            # Bảng quản trị
│   ├── client/           # Giao diện người dùng
│   └── components/       # Thành phần dùng chung
├── api/                  # Backend API và dịch vụ
├── config/               # Tệp cấu hình
├── static/               # Tài nguyên tĩnh (CSS, JS, hình ảnh)
├── validation/           # Logic xác thực
├── utilities/            # Công cụ và tiện ích
└── docs/                 # Tài liệu dự án
```

## Công nghệ sử dụng

- **Frontend**:
  - Angular.js (Admin, User)
  - React (client mới)
  - Bootstrap CSS
  - Chart.js (cho biểu đồ)

- **Backend**:
  - Node.js
  - MongoDB
  - JWT (xác thực)
  - Cloudinary (lưu trữ hình ảnh)

- **DevOps**:
  - Docker (docker-compose.yml)
  - ESLint & Prettier (kiểm tra mã)

## Hướng dẫn sử dụng

### Thiết lập môi trường

1. **Cài đặt các phụ thuộc**:
   ```bash
   # Cài đặt phụ thuộc cho backend
   cd steve/api
   npm install

   # Cài đặt phụ thuộc cho frontend
   cd steve/ui/client
   npm install
   ```

2. **Cấu hình môi trường**:
   - Sao chép `.env.example` thành `.env` trong thư mục `steve/config`
   - Cập nhật các biến môi trường cần thiết (chuỗi kết nối DB, khóa API, v.v.)

3. **Khởi động ứng dụng**:
   ```bash
   # Sử dụng Docker
   docker-compose up

   # Hoặc khởi động thủ công
   # Backend
   cd steve/api
   npm run start

   # Frontend
   cd steve/ui/client
   npm run start
   ```

### Quản lý sản phẩm

1. **Thêm sản phẩm mới**:
   - Đăng nhập vào bảng quản trị tại `/admin`
   - Điều hướng đến "Sản phẩm" > "Thêm mới"
   - Điền thông tin sản phẩm và tải lên hình ảnh
   - Lưu sản phẩm

2. **Quản lý danh mục**:
   - Trong bảng quản trị, điều hướng đến "Danh mục"
   - Thêm, chỉnh sửa hoặc xóa danh mục sản phẩm

### Quản lý đơn hàng

1. **Xem đơn hàng**:
   - Trong bảng quản trị, điều hướng đến "Đơn hàng"
   - Lọc đơn hàng theo trạng thái, ngày hoặc khách hàng

2. **Cập nhật trạng thái đơn hàng**:
   - Nhấp vào đơn hàng để xem chi tiết
   - Thay đổi trạng thái và lưu cập nh��t

### Phát triển

Xem các tài liệu chi tiết trong thư mục `steve/docs`:
- `setup-guide.md`: Hướng dẫn thiết lập môi trường phát triển
- `development-guide.md`: Quy trình phát triển và tiêu chuẩn mã
- `api-reference.md`: Tài liệu API
- `folder-structure-guide.md`: Giải thích cấu trúc thư mục

## Khắc phục sự cố

### Vấn đề kết nối cơ sở dữ liệu
- Kiểm tra chuỗi kết nối trong `.env`
- Đảm bảo MongoDB đang chạy
- Kiểm tra logs trong `steve/api/logs`

### Lỗi xác thực
- Xóa token trong localStorage và đăng nhập lại
- Kiểm tra cấu hình JWT trong `steve/config/security.js`

### Vấn đề tải tài nguyên
- Xóa cache trình duyệt
- Kiểm tra console trình duyệt để tìm lỗi
- Đảm bảo các tệp tĩnh được phục vụ đúng cách

## Liên hệ hỗ trợ

Nếu bạn gặp vấn đề không được đề cập trong tài liệu này, vui lòng liên hệ:
- **Hỗ trợ kỹ thuật**: support@runout.example.com
- **Báo cáo lỗi**: Tạo issue trên hệ thống quản lý dự án