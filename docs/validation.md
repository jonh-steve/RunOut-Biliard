# Hệ thống Validation

Tài liệu này mô tả chi tiết về hệ thống validation được sử dụng trong dự án, bao gồm cả phía backend và frontend.

## Mục lục

1. [Tổng quan](#tổng-quan)
2. [Backend Validation](#backend-validation)
   - [Express Validator](#express-validator)
   - [Cấu trúc Validator](#cấu-trúc-validator)
   - [Middleware Validation](#middleware-validation)
3. [Frontend Validation](#frontend-validation)
   - [Validation Hooks](#validation-hooks)
   - [Validation Components](#validation-components)
   - [Validation Schemas](#validation-schemas)
4. [Danh sách Validators](#danh-sách-validators)
5. [Ví dụ sử dụng](#ví-dụ-sử-dụng)
6. [Best Practices](#best-practices)

## Tổng quan

Hệ thống validation được thiết kế để đảm bảo tính toàn vẹn dữ liệu ở cả phía client và server. Validation được thực hiện ở cả hai phía để đảm bảo trải nghiệm người dùng tốt và bảo mật dữ liệu.

### Nguyên tắc chính:

- **Validation hai l���p**: Thực hiện validation ở cả client và server
- **Thông báo lỗi rõ ràng**: Cung cấp thông báo lỗi chi tiết và dễ hiểu
- **Tái sử dụng**: Các validator có thể tái sử dụng ở nhiều nơi
- **Dễ mở rộng**: Dễ dàng thêm mới hoặc sửa đổi các quy tắc validation

## Backend Validation

### Express Validator

Backend sử dụng thư viện `express-validator` để thực hiện validation cho các request API. Thư viện này cung cấp một tập hợp các middleware để kiểm tra và xác thực dữ liệu đầu vào.

#### Cài đặt:

```bash
npm install express-validator
```

### Cấu trúc Validator

Các validator được tổ chức theo module, mỗi module tương ứng với một thực thể trong hệ thống (user, product, order, v.v.). Mỗi validator module chứa các middleware validation cho các hoạt động khác nhau liên quan đến thực thể đó.

Ví dụ cấu trúc thư mục:

```
/Server
  /middlewares
    /validators
      userValidator.js
      productValidator.js
      orderValidator.js
      ...
      index.js
```

### Middleware Validation

Mỗi middleware validation thực hiện các bước sau:

1. Định nghĩa các quy tắc validation sử dụng `check()` hoặc `body()` từ express-validator
2. Kiểm tra kết quả validation sử dụng `validationResult()`
3. Tr��� về lỗi nếu validation thất bại hoặc chuyển tiếp đến middleware tiếp theo nếu thành công

Ví dụ:

```javascript
const validateCreateUser = [
    check('firstname')
        .notEmpty().withMessage('Họ không được để trống')
        .isLength({ min: 2 }).withMessage('Họ phải có ít nhất 2 ký tự'),
    
    check('email')
        .notEmpty().withMessage('Email không được để trống')
        .isEmail().withMessage('Email không hợp lệ'),
    
    // Các quy tắc khác...
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                mes: errors.array()[0].msg 
            });
        }
        next();
    }
];
```

## Frontend Validation

### Validation Hooks

Frontend sử dụng các custom hooks để quản lý validation form. Có hai hooks chính:

1. **useFormValidation**: Hook tự xây dựng để validation form thông thường
2. **useFormikValidation**: Hook sử dụng Formik và Yup để validation form

#### useFormValidation

Hook này quản lý trạng thái form, validation và xử lý submit.

```javascript
const {
    values,
    errors,
    isSubmitting,
    serverError,
    isSuccess,
    handleChange,
    handleSubmit,
    setFormValues,
    resetForm,
    hasError,
    getErrorMessage
} = useFormValidation(initialValues, validateForm, onSubmit);
```

#### useFormikValidation

Hook này tích hợp Formik và Yup để validation form.

```javascript
const {
    formik,
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    serverError,
    isSuccess,
    resetFormAndState,
    hasError,
    getErrorMessage
} = useFormikValidation({
    initialValues,
    validationSchema,
    onSubmit
});
```

### Validation Components

Frontend cung cấp các components validation để sử dụng trong form:

1. **FormValidation Components**: Các components thông thường cho form validation
2. **FormikValidation Components**: Các components tích hợp với Formik

#### FormValidation Components

```jsx
import {
    ErrorMessage,
    ServerError,
    SuccessMessage,
    FormInput,
    FormTextarea,
    FormSelect,
    FormCheckbox,
    FormRadio,
    FormRadioGroup,
    SubmitButton
} from '../components/common/FormValidation';
```

#### FormikValidation Components

```jsx
import {
    FormikError,
    FormikServerError,
    FormikSuccess,
    FormikInput,
    FormikTextarea,
    FormikSelect,
    FormikCheckbox,
    FormikRadio,
    FormikRadioGroup,
    FormikFile,
    FormikDatePicker,
    FormikSubmitButton,
    FormikForm
} from '../components/common/FormikValidation';
```

### Validation Schemas

Frontend sử dụng Yup để định nghĩa các schema validation cho form.

```javascript
import * as Yup from 'yup';

const loginSchema = Yup.object().shape({
    email: Yup.string()
        .required('Email không được để trống')
        .email('Email không hợp lệ'),
    
    password: Yup.string()
        .required('Mật khẩu không được để trống')
});
```

## Danh sách Validators

### Backend Validators

1. **userValidator.js**: Validation cho đăng ký, đăng nhập, cập nhật thông tin người dùng
2. **productValidator.js**: Validation cho tạo, cập nhật, đánh giá sản phẩm
3. **categoryValidator.js**: Validation cho danh mục sản phẩm
4. **brandValidator.js**: Validation cho thương hiệu
5. **orderValidator.js**: Validation cho đơn hàng
6. **couponValidator.js**: Validation cho mã giảm giá
7. **blogValidator.js**: Validation cho bài viết
8. **reviewValidator.js**: Validation cho đánh giá
9. **addressValidator.js**: Validation cho địa chỉ
10. **paymentValidator.js**: Validation cho thanh toán
11. **wishlistValidator.js**: Validation cho danh sách yêu thích
12. **cartValidator.js**: Validation cho giỏ hàng
13. **notificationValidator.js**: Validation cho thông báo
14. **contactValidator.js**: Validation cho liên hệ
15. **newsletterValidator.js**: Validation cho đăng ký bản tin
16. **settingsValidator.js**: Validation cho cài đặt hệ thống
17. **seoValidator.js**: Validation cho SEO
18. **adminValidator.js**: Validation cho các chức năng quản trị

### Frontend Validators

1. **userValidator.js**: Validation cho form người dùng
2. **productValidator.js**: Validation cho form sản phẩm
3. **orderValidator.js**: Validation cho form đơn hàng
4. **couponValidator.js**: Validation cho form mã giảm giá
5. **blogValidator.js**: Validation cho form bài viết
6. **brandValidator.js**: Validation cho form thương hiệu
7. **addressValidator.js**: Validation cho form địa chỉ
8. **reviewValidator.js**: Validation cho form đánh giá
9. **paymentValidator.js**: Validation cho form thanh toán
10. **wishlistValidator.js**: Validation cho form danh sách yêu thích
11. **cartValidator.js**: Validation cho form giỏ hàng
12. **notificationValidator.js**: Validation cho form thông báo
13. **contactValidator.js**: Validation cho form liên hệ
14. **newsletterValidator.js**: Validation cho form đăng ký bản tin
15. **settingsValidator.js**: Validation cho form cài đặt
16. **seoValidator.js**: Validation cho form SEO
17. **adminValidator.js**: Validation cho form quản trị

## Ví dụ sử dụng

### Backend Example

```javascript
// routes/user.js
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const { validateRegister, validateLogin, validateUpdateUser } = require('../middlewares/validators/userValidator');

router.post('/register', validateRegister, userCtrl.register);
router.post('/login', validateLogin, userCtrl.login);
router.put('/current', validateUpdateUser, userCtrl.updateUser);

module.exports = router;
```

### Frontend Example với useFormValidation

```jsx
// components/LoginForm.jsx
import React from 'react';
import useFormValidation from '../hooks/useFormValidation';
import { validateLoginForm } from '../validators/userValidator';
import { FormInput, SubmitButton, ServerError } from '../components/common/FormValidation';

const LoginForm = () => {
    const initialValues = { email: '', password: '' };
    
    const onSubmit = async (values) => {
        // Gọi API đăng nhập
    };
    
    const {
        values,
        errors,
        isSubmitting,
        serverError,
        handleChange,
        handleSubmit
    } = useFormValidation(initialValues, validateLoginForm, onSubmit);
    
    return (
        <form onSubmit={handleSubmit}>
            {serverError && <ServerError message={serverError} />}
            
            <FormInput
                name="email"
                label="Email"
                value={values.email}
                onChange={handleChange}
                error={errors.email}
                required
            />
            
            <FormInput
                name="password"
                type="password"
                label="Mật khẩu"
                value={values.password}
                onChange={handleChange}
                error={errors.password}
                required
            />
            
            <SubmitButton
                text="Đăng nhập"
                isSubmitting={isSubmitting}
            />
        </form>
    );
};

export default LoginForm;
```

### Frontend Example với Formik

```jsx
// components/RegisterForm.jsx
import React from 'react';
import { registerSchema } from '../schemas/validationSchema';
import useFormikValidation from '../hooks/useFormikValidation';
import {
    FormikForm,
    FormikInput,
    FormikSubmitButton
} from '../components/common/FormikValidation';

const RegisterForm = () => {
    const initialValues = {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: '',
        mobile: ''
    };
    
    const onSubmit = async (values) => {
        // Gọi API đăng ký
    };
    
    const {
        handleSubmit,
        isSubmitting,
        serverError,
        isSuccess
    } = useFormikValidation({
        initialValues,
        validationSchema: registerSchema,
        onSubmit
    });
    
    return (
        <FormikForm
            initialValues={initialValues}
            validationSchema={registerSchema}
            onSubmit={handleSubmit}
            serverError={serverError}
            isSuccess={isSuccess}
            successMessage="Đăng ký thành công!"
        >
            {({ values, errors, touched, handleChange, handleBlur }) => (
                <>
                    <FormikInput
                        name="firstname"
                        label="Họ"
                        required
                    />
                    
                    <FormikInput
                        name="lastname"
                        label="Tên"
                        required
                    />
                    
                    <FormikInput
                        name="email"
                        label="Email"
                        type="email"
                        required
                    />
                    
                    <FormikInput
                        name="password"
                        label="Mật khẩu"
                        type="password"
                        required
                    />
                    
                    <FormikInput
                        name="confirmPassword"
                        label="Xác nhận mật khẩu"
                        type="password"
                        required
                    />
                    
                    <FormikInput
                        name="mobile"
                        label="Số điện thoại"
                    />
                    
                    <FormikSubmitButton
                        text="Đăng ký"
                        isSubmitting={isSubmitting}
                    />
                </>
            )}
        </FormikForm>
    );
};

export default RegisterForm;
```

## Best Practices

### Backend Validation

1. **Luôn validate dữ liệu đầu vào**: Không bao giờ tin tưởng dữ liệu từ client
2. **Sử dụng middleware validation**: Tách biệt logic validation và logic xử lý
3. **Trả về thông báo lỗi rõ ràng**: Giúp client hiểu vấn đề và sửa chữa
4. **Kiểm tra cả định dạng và logic**: Ví dụ: email đúng định dạng và không trùng lặp
5. **Sanitize dữ liệu**: Loại bỏ các ký tự không mong muốn trước khi xử lý

### Frontend Validation

1. **Validation ngay khi nhập liệu**: Cung cấp phản hồi tức thì cho người dùng
2. **Hiển thị lỗi rõ ràng**: Đặt thông báo lỗi gần trường nhập liệu
3. **Disable nút submit khi form không hợp lệ**: Ngăn người dùng gửi dữ liệu không hợp lệ
4. **Xử lý lỗi từ server**: Hiển thị lỗi từ server một cách rõ ràng
5. **Sử dụng schema validation**: Tập trung các quy tắc validation vào một nơi

### Chung

1. **Đồng bộ quy tắc validation**: Đảm bảo quy tắc validation ở client và server là nhất quán
2. **Tái sử dụng validator**: Tạo các hàm validation có thể tái sử dụng
3. **Kiểm tra kỹ các trường nhạy cảm**: Đặc biệt là các trường liên quan đến bảo mật
4. **Cập nhật quy tắc validation**: Thường xuyên xem xét và cập nhật quy tắc validation
5. **Viết test cho validator**: Đảm bảo các validator hoạt động chính xác