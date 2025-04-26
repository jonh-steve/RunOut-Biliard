# Hướng dẫn Di chuyển Tệp từ RunOut sang steve

## Giới thiệu

Tài liệu này hướng dẫn quá trình di chuyển tệp từ cấu trúc thư mục cũ (RunOut) sang cấu trúc thư mục mới (steve). Hướng dẫn này bao gồm cách sử dụng các script tự động hóa được cung cấp để thực hiện việc di chuyển an toàn và hiệu quả.

## Tổng quan quá trình di chuyển

Quá trình di chuyển bao gồm các bước chính sau:

1. **Chuẩn bị**: Tạo backup của thư mục RunOut và tạo cấu trúc thư mục mới trong steve
2. **Di chuyển tệp**: Sử dụng các script shell để di chuyển tệp từ RunOut sang steve
3. **Kiểm tra**: Xác minh tất cả các tệp đã được di chuyển đúng vị trí
4. **Cập nhật tham chiếu**: Cập nhật các đường dẫn tham chiếu trong mã nguồn
5. **Kiểm thử**: Kiểm tra chức năng của dự án sau khi di chuyển

## Các script di chuyển

Các script shell sau đây được cung cấp để tự động hóa quá trình di chuyển:

- **move-ui-files.sh**: Di chuyển các tệp UI (client, user, admin)
- **move-api-files.sh**: Di chuyển các tệp API (server)
- **move-config-files.sh**: Di chuyển các tệp cấu hình
- **move-all-files.sh**: Di chuyển tất cả các tệp (chạy tất cả các script trên)

Tất cả các script đều nằm trong thư mục `/steve/scripts/migration/`.

## Cách sử dụng các script

### Chuẩn bị

Trước khi bắt đầu, hãy đảm bảo bạn đã:

1. Tạo backup của toàn bộ thư mục RunOut
2. Cài đặt quyền thực thi cho các script

```bash
# Tạo backup
cp -r RunOut RunOut_backup_$(date +"%Y%m%d")

# Cài đặt quyền thực thi
chmod +x steve/scripts/migration/*.sh
```

### Di chuyển tất cả các tệp

Để di chuyển tất cả tệp cùng một lúc, sử dụng script move-all-files.sh:

```bash
cd steve/scripts/migration
./move-all-files.sh
```

### Di chuyển từng nhóm tệp

Nếu muốn di chuyển từng nhóm tệp riêng biệt:

```bash
# Di chuyển tệp UI
./move-ui-files.sh

# Di chuyển tệp API
./move-api-files.sh

# Di chuyển tệp cấu hình
./move-config-files.sh
```

## Chi tiết quá trình di chuyển

### 1. Di chuyển tệp UI (move-ui-files.sh)

Script này di chuyển các tệp UI từ các thư mục Admin, User, Client, và src trong RunOut sang cấu trúc thư mục tương ứng trong steve.

Các tệp được di chuyển bao gồm:
- Components
- Pages
- Assets (CSS, JS, hình ảnh)
- Services
- Controllers
- Hooks

Ví dụ:
- `RunOut/Admin/src/components/` → `steve/apps/admin/src/components/`
- `RunOut/User/src/pages/` → `steve/apps/user/src/pages/`
- `RunOut/client/src/` → `steve/apps/client/src/`
- `RunOut/src/components/` → `steve/common/components/`

### 2. Di chuyển tệp API (move-api-files.sh)

Script này di chuyển các tệp backend API từ thư mục Server trong RunOut sang cấu trúc thư mục server trong steve.

Các tệp được di chuyển bao gồm:
- Controllers
- Models
- Routes
- Middlewares
- Configs
- Utils

Ví dụ:
- `RunOut/Server/controllers/` → `steve/apps/server/controllers/`
- `RunOut/Server/models/` → `steve/apps/server/models/`
- `RunOut/Server/routes/` → `steve/apps/server/routes/`

### 3. Di chuyển tệp cấu hình (move-config-files.sh)

Script này di chuyển các tệp cấu hình từ thư mục gốc RunOut và các thư mục khác sang thư mục config trong steve.

Các tệp được di chuyển bao gồm:
- .env files
- ESLint và Prettier configs
- Docker configs
- Package.json

Ví dụ:
- `RunOut/.env.development` → `steve/config/.env.development`
- `RunOut/.eslintrc.js` → `steve/config/.eslintrc.js`
- `RunOut/docker-compose.yml` → `steve/config/docker-compose.yml`

## Xử lý các tình huống đặc biệt

### Xử lý tệp trùng lặp

Trong trường hợp phát hiện tệp trùng lặp (như validators xuất hiện ở nhiều nơi), script sẽ:
1. Di chuyển tệp đầu tiên được tìm thấy vào thư mục common
2. Tạo liên kết tượng trưng (symlink) từ các vị trí khác đến tệp trong common

### Xử lý tệp bị lock

Nếu một tệp đang được sử dụng và không thể di chuyển:
1. Script sẽ thử lại sau 5 giây
2. Nếu vẫn không thành công, thông báo lỗi và tiếp tục với tệp khác

### Cập nhật đường dẫn tham chiếu

Sau khi di chuyển, các tham chiếu đường dẫn trong mã nguồn sẽ được cập nhật tự động bằng cách:
1. Tìm kiếm tất cả các tham chiếu đến đường dẫn cũ
2. Thay thế bằng đường dẫn mới tương ứng

## Khôi phục từ backup

Nếu gặp sự cố trong quá trình di chuyển, bạn có thể khôi phục từ backup:

```bash
# Xóa thư mục steve hiện tại (nếu cần)
rm -rf steve

# Khôi phục RunOut từ backup
cp -r RunOut_backup_YYYYMMDD RunOut
```

## Kiểm tra sau khi di chuyển

Sau khi di chuyển, hãy kiểm tra:

1. **Tính đầy đủ của tệp**: Đảm bảo tất cả tệp đã được di chuyển
   ```bash
   # Kiểm tra số lượng tệp
   find RunOut -type f | wc -l
   find steve -type f | wc -l
   ```

2. **Chức năng của ứng dụng**: Chạy các ứng dụng để đảm bảo chúng vẫn hoạt động:
   ```bash
   # Chạy server
   cd steve/apps/server
   npm start
   
   # Chạy client
   cd steve/apps/client
   npm start
   ```

3. **Kiểm tra log**: Kiểm tra log sau di chuyển (được tạo bởi các script) để phát hiện bất kỳ vấn đề nào:
   ```bash
   cat steve/scripts/migration/logs/migration-$(date +"%Y%m%d").log
   ```

## Khắc phục sự cố

### Vấn đề thường gặp và cách giải quyết

1. **Tệp không tìm thấy sau khi di chuyển**:
   - Kiểm tra log migration để xem tệp đã được di chuyển đến đâu
   - Kiểm tra xem tệp có trong backup không

2. **Lỗi đường dẫn sau khi di chuyển**:
   - Chạy script cập nhật đường dẫn
   ```bash
   ./scripts/migration/update-paths.sh
   ```

3. **Ứng dụng không chạy được sau khi di chuyển**:
   - Kiểm tra các phụ thuộc trong package.json
   - Chạy npm install trong thư mục ứng dụng tương ứng

## Tài liệu liên quan

- [Hướng dẫn cấu trúc thư mục](/steve/docs/folder-structure-guide.md)
- [Hướng dẫn thiết lập dự án](/steve/docs/setup-guide.md)
- [Tổng quan và hướng dẫn sử dụng dự án](/steve/docs/project-overview-and-usage.md)