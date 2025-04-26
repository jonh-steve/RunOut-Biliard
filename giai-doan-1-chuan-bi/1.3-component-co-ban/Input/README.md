# Chuyển đổi Input Component

## Tổng quan

Tài liệu này mô tả quá trình chuyển đổi Input Component từ thư mục User (sử dụng Material UI) sang thư mục Client (sử dụng Tailwind CSS).

## So sánh

### Input Component từ User (Material UI)

Input Component từ User sử dụng:
- Material UI `TextField` làm thành phần cơ bản
- Material UI `InputAdornment` để thêm các phần tử phụ trợ (icons, buttons)
- Material UI `FormHelperText` để hiển thị thông báo lỗi hoặc gợi ý
- Material UI `makeStyles` để tạo và quản lý styles

### Input Component cho Client (Tailwind CSS)

Input Component cho Client sử dụng:
- HTML native `input` element
- Tailwind CSS classes để styling
- SVG icons thay cho Material UI icons
- Cấu trúc DOM đơn giản hơn

## Các thay đổi chính

1. **Thay đổi về cấu trúc**:
   - Thay thế `TextField` bằng `input` element
   - Tạo cấu trúc DOM riêng cho label, input và helper text
   - Sử dụng `div` với `position: relative` để đ��t các adornments

2. **Thay đổi về styling**:
   - Chuyển từ Material UI styles sang Tailwind CSS classes
   - Sử dụng utility classes của Tailwind cho border, padding, colors, v.v.
   - Thêm các trạng thái hover, focus, disabled thông qua Tailwind variants

3. **Thay đổi về icons**:
   - Thay thế Material UI icons bằng SVG icons
   - Sử dụng Heroicons (được nhúng trực tiếp) thay vì import từ thư viện

4. **Thay đổi về behavior**:
   - Giữ nguyên logic hiển thị/ẩn mật khẩu
   - Giữ nguyên cách xử lý các props và events

## Các props được hỗ trợ

Cả hai phiên bản đều hỗ trợ các props sau:

| Prop | Kiểu dữ liệu | Mô tả |
|------|--------------|-------|
| id | string | ID của input |
| name | string | Tên của input |
| label | string | Nhãn hiển thị |
| type | string | Loại input (text, password, email, v.v.) |
| value | string | Giá trị của input |
| onChange | function | Hàm xử lý khi giá trị thay đổi |
| placeholder | string | Placeholder text |
| required | boolean | Có bắt buộc hay không |
| disabled | boolean | Có bị vô hiệu hóa hay không |
| fullWidth | boolean | Có chiếm toàn bộ chiều rộng hay không |
| error | string | Thông báo lỗi |
| helperText | string | Văn bản trợ giúp |
| startAdornment | node | Phần tử hiển thị ở đầu input |
| endAdornment | node | Phần tử hiển thị ở cuối input |

## Ví dụ sử dụng

```jsx
// Sử dụng Input component
import Input from './Input';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form>
      <Input
        id="email"
        name="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email"
        required
      />
      
      <Input
        id="password"
        name="password"
        label="Password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Enter your password"
        required
      />
      
      <button type="submit">Login</button>
    </form>
  );
}
```

## Lưu ý khi chuyển đổi

1. Đảm bảo tất cả các props từ phiên bản Material UI đều được hỗ trợ trong phiên bản Tailwind
2. Kiểm tra kỹ các trạng thái khác nhau (focus, hover, disabled, error)
3. Đảm bảo component mới có responsive tốt trên các kích thước màn hình
4. Kiểm tra accessibility (ARIA attributes, keyboard navigation)
5. Đảm bảo hiệu suất tương đương hoặc tốt hơn