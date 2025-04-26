# Hướng dẫn Thiết lập Dự án

## Mục lục
1. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
2. [Cài đặt môi trường phát triển](#cài-đặt-môi-trường-phát-triển)
3. [Cấu hình dự án](#cấu-hình-dự-án)
4. [Chạy dự án](#chạy-dự-án)
5. [Sử dụng Docker](#sử-dụng-docker)
6. [Khắc phục sự cố](#khắc-phục-sự-cố)

## Yêu cầu hệ thống

Để phát triển và chạy dự án RunOut, bạn cần:

- **Node.js**: v14.x hoặc cao hơn
- **npm**: v6.x hoặc cao hơn
- **MongoDB**: v4.4 hoặc cao hơn
- **Git**: Phiên bản mới nhất
- **Docker** (tùy chọn): Nếu bạn muốn sử dụng container

## Cài đặt môi trường phát triển

### 1. Cài đặt Node.js và npm

Tải và cài đặt Node.js từ [trang chủ Node.js](https://nodejs.org/).

Kiểm tra cài đặt:
```bash
node --version
npm --version
```

### 2. Cài đặt MongoDB

#### Linux
```bash
sudo apt update
sudo apt install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

#### macOS (sử dụng Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Windows
Tải và cài đặt MongoDB từ [trang chủ MongoDB](https://www.mongodb.com/try/download/community).

### 3. Clone dự án

```bash
git clone <repository-url>
cd steve
```

## Cấu hình dự án

### 1. Cấu hình biến môi trường

Sao chép tệp môi trường mẫu:

```bash
cp config/.env.example config/.env
```

Chỉnh sửa tệp `.env` với các thông tin cấu hình của bạn:

```
# Cấu hình cơ sở dữ liệu
MONGODB_URI=mongodb://localhost:27017/runout

# Cấu hình JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRES_IN=7d

# Cấu hình Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Cấu hình email
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=your_email@example.com
MAIL_PASS=your_email_password
```

### 2. Cài đặt các phụ thuộc

#### Backend API
```bash
cd steve/api
npm install
```

#### Frontend Client
```bash
cd steve/ui/client
npm install
```

#### Admin Panel
```bash
cd steve/ui/admin
npm install
```

## Chạy dự án

### 1. Ch��y Backend API

```bash
cd steve/api
npm run start
```

Hoặc chạy trong chế độ phát triển:
```bash
npm run dev
```

API sẽ chạy tại `http://localhost:5000`.

### 2. Chạy Frontend Client

```bash
cd steve/ui/client
npm run start
```

Frontend sẽ chạy tại `http://localhost:3000`.

### 3. Chạy Admin Panel

```bash
cd steve/ui/admin
npm run start
```

Admin panel sẽ chạy tại `http://localhost:3001`.

## Sử dụng Docker

Dự án bao gồm cấu hình Docker để dễ dàng thiết lập và chạy.

### 1. Xây dựng và chạy container

```bash
docker-compose up
```

Điều này sẽ khởi động tất cả các dịch vụ cần thiết:
- MongoDB tại cổng 27017
- Backend API tại cổng 5000
- Frontend Client tại cổng 3000
- Admin Panel tại cổng 3001

### 2. Chạy trong nền

```bash
docker-compose up -d
```

### 3. Dừng container

```bash
docker-compose down
```

## Khắc phục sự cố

### Vấn đề kết nối cơ sở dữ liệu

Nếu bạn gặp lỗi kết nối MongoDB:

1. Kiểm tra MongoDB đang chạy:
   ```bash
   sudo systemctl status mongodb
   ```

2. Kiểm tra chuỗi kết nối trong tệp `.env`

3. Đảm bảo cổng MongoDB (27017) không bị chặn bởi tường lửa

### Lỗi "Module not found"

Nếu bạn gặp lỗi module không tìm thấy:

1. Đảm bảo bạn đã cài đặt tất cả các phụ thuộc:
   ```bash
   npm install
   ```

2. Kiểm tra phiên bản Node.js và npm

3. Xóa thư mục `node_modules` và tệp `package-lock.json`, sau đó cài đặt lại:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Lỗi cổng đã được sử dụng

Nếu bạn gặp lỗi "Port already in use":

1. Tìm và kết thúc quy trình đang sử dụng cổng:
   ```bash
   # Tìm quy trình
   lsof -i :3000
   
   # Kết thúc quy trình
   kill -9 <PID>
   ```

2. Hoặc thay đổi cổng trong tệp cấu hình