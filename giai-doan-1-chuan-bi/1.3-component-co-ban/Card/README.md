# Chuyển đổi Card Component

## Tổng quan

Tài liệu này mô tả quá trình chuyển đổi Card Component từ thư mục User (sử dụng Material UI) sang thư mục Client (sử dụng Tailwind CSS).

## So sánh

### Card Component từ User (Material UI)

Card Component từ User sử dụng:
- Material UI `Card` làm container chính
- Material UI `CardHeader` cho phần tiêu đề
- Material UI `CardMedia` cho phần hình ảnh
- Material UI `CardContent` cho nội dung
- Material UI `CardActions` cho các hành động
- Material UI `Avatar` cho avatar
- Material UI `makeStyles` để tạo và quản lý styles

### Card Component cho Client (Tailwind CSS)

Card Component cho Client sử dụng:
- HTML native elements (`div`, `h3`, `p`, `img`)
- Tailwind CSS classes để styling
- Cấu trúc DOM đơn giản hơn
- Flexbox cho layout

## Các thay đổi chính

1. **Thay đổi về cấu trúc**:
   - Thay thế các component Material UI bằng các thẻ HTML semantic
   - Sử dụng `div` với các class Tailwind tương ứng thay cho `Card`, `CardHeader`, `CardContent`, `CardActions`
   - Sử dụng `img` với styling Tailwind thay cho `CardMedia`

2. **Thay đổi về styling**:
   - Chuyển từ Material UI styles sang Tailwind CSS classes
   - Sử dụng utility classes của Tailwind cho border-radius, shadow, padding, margin, colors, v.v.
   - Sử dụng Tailwind's transition utilities cho hiệu ứng hover

3. **Thay đổi về behavior**:
   - Giữ nguyên logic xử lý click event
   - Giữ nguyên cách xử lý các props và states

## Các props được hỗ trợ

Cả hai phiên bản đều hỗ trợ các props sau:

| Prop | Kiểu dữ liệu | Mô tả |
|------|--------------|-------|
| title | string | Tiêu đề của card |
| subheader | string | Phụ đề của card |
| avatar | node | Avatar hiển thị bên cạnh tiêu đề |
| image | string | URL của hình ảnh |
| imageAlt | string | Alt text cho hình ảnh |
| children | node | Nội dung của card |
| actions | node | Các nút hành động ở cuối card |
| raised | boolean | Hiển thị card với shadow lớn hơn |
| onClick | function | Hàm xử lý khi card được click |

## Ví dụ sử dụng

```jsx
// Sử dụng Card component
import Card from './Card';
import Button from '../Button/Button';

function ProductCard() {
  return (
    <Card
      title="iPhone 13 Pro"
      subheader="Apple Inc."
      image="https://example.com/iphone13.jpg"
      imageAlt="iPhone 13 Pro"
      actions={
        <>
          <Button variant="outlined" size="small">Chi tiết</Button>
          <Button variant="primary" size="small">Mua ngay</Button>
        </>
      }
      onClick={() => console.log('Card clicked')}
    >
      <div>
        <p>Màn hình Super Retina XDR 6.1 inch với ProMotion</p>
        <p>Chip A15 Bionic với GPU 5 lõi</p>
        <p>Hệ thống camera Pro 12MP (Telephoto, Wide và Ultra Wide)</p>
        <p className="font-bold mt-2">25.990.000 ₫</p>
      </div>
    </Card>
  );
}
```

## Lưu ý khi chuyển đổi

1. **Aspect ratio cho hình ảnh**: 
   - Trong Material UI, chúng ta sử dụng `paddingTop: '56.25%'` để tạo tỷ lệ khung hình 16:9
   - Trong Tailwind, chúng ta sử dụng `pb-[56.25%]` và positioning để đạt được hiệu quả tương tự

2. **Xử lý nội dung dạng chuỗi**:
   - Cả hai phiên bản đều kiểm tra nếu `children` là chuỗi thì sẽ bọc trong một phần tử text
   - Material UI sử dụng `Typography` component
   - Tailwind sử dụng thẻ `p` với các class phù hợp

3. **Hiệu ứng hover**:
   - Material UI sử dụng nested selectors trong makeStyles
   - Tailwind sử dụng modifier `hover:` trực tiếp trong class

4. **Avatar mặc định**:
   - Cả hai phiên bản đều tạo avatar mặc định từ chữ cái đầu tiên của title
   - Material UI sử dụng `Avatar` component
   - Tailwind sử dụng `div` với các class phù hợp

## Các cải tiến có thể thực hiện trong tương lai

1. Thêm các variants khác nhau cho card (bordered, shadowed, transparent)
2. Thêm hỗ trợ cho badge trên card
3. Thêm hỗ trợ cho các hiệu ứng hover khác nhau
4. Tối ưu hóa hiệu suất bằng cách sử dụng React.memo