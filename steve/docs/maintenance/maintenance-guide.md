# Hướng dẫn Bảo Trì Dự Án RunOut

## Giới thiệu

Tài liệu này cung cấp hướng dẫn và quy trình bảo trì cho dự án RunOut. Việc bảo trì thường xuyên giúp đảm bảo hiệu suất, bảo mật và độ tin cậy của hệ thống.

## Lịch bảo trì định kỳ

### Hàng tuần
- Kiểm tra log hệ thống trên các máy chủ
- Kiểm tra thời gian phản hồi và tính khả dụng của API
- Giám sát sử dụng tài nguyên (CPU, bộ nhớ, đĩa)

### Hàng tháng
- Cập nhật thư viện và package không quan trọng
- Tối ưu hóa cơ sở dữ liệu và xóa dữ liệu tạm
- Chạy kiểm tra hiệu suất tổng thể

### Hằng quý
- Cập nhật các thư viện và package quan trọng
- Rà soát và kiểm tra bảo mật
- Kiểm tra và tối ưu backup/restore

## Quy trình kiểm tra mã nguồn

### Sử dụng công cụ t�� /tools

Dự án RunOut có một số công cụ hữu ích trong thư mục `tools/` để kiểm tra và phân tích mã nguồn:

#### 1. Kiểm tra tính nhất quán của component

```bash
cd steve/tools
node component-consistency-checker.js --path="../apps/client/src/components"
```

Công cụ này sẽ:
- Kiểm tra sự nhất quán giữa các component
- Phát hiện các props và tên biến không nhất quán
- Xác định style và pattern không đồng nhất

#### 2. Phân tích API

```bash
cd steve/tools
node api-analyzer.js --path="../apps/server/routes"
```

Công cụ này sẽ:
- Liệt kê tất cả các API endpoints
- Xác định các điểm có tiềm năng về hiệu suất
- Kiểm tra tính nhất quán của API response

#### 3. Phân tích cấu trúc thư mục

```bash
cd steve/tools
node folder-structure-analyzer.js --path="../"
```

Công cụ này tạo báo cáo về cấu trúc thư mục và đề xuất cải tiến.

### Kiểm tra chất lượng mã

#### Chạy ESLint

```bash
# Cho client
cd steve/apps/client
npm run lint

# Cho server
cd steve/apps/server
npm run lint
```

Sửa lỗi ESLint tự động khi có thể:

```bash
npm run lint -- --fix
```

#### Chạy Prettier

```bash
# Kiểm tra định dạng
npx prettier --check "src/**/*.{js,jsx,ts,tsx}"

# Tự động định dạng
npx prettier --write "src/**/*.{js,jsx,ts,tsx}"
```

## Cập nhật thư viện

### Kiểm tra thư viện đã lỗi thời

```bash
# Sử dụng npm-check để tìm các package đã lỗi thời
npx npm-check

# Hoặc chi tiết hơn
npx npm-check -u
```

### Cập nhật thư viện

```bash
# Cập nhật các dependencies nhỏ
npm update

# Cập nhật các dependencies lớn
npm outdated  # Kiểm tra trước
```

Quy trình cập nhật an toàn:
1. Tạo nhánh Git mới cho việc cập nhật
2. Cập nhật từng package một
3. Chạy kiểm thử sau mỗi cập nhật
4. Triển khai lên môi trường staging trước production

## Giám sát và xử lý sự cố

### Giám sát với PM2

```bash
# Kiểm tra trạng thái
pm2 status

# Xem logs
pm2 logs

# Giám sát thời gian thực
pm2 monit
```

### Kiểm tra log

Các vị trí log quan trọng:
- Logs ứng dụng: `/var/log/runout/app.log`
- Logs Nginx: `/var/log/nginx/access.log` và `/var/log/nginx/error.log`
- Logs Docker: `docker-compose logs`

### Quy trình xử lý sự cố

1. **Nhận diện**: Xác định vấn đề qua log hoặc hệ thống giám sát
2. **Phân loại**: Đánh giá mức độ nghiêm trọng và phạm vi ảnh hưởng
3. **Khắc phục tạm thời**: Áp dụng giải pháp ngắn hạn để khôi phục dịch vụ
4. **Phân tích nguyên nhân gốc**: Tìm hiểu nguyên nhân chính của vấn đề
5. **Giải pháp lâu dài**: Triển khai sửa chữa vĩnh viễn
6. **Tài liệu hóa**: Ghi lại vấn đề và giải pháp để tham khảo trong tương lai

## Quản lý cơ sở dữ liệu

### Sao lưu cơ sở dữ liệu

```bash
# Sao lưu MongoDB tự động
mongodump --uri="mongodb://username:password@localhost:27017/runout" --out=/backup/mongodb/$(date +"%Y-%m-%d")

# Nén file sao lưu
tar -zcvf /backup/mongodb/runout-$(date +"%Y-%m-%d").tar.gz /backup/mongodb/$(date +"%Y-%m-%d")
```

### Tối ưu hóa cơ sở dữ liệu

```bash
# Kết nối MongoDB shell
mongo mongodb://username:password@localhost:27017/runout

# Kiểm tra kích thước collection
db.getCollectionNames().forEach(function(collectionName) {
    var size = db[collectionName].stats().size / (1024 * 1024);
    print(collectionName + ": " + size.toFixed(2) + " MB");
});

# Compact và defragment database
db.runCommand({ compact: "products" })
```

### Quản lý indexes

```bash
# Kiểm tra indexes hiện có
db.products.getIndexes()

# Tạo index mới
db.products.createIndex({ name: 1 })

# Xóa index không cần thiết
db.products.dropIndex({ rarely_used_field: 1 })
```

## Kiểm tra bảo mật định kỳ

### Công cụ kiểm tra bảo mật

```bash
# Kiểm tra các dependency có lỗ hổng
npm audit

# Sửa chữa tự động khi có thể
npm audit fix
```

### Danh sách kiểm tra bảo mật

1. Kiểm tra xác thực và phân quyền
   - Đảm bảo JWT hoạt động đúng
   - Xác minh phân quyền hoạt động chính xác
   
2. Kiểm tra bảo mật API
   - Đảm bảo các rate limiter hoạt động
   - Xác nhận validation đầu vào đang hoạt động
   
3. Kiểm tra cấu hình CORS và CSP
   - Kiểm tra cấu hình CORS trong server.js
   - Xác nhận header CSP được thiết lập đúng

4. Kiểm tra TLS/SSL
   - Xác nhận chứng chỉ SSL còn hiệu lực
   - Đảm bảo các giao thức không an toàn bị vô hiệu hóa

## Tài liệu bổ sung

- [API Reference](/steve/docs/api-reference.md)
- [Deployment Guide](/steve/docs/deployment-guide.md)
- [Security Guidelines](/steve/docs/security-guidelines.md)