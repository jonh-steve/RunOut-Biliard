# Chuyển đổi Typography Component

## Tổng quan

Tài liệu này mô tả quá trình chuyển đổi Typography Component từ thư mục User (sử dụng Material UI) sang thư mục Client (sử dụng Tailwind CSS).

## So sánh

### Typography Component từ User (Material UI)

Typography Component từ User sử dụng:
- Material UI `Typography` component làm thành phần cơ bản
- Material UI `makeStyles` để tạo và quản lý styles
- Hỗ trợ nhiều variant, alignment, color, weight và transform
- Các tùy chọn như noWrap, gutterBottom, noMargin

### Typography Component cho Client (Tailwind CSS)

Typography Component cho Client sử dụng:
- HTML native elements (`h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p`, `span`)
- Tailwind CSS classes để styling
- Mapping giữa các variant của Material UI và các class của Tailwind
- Cấu trúc DOM đơn giản hơn

## Các thay đổi chính

1. **Thay đổi về cấu trúc**:
   - Thay thế `Typography` component bằng các thẻ HTML semantic
   - Sử dụng prop `component` để xác định thẻ HTML nào sẽ được render
   - Nếu không có `component`, sử dụng mapping từ variant sang thẻ HTML tương ứng

2. **Thay đổi về styling**:
   - Chuyển từ Material UI styles sang Tailwind CSS classes
   - Tạo các mapping giữa các tùy chọn của Material UI và các class của Tailwind
   - Sử dụng utility classes của Tailwind cho font-size, color, weight, alignment, v.v.

3. **Thay đổi về behavior**:
   - Giữ nguyên logic xử lý các props
   - Giữ nguyên các tùy chọn như noWrap, gutterBottom, noMargin

## Các props được hỗ trợ

Cả hai phiên bản đều hỗ trợ các props sau:

| Prop | Kiểu dữ liệu | Mô tả |
|------|--------------|-------|
| variant | string | Biến thể typography (h1, h2, h3, h4, h5, h6, subtitle1, subtitle2, body1, body2, caption, overline) |
| component | string | Thẻ HTML sẽ được render |
| align | string | Căn chỉnh văn bản (left, center, right, justify) |
| color | string | Màu sắc văn bản (primary, secondary, textPrimary, textSecondary, error) |
| weight | string | Độ đậm của font (light, regular, medium, bold) |
| transform | string | Biến đổi văn bản (uppercase, lowercase, capitalize) |
| noWrap | boolean | Không ngắt dòng, hiển thị dấu ba ch���m nếu quá dài |
| gutterBottom | boolean | Thêm margin-bottom lớn hơn |
| noMargin | boolean | Không có margin |

## Ví dụ sử dụng

```jsx
// Sử dụng Typography component
import Typography from './Typography';

function TypographyExample() {
  return (
    <div>
      <Typography variant="h1">Heading 1</Typography>
      <Typography variant="h2">Heading 2</Typography>
      <Typography variant="h3">Heading 3</Typography>
      
      <Typography variant="body1">
        This is a paragraph with normal text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </Typography>
      
      <Typography variant="body2" color="textSecondary">
        This is a smaller paragraph with secondary color.
      </Typography>
      
      <Typography variant="caption" align="center">
        This is a centered caption text.
      </Typography>
      
      <Typography variant="body1" weight="bold" color="primary">
        This is bold text with primary color.
      </Typography>
      
      <Typography variant="body1" transform="uppercase">
        This text is uppercase.
      </Typography>
      
      <Typography variant="body1" noWrap>
        This is a very long text that will not wrap and will be truncated with ellipsis if it's too long for its container.
      </Typography>
    </div>
  );
}
```

## Lưu ý khi chuyển đổi

1. **Mapping giữa variant và HTML elements**:
   - Material UI có mapping mặc định giữa variant và component
   - Trong phiên bản Tailwind, chúng ta cần tự tạo mapping này
   - Đảm bảo sử dụng các thẻ HTML semantic phù hợp

2. **Font sizes**:
   - Material UI có hệ thống typography được định nghĩa sẵn
   - Tailwind có các class text-xs, text-sm, text-base, text-lg, text-xl, v.v.
   - Cần mapping cẩn thận để đảm bảo kích thước font nhất quán

3. **Responsive typography**:
   - Cân nhắc sử dụng các responsive variants của Tailwind (sm:text-lg, md:text-xl, v.v.)
   - Đảm bảo typography hiển thị tốt trên các kích thước màn hình khác nhau

## Các cải tiến có thể thực hiện trong tương lai

1. Thêm hỗ trợ cho responsive typography
2. Thêm hỗ trợ cho custom colors ngoài các màu mặc định
3. Thêm hỗ trợ cho line-height và letter-spacing
4. Tạo theme provider để quản lý typography styles một cách nhất quán