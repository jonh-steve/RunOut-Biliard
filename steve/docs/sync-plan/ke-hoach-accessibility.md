## Kế hoạch Accessibility (a11y)

### 1. Tổng quan

Accessibility (viết tắt là a11y) là việc thiết kế và phát triển ứng dụng để đảm bảo tất cả người dùng, bao gồm cả những người khuyết tật, có thể tiếp cận và sử dụng ứng dụng một cách hiệu quả. Trong quá trình đồng bộ hóa từ User sang Client, chúng ta sẽ tích hợp các thực hành accessibility tốt nhất để đảm bảo ứng dụng tuân thủ các tiêu chuẩn WCAG 2.1 AA.

### 2. Tiêu chuẩn và hướng dẫn

Chúng ta sẽ tuân thủ các tiêu chuẩn và hướng dẫn sau:

1. **WCAG 2.1 AA**: Web Content Accessibility Guidelines 2.1 Level AA
2. **WAI-ARIA 1.1**: Accessible Rich Internet Applications
3. **Section 508**: Tiêu chuẩn của Hoa Kỳ về accessibility cho các hệ thống thông tin

### 3. Các nguyên tắc cơ bản

#### Nguyên tắc POUR

1. **Perceivable (Có thể nhận thức)**: Thông tin và giao diện người dùng phải được trình bày theo cách mà người dùng có thể nhận thức được.
2. **Operable (Có thể vận hành)**: Các thành phần giao diện và điều hướng phải có thể vận hành được.
3. **Understandable (Có thể hiểu)**: Thông tin và vận hành giao diện người dùng phải dễ hiểu.
4. **Robust (Mạnh mẽ)**: Nội dung phải đủ mạnh mẽ để có thể được diễn giải một cách đáng tin cậy bởi nhiều user agents, bao gồm cả công nghệ hỗ trợ.

### 4. Chiến lược triển khai

#### 4.1. Semantic HTML

Sử dụng các thẻ HTML semantic để cung cấp cấu trúc và ý nghĩa cho nội dung:

```jsx
// Không tốt
<div className="header">
  <div className="title">Tiêu đề trang</div>
</div>

// Tốt
<header>
  <h1>Tiêu đề trang</h1>
</header>
```

#### 4.2. ARIA attributes

Sử dụng ARIA attributes khi cần thiết để cải thiện accessibility:

```jsx
// Ví dụ về một menu dropdown
<button 
  aria-expanded={isOpen} 
  aria-controls="dropdown-menu"
  onClick={toggleMenu}
>
  Menu
</button>
<ul 
  id="dropdown-menu" 
  role="menu" 
  aria-hidden={!isOpen}
>
  <li role="menuitem"><a href="/home">Home</a></li>
  <li role="menuitem"><a href="/about">About</a></li>
</ul>
```

#### 4.3. Keyboard Navigation

Đảm bảo tất cả ch��c năng có thể truy cập được bằng bàn phím:

```jsx
// Ví dụ về một component có thể focus và xử lý keyboard events
const KeyboardNavigableComponent = () => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      // Xử lý action
    }
  };

  return (
    <div 
      tabIndex={0} 
      role="button" 
      onKeyDown={handleKeyDown}
      onClick={handleClick}
    >
      Click me or press Enter
    </div>
  );
};
```

#### 4.4. Focus Management

Quản lý focus một cách hợp lý, đặc biệt là trong các modal và dialogs:

```jsx
// Ví dụ về một modal với focus trap
const Modal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef(null);
  
  useEffect(() => {
    if (isOpen) {
      // Lưu element đang có focus trước khi mở modal
      const previouslyFocused = document.activeElement;
      
      // Focus vào modal
      modalRef.current.focus();
      
      return () => {
        // Trả focus về element trước đó khi đóng modal
        previouslyFocused.focus();
      };
    }
  }, [isOpen]);
  
  return isOpen ? (
    <div 
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      // Implement focus trap ở đây
    >
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  ) : null;
};
```

#### 4.5. Color Contrast

Đảm bảo tỷ lệ tương phản màu sắc đủ cao:

```jsx
// Tailwind CSS config với các màu có đủ tương phản
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          // Các màu có tỷ lệ tương phản ít nhất 4.5:1 với nền trắng
          500: '#2563eb', // Đủ tương phản
          // Thay vì
          // 500: '#93c5fd', // Không đủ tương phản
        },
      },
    },
  },
};
```

#### 4.6. Text Alternatives

Cung cấp text alternatives cho nội dung không phải văn bản:

```jsx
// Ví dụ về hình ảnh có alt text
<img 
  src="/path/to/image.jpg" 
  alt="Mô tả chi tiết về hình ảnh" 
/>

// Ví dụ về icon có aria-label
<button aria-label="Close dialog">
  <svg>...</svg>
</button>
```

#### 4.7. Form Accessibility

Đảm bảo các form có thể truy cập được:

```jsx
// Ví dụ về form có labels và error messages
<form>
  <div>
    <label htmlFor="name">Name</label>
    <input 
      id="name" 
      name="name" 
      type="text" 
      aria-required="true"
      aria-invalid={!!errors.name}
      aria-describedby={errors.name ? "name-error" : undefined}
    />
    {errors.name && (
      <div id="name-error" role="alert">
        {errors.name}
      </div>
    )}
  </div>
  
  <button type="submit">Submit</button>
</form>
```

### 5. Công cụ và thư viện

#### 5.1. Công cụ kiểm tra

