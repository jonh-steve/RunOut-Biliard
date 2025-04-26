# Chuyển đổi Loader Component

## Tổng quan

Tài liệu này mô tả quá trình chuyển đổi Loader Component từ thư mục User (sử dụng Material UI) sang thư mục Client (sử dụng Tailwind CSS).

## So sánh

### Loader Component từ User (Material UI)

Loader Component từ User sử dụng:
- Material UI `CircularProgress` làm thành phần cơ bản
- Material UI `Typography` cho văn bản
- Material UI `makeStyles` để tạo và quản lý styles
- Các tùy chọn cho kích thước, màu sắc và vị trí

### Loader Component cho Client (Tailwind CSS)

Loader Component cho Client sử dụng:
- HTML native elements (`div`, `p`)
- Tailwind CSS classes để styling
- CSS animation thông qua Tailwind's `animate-spin`
- Cấu trúc DOM đơn giản hơn

## Các thay đổi chính

1. **Thay đổi về cấu trúc**:
   - Thay thế `CircularProgress` bằng `div` với border và animation
   - Thay thế `Typography` bằng thẻ `p` với các class Tailwind tương ứng

2. **Thay đổi về styling**:
   - Chuyển từ Material UI styles sang Tailwind CSS classes
   - Sử dụng utility classes của Tailwind cho colors, sizes, spacing, v.v.
   - Sử dụng Tailwind's animation utilities thay vì Material UI's CircularProgress

3. **Thay đổi về behavior**:
   - Giữ nguyên logic xử lý các props
   - Giữ nguyên các tùy chọn cho kích thước, màu sắc và vị trí

## Các props được hỗ trợ

Cả hai phiên bản đều hỗ trợ các props sau:

| Prop | Kiểu dữ liệu | Mô tả |
|------|--------------|-------|
| size | string | Kích thước của loader (small, medium, large) |
| color | string | Màu sắc của loader (primary, secondary) |
| text | string | Văn bản hiển thị bên dưới loader |
| fullPage | boolean | Hiển thị loader trên toàn màn hình |
| inline | boolean | Hiển thị loader inline với các phần tử khác |

## Ví dụ sử dụng

```jsx
// Sử dụng Loader component
import Loader from './Loader';

function LoadingExample() {
  return (
    <div>
      {/* Loader cơ bản */}
      <Loader />
      
      {/* Loader với text */}
      <Loader text="Đang tải dữ liệu..." />
      
      {/* Loader với kích thước khác nhau */}
      <Loader size="small" />
      <Loader size="medium" />
      <Loader size="large" />
      
      {/* Loader với màu sắc khác nhau */}
      <Loader color="primary" />
      <Loader color="secondary" />
      
      {/* Loader inline */}
      <div>
        <span>Đang tải: </span>
        <Loader inline size="small" />
      </div>
      
      {/* Loader toàn màn hình */}
      <Loader fullPage text="Đang xử lý..." />
    </div>
  );
}
```

## Lưu ý khi chuyển đổi

1. **Hiệu ứng quay**:
   - Material UI sử dụng `CircularProgress` component với animation được xây dựng sẵn
   - Trong phiên bản Tailwind, chúng ta sử dụng CSS border và `animate-spin` để tạo hiệu ứng tương tự
   - Đảm bảo animation mượt mà và không gây ảnh hưởng đến hiệu suất

2. **Fullpage loader**:
   - Khi hiển thị loader toàn màn hình, cần đảm bảo nó có z-index cao để hiển thị trên tất cả các phần tử khác
   - Thêm backdrop để làm mờ nội dung phía sau
   - Đảm bảo không cho phép scroll khi loader đang hiển thị

3. **Accessibility**:
   - Cân nhắc thêm các thuộc tính ARIA như `aria-busy="true"` và `aria-live="polite"`
   - Đảm bảo text mô tả rõ ràng cho người dùng screen reader

## Các cải tiến có thể thực hiện trong tương lai

1. Thêm các loại loader khác (linear, dots, skeleton)
2. Thêm hỗ trợ cho các hiệu ứng animation khác nhau
3. Thêm tùy chọn để tùy chỉnh độ trong suốt của backdrop
4. Tạo context provider để quản lý global loading state