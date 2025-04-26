# Thiết lập dự án Client

## Giới thiệu

Tài liệu này hướng dẫn cách thiết lập dự án React mới cho thư mục Client, bao gồm cài đặt dependencies, cấu hình công cụ phát triển, và tạo cấu trúc thư mục.

## Các bước thực hiện

### 1. Tạo dự án React mới

```bash
# Sử dụng Create React App
npx create-react-app client
# HOẶC sử dụng Vite (khuyến nghị vì nhanh hơn)
npm create vite@latest client -- --template react
```

### 2. Cài đặt các dependencies cơ bản

```bash
cd client
npm install react-router-dom axios formik yup react-query
```

### 3. Thiết lập ESLint và Prettier

```bash
npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-plugin-react eslint-plugin-react-hooks
```

Tạo file `.eslintrc.js`:

```javascript
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
```

Tạo file `.prettierrc`:

```json
{
  "semi": true,
  "tabWidth": 2,
  "printWidth": 100,
  "singleQuote": true,
  "trailingComma": "es5",
  "jsxBracketSameLine": false
}
```

### 4. Thiết lập Jest và React Testing Library

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
```

Tạo file `jest.config.js`:

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

Tạo file `src/setupTests.js`:

```javascript
import '@testing-library/jest-dom';
```

### 5. Tạo cấu trúc thư mục

```bash
mkdir -p src/{components/{common,layout,features},pages,services/{api,adapters},utils,hooks,context,store,assets,styles,config,types}
```

Cấu trúc thư mục sẽ như sau:

```
client/
├── src/
│   ├── components/
│   │   ├── common/       # Các thành phần cơ bản (Button, Input, v.v.)
│   │   ├── layout/       # Các thành phần layout (Header, Footer, v.v.)
│   │   └── features/     # Các thành phần theo tính năng
│   ├── pages/            # Các trang chính của ứng dụng
│   ├── services/
│   │   ├── api/          # Các hàm gọi API
│   │   └── adapters/     # Các adapter để chuyển đổi dữ liệu
│   ├── utils/            # Các hàm tiện ích
│   ├── hooks/            # Custom React hooks
│   ├── context/          # React Context Providers
│   ├── store/            # Quản lý trạng thái (Redux hoặc Context)
│   ├── assets/           # Tài nguyên tĩnh (hình ảnh, fonts, v.v.)
│   ├── styles/           # CSS/SCSS styles
│   ├── config/           # Cấu hình ứng dụng
│   ├── types/            # TypeScript type definitions
│   ├── App.js            # Component gốc
│   └── index.js          # Entry point
├── public/               # Tài nguyên công khai
├── package.json          # Dependencies
└── README.md             # Tài liệu
```

## Kiểm tra cài đặt

Để kiểm tra cài đặt, chạy lệnh sau:

```bash
npm run lint
npm test
npm start
```

## Tài liệu tham khảo

- [Create React App documentation](https://create-react-app.dev/)
- [Vite documentation](https://vitejs.dev/)
- [ESLint documentation](https://eslint.org/)
- [Prettier documentation](https://prettier.io/)
- [Jest documentation](https://jestjs.io/)
- [React Testing Library documentation](https://testing-library.com/docs/react-testing-library/intro/)