# Chuyển đổi Form Component

## Tổng quan

Tài liệu này mô tả quá trình chuyển đổi Form Component từ thư mục User (sử dụng Material UI) sang thư mục Client (sử dụng Tailwind CSS).

## So sánh

### Form Component từ User (Material UI)

Form Component từ User sử dụng:
- Material UI `Paper` làm container
- Material UI `Typography` cho tiêu đề và phụ đề
- Material UI `Divider` cho đường phân cách
- Material UI `CircularProgress` cho trạng thái loading
- Material UI `makeStyles` để tạo và quản lý styles

### Form Component cho Client (Tailwind CSS)

Form Component cho Client sử dụng:
- HTML native elements (`div`, `h2`, `p`, `hr`)
- Tailwind CSS classes để styling
- Custom loading spinner sử dụng Tailwind's animation
- Cấu trúc DOM đơn giản hơn

## Các thay đổi chính

1. **Thay đổi về cấu trúc**:
   - Thay thế `Paper` bằng `div` với các class Tailwind tương ứng
   - Thay thế `Typography` bằng các thẻ HTML semantic (`h2`, `p`)
   - Thay thế `Divider` bằng `hr` với styling Tailwind
   - Thay thế `CircularProgress` bằng custom spinner sử dụng Tailwind animation

2. **Thay đổi về styling**:
   - Chuyển từ Material UI styles sang Tailwind CSS classes
   - Sử dụng utility classes của Tailwind cho padding, margin, colors, shadows, v.v.
   - Sử dụng Tailwind's flexbox utilities cho layout

3. **Thay đổi về behavior**:
   - Giữ nguyên logic xử lý form submission
   - Giữ nguyên cách xử lý các props và states

## Các props được hỗ trợ

Cả hai phiên bản đều hỗ trợ các props sau:

| Prop | Kiểu dữ liệu | Mô tả |
|------|--------------|-------|
| title | string | Tiêu đề của form |
| subtitle | string | Phụ đề của form |
| children | node | Nội dung của form |
| actions | node | Các nút hành động (thường là các buttons) |
| loading | boolean | Trạng thái loading của form |
| error | string | Thông báo lỗi |
| showDivider | boolean | Hiển thị đường phân cách giữa tiêu đề và nội dung |
| onSubmit | function | Hàm xử lý khi form được submit |

## Ví dụ sử dụng

```jsx
// Sử dụng Form component
import Form from './Form';
import Button from '../Button/Button';
import Input from '../Input/Input';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    setError('');
    
    try {
      // Gọi API đăng nhập
      await loginUser(formData);
      // Xử lý sau khi đăng nhập thành công
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      title="Login"
      subtitle="Please enter your credentials to login"
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
      actions={
        <>
          <Button variant="outlined">Cancel</Button>
          <Button type="submit">Login</Button>
        </>
      }
    >
      <Input
        id="email"
        name="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      
      <Input
        id="password"
        name="password"
        label="Password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
      />
    </Form>
  );
}
```

## Lưu ý khi chuyển đổi

1. Đảm bảo tất cả các props từ phiên bản Material UI đều được hỗ trợ trong phiên bản Tailwind
2. Kiểm tra kỹ các trạng thái khác nhau (loading, error)
3. Đảm bảo component mới có responsive tốt trên các kích thước màn hình
4. Kiểm tra accessibility (ARIA attributes, semantic HTML)
5. Đảm bảo hiệu suất tương đương hoặc tốt hơn

## Các cải tiến có thể thực hiện trong tương lai

1. Thêm các variants khác nhau cho form (bordered, shadowed, transparent)
2. Thêm tùy chọn cho vị trí của actions (left, center, right, space-between)
3. Thêm hỗ trợ cho form sections (nhóm các fields liên quan)
4. Thêm animation cho các trạng thái chuyển đổi