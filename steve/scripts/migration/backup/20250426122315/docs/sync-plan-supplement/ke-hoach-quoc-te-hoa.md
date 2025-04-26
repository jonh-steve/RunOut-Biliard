## Kế hoạch quốc tế hóa (i18n)

### 1. Tổng quan

Quốc tế hóa (Internationalization - i18n) là quá trình thiết kế và phát triển ứng dụng để có thể dễ dàng thích ứng với các ngôn ngữ và khu vực khác nhau. Trong quá trình đồng bộ hóa từ User sang Client, chúng ta sẽ triển khai hệ thống i18n toàn diện để hỗ trợ đa ngôn ngữ.

### 2. Công nghệ sử dụng

Chúng ta sẽ sử dụng **react-i18next** kết hợp với **i18next** làm giải pháp quốc tế hóa chính:

```bash
npm install i18next react-i18next i18next-http-backend i18next-browser-languagedetector
```

- **i18next**: Thư viện i18n cốt lõi
- **react-i18next**: React bindings cho i18next
- **i18next-http-backend**: Backend để tải các file ngôn ngữ
- **i18next-browser-languagedetector**: Tự động phát hiện ngôn ngữ của trình duyệt

### 3. Cấu trúc thư mục

```
src/
├── i18n/
│   ├── index.js                # Cấu hình i18n
│   └── locales/
│       ├── en/                 # Tiếng Anh
│       │   ├── common.json     # Các chuỗi dùng chung
│       │   ├── auth.json       # Chuỗi liên quan đến xác thực
│       │   ├── product.json    # Chuỗi liên quan đến sản phẩm
│       │   └── ...
│       ├── vi/                 # Tiếng Việt
│       │   ├── common.json
│       │   ├── auth.json
│       │   ├── product.json
│       │   └── ...
│       └── ...                 # Các ngôn ngữ khác
```

### 4. Cấu hình i18n

```javascript
// src/i18n/index.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // Tải các file ngôn ngữ từ backend
  .use(Backend)
  // Phát hiện ngôn ngữ
  .use(LanguageDetector)
  // React bindings
  .use(initReactI18next)
  // Khởi tạo i18next
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // React đã escape values
    },
    ns: ['common', 'auth', 'product', 'checkout', 'account'],
    defaultNS: 'common',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n;
```

### 5. Tích hợp với ứng dụng

```javascript
// src/index.js
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './i18n';
import LoadingScreen from './components/common/LoadingScreen';

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<LoadingScreen />}>
      <App />
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
);
```

### 6. Sử dụng trong components

```jsx
// Ví dụ sử dụng trong component
import React from 'react';
import { useTranslation } from 'react-i18next';

const ProductCard = ({ product }) => {
  const { t } = useTranslation(['product', 'common']);

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <div className="price">
        {t('product:price')}: {product.price}
      </div>
      <button>
        {t('common:buttons.addToCart')}
      </button>
    </div>
  );
};

export default ProductCard;
```

### 7. Tạo Language Switcher

```jsx
// src/components/common/LanguageSwitcher.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'vi', name: 'Tiếng Việt' },
];

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
  };

  return (
    <div className="language-switcher">
      <span>{t('common:language')}: </span>
      <div className="language-options">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={i18n.language === lang.code ? 'active' : ''}
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
```

### 8. Xử lý định dạng số, ngày tháng và đơn vị tiền tệ

```jsx
// Ví dụ sử dụng định dạng số và tiền tệ
import React from 'react';
import { useTranslation } from 'react-i18next';

const PriceDisplay = ({ price }) => {
  const { i18n, t } = useTranslation();
  
  // Định dạng số theo locale
  const formattedPrice = new Intl.NumberFormat(i18n.language, {
    style: 'currency',
    currency: i18n.language === 'vi' ? 'VND' : 'USD',
  }).format(i18n.language === 'vi' ? price * 23000 : price);
  
  return (
    <div className="price">
      {t('product:price')}: {formattedPrice}
    </div>
  );
};

export default PriceDisplay;
```

### 9. Xử lý nội dung động

```jsx
// Ví dụ xử lý nội dung động từ API
import React from 'react';
import { useTranslation } from 'react-i18next';

const ProductDescription = ({ product }) => {
  const { i18n } = useTranslation();
  
  // Lấy mô tả theo ngôn ngữ hiện tại
  const description = product.descriptions?.[i18n.language] || product.description;
  
  return <p className="description">{description}</p>;
};

export default ProductDescription;
```

### 10. Kế hoạch triển khai

#### Giai đoạn 1: Thiết lập cơ sở hạ tầng

- [ ] Cài đặt các thư viện i18n
- [ ] Cấu hình i18n
- [ ] Tạo cấu trúc thư mục cho các file ngôn ngữ
- [ ] Tạo component LanguageSwitcher

#### Giai đoạn 2: Trích xuất chuỗi

- [ ] Xác định các namespace (common, auth, product, v.v.)
- [ ] Trích xuất tất cả chuỗi cứng từ codebase
- [ ] Tổ chức chuỗi vào các file ngôn ngữ

#### Giai đoạn 3: Tích hợp vào components

- [ ] Cập nhật các components để sử dụng i18n
- [ ] Xử lý các trường hợp đặc biệt (định dạng số, ngày tháng, v.v.)
- [ ] Kiểm thử với các ngôn ngữ khác nhau

#### Giai đoạn 4: Tối ưu hóa

- [ ] Tối ưu hóa việc tải file ngôn ngữ (code splitting)
- [ ] Cải thiện hiệu suất
- [ ] Kiểm thử trên các trình duyệt và thiết bị khác nhau

### 11. Các thực hành tốt nhất

1. **Sử dụng namespace**: Chia chuỗi thành các namespace để dễ quản lý
2. **Tránh nối chuỗi**: Sử dụng interpolation thay vì nối chuỗi
3. **Xử lý số nhiều**: Sử dụng tính năng xử lý số nhiều của i18next
4. **Tách biệt nội dung và code**: Không hardcode chuỗi trong code
5. **Sử dụng context**: Sử dụng context để xử lý các trường hợp đặc biệt
6. **Tự động phát hiện ngôn ngữ**: Sử dụng language detector
7. **Lưu lựa chọn ngôn ngữ**: Lưu lựa chọn ngôn ngữ của người dùng

### 12. Ví dụ file ngôn ngữ

```json
// locales/en/common.json
{
  "buttons": {
    "submit": "Submit",
    "cancel": "Cancel",
    "save": "Save",
    "delete": "Delete",
    "addToCart": "Add to Cart"
  },
  "navigation": {
    "home": "Home",
    "products": "Products",
    "about": "About",
    "contact": "Contact"
  },
  "language": "Language",
  "errors": {
    "required": "This field is required",
    "invalidEmail": "Please enter a valid email",
    "minLength": "Must be at least {{count}} characters",
    "maxLength": "Must be at most {{count}} characters"
  }
}
```

```json
// locales/vi/common.json
{
  "buttons": {
    "submit": "Gửi",
    "cancel": "Hủy",
    "save": "Lưu",
    "delete": "Xóa",
    "addToCart": "Thêm vào giỏ hàng"
  },
  "navigation": {
    "home": "Trang chủ",
    "products": "Sản phẩm",
    "about": "Giới thiệu",
    "contact": "Liên hệ"
  },
  "language": "Ngôn ngữ",
  "errors": {
    "required": "Trường này là bắt buộc",
    "invalidEmail": "Vui lòng nhập email hợp lệ",
    "minLength": "Phải có ít nhất {{count}} ký tự",
    "maxLength": "Phải có nhiều nhất {{count}} ký tự"
  }
}
```