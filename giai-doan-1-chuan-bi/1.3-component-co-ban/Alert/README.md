# Chuyển đổi Alert Component

## Tổng quan

Tài liệu này mô tả quá trình chuyển đổi Alert Component từ thư mục User (sử dụng Material UI) sang thư mục Client (sử dụng Tailwind CSS).

## So sánh

### Alert Component từ User (Material UI)

Alert Component từ User sử dụng:
- Material UI `Alert` từ @material-ui/lab làm thành phần cơ bản
- Material UI `AlertTitle` để hiển thị tiêu đề
- Material UI `IconButton` và `CloseIcon` cho nút đóng
- Material UI `Collapse` để tạo hiệu ứng đóng/mở
- Material UI `makeStyles` để tạo và quản lý styles

### Alert Component cho Client (Tailwind CSS)

Alert Component cho Client sử dụng:
- HTML native elements (`div`, `h3`, `button`)
- Tailwind CSS classes để styling
- SVG icons thay cho Material UI icons
- CSS transitions thay cho Collapse component
- Cấu trúc DOM đơn giản hơn

## Các thay đổi chính

1. **Thay đổi về cấu trúc**:
   - Thay thế `Alert` và `AlertTitle` bằng các thẻ HTML semantic
   - Sử dụng flexbox để tạo layout
   - Thay thế `Collapse` bằng cách render có điều kiện (conditional rendering)

2. **Thay đổi về styling**:
   - Chuyển từ Material UI styles sang Tailwind CSS classes
   - Sử dụng utility classes của Tailwind cho colors, padding, margin, border, v.v.
   - Tạo các biến styles dựa trên severity

3. **Thay đổi về icons**:
   - Thay thế Material UI icons bằng SVG icons
   - Tạo object mapping giữa severity và icon tương ứng

4. **Thay đổi về behavior**:
   - Giữ nguyên logic xử lý autoHideDuration
   - Giữ nguyên cách xử lý các props và states

## Các props được hỗ trợ

Cả hai phiên bản đều hỗ trợ các props sau:

| Prop | Kiểu dữ liệu | Mô tả |
|------|--------------|-------|
| severity | string | Mức độ cảnh báo (success, error, warning, info) |
| title | string | Tiêu đề của alert |
| children | node | Nội dung của alert |
| closable | boolean | Có thể đóng alert hay không |
| onClose | function | Hàm xử lý khi alert đóng |
| autoHideDuration | number | Thời gian tự động ẩn alert (ms) |
| show | boolean | Trạng thái hiển thị ban đầu |

## Ví dụ sử dụng

```jsx
// Sử dụng Alert component
import Alert from './Alert';

function NotificationExample() {
  const [showSuccess, setShowSuccess] = useState(true);
  const [showError, setShowError] = useState(true);

  return (
    <div>
      <Alert 
        severity="success" 
        title="Thành công!" 
        closable 
        show={showSuccess}
        onClose={() => setShowSuccess(false)}
      >
        Dữ liệu đã được lưu thành công.
      </Alert>
      
      <Alert 
        severity="error" 
        title="Lỗi!" 
        closable 
        show={showError}
        onClose={() => setShowError(false)}
        autoHideDuration={5000}
      >
        Đã xảy ra lỗi khi lưu dữ liệu. Vui lòng thử lại sau.
      </Alert>
      
      <Alert severity="warning">
        Hãy lưu ý rằng các thay đổi sẽ không được lưu tự động.
      </Alert>
      
      <Alert severity="info">
        Bạn có thể tìm hiểu thêm thông tin trong tài liệu hướng dẫn.
      </Alert>
    </div>
  );
}
```

## Lưu ý khi chuyển đổi

1. **Xử lý animation**:
   - Material UI sử dụng `Collapse` component để tạo hiệu ứng đóng/mở
   - Trong phiên bản Tailwind, chúng ta sử dụng conditional rendering và CSS transitions
   - Có thể cân nhắc sử dụng thư viện như `react-transition-group` nếu cần animation phức tạp hơn

2. **Accessibility**:
   - Đảm bảo thêm `role="alert"` để screen readers có thể nh��n biết
   - Thêm `aria-label` cho nút đóng
   - Sử dụng `sr-only` class cho text chỉ dành cho screen readers

3. **Responsive design**:
   - Đảm bảo alert hiển thị tốt trên các kích thước màn hình khác nhau
   - Cân nhắc điều chỉnh padding, font-size trên mobile

## Các cải tiến có thể thực hiện trong tương lai

1. Thêm hỗ trợ cho các actions khác ngoài nút đóng
2. Thêm hỗ trợ cho các variants khác (outlined, filled)
3. Thêm hỗ trợ cho toast notifications (hiển thị ở góc màn hình)
4. Tạo context provider để quản lý nhiều alerts cùng lúc