- **axe-core**: Thư viện kiểm tra accessibility tự động
- **react-axe**: Tích hợp axe-core với React
- **eslint-plugin-jsx-a11y**: ESLint plugin để phát hiện các vấn đề accessibility trong JSX
- **Lighthouse**: Công cụ của Google để kiểm tra accessibility
- **WAVE**: Web Accessibility Evaluation Tool

#### 5.2. Thư viện hỗ trợ

- **@reach/dialog**: Modal dialog có thể truy cập được
- **@reach/menu-button**: Menu dropdown có thể truy cập được
- **react-focus-lock**: Quản lý focus trong modals
- **react-aria**: Bộ hooks cho accessibility
- **headlessui**: Các components có thể truy cập được và không có styles

### 6. Quy trình kiểm tra

#### 6.1. Automated Testing

```javascript
// Ví dụ về test với jest-axe
import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Button from './Button';

expect.extend(toHaveNoViolations);

test('Button component should have no accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

#### 6.2. Manual Testing

Checklist kiểm tra thủ công:

1. **Keyboard Navigation**: Kiểm tra tất cả chức năng bằng bàn phím
2. **Screen Reader**: Kiểm tra với NVDA, JAWS, VoiceOver
3. **Zoom**: Kiểm tra với zoom 200%
4. **Color Contrast**: Kiểm tra tỷ lệ tương phản
5. **Reduced Motion**: Kiểm tra với prefers-reduced-motion
6. **High Contrast Mode**: Kiểm tra với high contrast mode

### 7. Kế hoạch triển khai

#### Giai đoạn 1: Thiết lập cơ sở hạ tầng

- [ ] Cài đặt eslint-plugin-jsx-a11y
- [ ] Thiết lập jest-axe cho testing
- [ ] Tạo accessibility guidelines cho team
- [ ] Tạo các components cơ bản có thể truy cập được

#### Giai đoạn 2: Audit và cải thiện

- [ ] Thực hiện audit accessibility trên codebase hiện tại
- [ ] Xác định và ưu tiên các vấn đề cần giải quyết
- [ ] Cải thiện semantic HTML
- [ ] Thêm ARIA attributes khi cần thiết

#### Giai đoạn 3: Triển khai các cải tiến

- [ ] Cải thiện keyboard navigation
- [ ] Cải thiện focus management
- [ ] Cải thiện color contrast
- [ ] Thêm text alternatives cho nội dung không phải văn bản

#### Giai đoạn 4: Kiểm thử và đánh giá

- [ ] Thực hiện automated testing
- [ ] Thực hiện manual testing
- [ ] Thu thập feedback từ người dùng khuyết tật
- [ ] Điều chỉnh dựa trên feedback

### 8. Checklist Accessibility

#### Perceivable

- [ ] Tất cả hình ảnh có alt text
- [ ] Videos có captions và audio descriptions
- [ ] Nội dung có thể được trình bày theo nhiều cách
- [ ] Nội dung dễ nhìn và nghe
- [ ] Tỷ lệ tương phản màu sắc đủ cao (ít nhất 4.5:1)

#### Operable

- [ ] Tất cả chức năng có thể truy cập bằng bàn phím
- [ ] Người dùng có đủ thời gian để đọc và sử dụng nội dung
- [ ] Không có nội dung gây co giật hoặc flash
- [ ] Người dùng có thể dễ dàng điều hướng và tìm nội dung
- [ ] Có nhiều cách để tìm các trang

#### Understandable

- [ ] Văn bản dễ đọc và dễ hiểu
- [ ] Nội dung xuất hiện và hoạt động theo cách có thể dự đoán
- [ ] Người dùng được hỗ trợ để tránh và sửa lỗi
- [ ] Labels và instructions rõ ràng

#### Robust

- [ ] Nội dung tương thích với các công nghệ hiện tại và tương lai
- [ ] Sử dụng HTML semantic
- [ ] ARIA được sử dụng đúng cách

### 9. Ví dụ về component có thể truy cập được

#### Button Component

```jsx
import React from 'react';
import PropTypes from 'prop-types';

const Button = ({
  children,
  onClick,
  disabled = false,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  className = '',
  ariaLabel,
  ...props
}) => {
  // Map variant to Tailwind classes
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };
  
  // Map size to Tailwind classes
  const sizeClasses = {
    small: 'py-1 px-2 text-sm',
    medium: 'py-2 px-4 text-base',
    large: 'py-3 px-6 text-lg',
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      aria-label={ariaLabel || undefined}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export default Button;
```

#### Form Input Component

```jsx
import React from 'react';
import PropTypes from 'prop-types';

const FormInput = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const errorId = `${inputId}-error`;
  
  return (
    <div className={`mb-4 ${className}`}>
      <label 
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 text-gray-500' : ''}
        `}
        {...props}
      />
      
      {error && (
        <div 
          id={errorId}
          role="alert"
          className="mt-1 text-sm text-red-600"
        >
          {error}
        </div>
      )}
    </div>
  );
};

FormInput.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default FormInput;
```

### 10. Tài nguyên và tham khảo

1. [Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/TR/WCAG21/)
2. [WAI-ARIA Authoring Practices 1.1](https://www.w3.org/TR/wai-aria-practices-1.1/)
3. [MDN Web Docs: Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
4. [React Accessibility](https://reactjs.org/docs/accessibility.html)
5. [A11y Project Checklist](https://www.a11yproject.com/checklist/)
6. [Inclusive Components](https://inclusive-components.design/)
7. [axe-core GitHub](https://github.com/dequelabs/axe-core)
8. [eslint-plugin-jsx-a11y GitHub](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)