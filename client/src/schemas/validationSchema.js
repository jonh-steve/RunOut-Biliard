/**
 * Validation Schema
 * Sử dụng Yup để tạo schema validation cho các form
 */

import * as Yup from 'yup';

/**
 * Schema validation cho form đăng ký
 */
export const registerSchema = Yup.object().shape({
  firstname: Yup.string()
    .required('Họ không được để trống')
    .min(2, 'Họ phải có ít nhất 2 ký tự'),
  
  lastname: Yup.string()
    .required('Tên không được để trống')
    .min(2, 'Tên phải có ít nhất 2 ký tự'),
  
  email: Yup.string()
    .required('Email không được để trống')
    .email('Email không hợp lệ'),
  
  password: Yup.string()
    .required('Mật khẩu không được để trống')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .matches(/[0-9]/, 'Mật khẩu phải chứa ít nhất một chữ số')
    .matches(/[A-Z]/, 'Mật khẩu phải chứa ít nhất một chữ hoa'),
  
  confirmPassword: Yup.string()
    .required('Xác nhận mật khẩu không được để trống')
    .oneOf([Yup.ref('password'), null], 'Mật khẩu xác nhận không khớp'),
  
  mobile: Yup.string()
    .nullable()
    .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ')
    .notRequired(),
  
  acceptTerms: Yup.boolean()
    .required('Bạn phải đồng ý với điều khoản sử dụng')
    .oneOf([true], 'Bạn phải đồng ý với điều khoản sử dụng')
});

/**
 * Schema validation cho form đăng nhập
 */
export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email không được để trống')
    .email('Email không hợp lệ'),
  
  password: Yup.string()
    .required('Mật khẩu không được để trống'),
  
  rememberMe: Yup.boolean()
});

/**
 * Schema validation cho form quên mật khẩu
 */
export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email không được để trống')
    .email('Email không hợp lệ')
});

/**
 * Schema validation cho form đặt lại mật khẩu
 */
export const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required('Mật khẩu không được để trống')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .matches(/[0-9]/, 'Mật khẩu phải chứa ít nhất một chữ số')
    .matches(/[A-Z]/, 'Mật khẩu phải chứa ít nhất một chữ hoa'),
  
  confirmPassword: Yup.string()
    .required('Xác nhận mật khẩu không được để trống')
    .oneOf([Yup.ref('password'), null], 'Mật khẩu xác nhận không khớp')
});

/**
 * Schema validation cho form cập nhật thông tin người dùng
 */
export const updateUserSchema = Yup.object().shape({
  firstname: Yup.string()
    .required('Họ không được để trống')
    .min(2, 'Họ phải có ít nhất 2 ký tự'),
  
  lastname: Yup.string()
    .required('Tên không được để trống')
    .min(2, 'Tên phải có ít nhất 2 ký tự'),
  
  email: Yup.string()
    .required('Email không được để trống')
    .email('Email không hợp lệ'),
  
  mobile: Yup.string()
    .nullable()
    .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ')
    .notRequired(),
  
  address: Yup.string()
    .nullable()
    .min(5, 'Địa chỉ phải có ít nhất 5 ký tự')
    .notRequired()
});

/**
 * Schema validation cho form thay đổi mật khẩu
 */
export const changePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required('Mật khẩu hiện t��i không được để trống'),
  
  newPassword: Yup.string()
    .required('Mật khẩu mới không được để trống')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .matches(/[0-9]/, 'Mật khẩu phải chứa ít nhất một chữ số')
    .matches(/[A-Z]/, 'Mật khẩu phải chứa ít nhất một chữ hoa')
    .notOneOf([Yup.ref('currentPassword')], 'Mật khẩu mới không được trùng với mật khẩu hiện tại'),
  
  confirmPassword: Yup.string()
    .required('Xác nhận mật khẩu không được để trống')
    .oneOf([Yup.ref('newPassword'), null], 'Mật khẩu xác nhận không khớp')
});

/**
 * Schema validation cho form tạo sản phẩm
 */
export const productSchema = Yup.object().shape({
  title: Yup.string()
    .required('Tên sản phẩm không được để trống')
    .min(3, 'Tên sản phẩm phải có ít nhất 3 ký tự'),
  
  price: Yup.number()
    .required('Giá sản phẩm không được để trống')
    .positive('Giá sản phẩm phải lớn hơn 0'),
  
  description: Yup.string()
    .required('Mô tả sản phẩm không được để trống')
    .min(10, 'Mô tả sản phẩm phải có ít nhất 10 ký tự'),
  
  category: Yup.string()
    .required('Danh mục sản phẩm không được để trống'),
  
  brand: Yup.string()
    .nullable(),
  
  quantity: Yup.number()
    .required('Số lượng sản phẩm không được để trống')
    .integer('Số lượng sản phẩm phải là số nguyên')
    .min(0, 'Số lượng sản phẩm không được ��m'),
  
  images: Yup.array()
    .min(1, 'Sản phẩm phải có ít nhất một hình ảnh')
});

/**
 * Schema validation cho form đánh giá sản phẩm
 */
export const reviewSchema = Yup.object().shape({
  star: Yup.number()
    .required('Đánh giá sao không được để trống')
    .min(1, 'Đánh giá sao phải từ 1 đến 5')
    .max(5, 'Đánh giá sao phải từ 1 đến 5'),
  
  comment: Yup.string()
    .nullable(),
  
  product: Yup.string()
    .required('ID sản phẩm không được để trống')
    .matches(/^[0-9a-fA-F]{24}$/, 'ID sản phẩm không hợp lệ')
});

/**
 * Schema validation cho form tạo đơn hàng
 */
export const orderSchema = Yup.object().shape({
  products: Yup.array()
    .of(
      Yup.object().shape({
        product: Yup.string()
          .required('ID sản phẩm không được để trống')
          .matches(/^[0-9a-fA-F]{24}$/, 'ID sản phẩm không hợp lệ'),
        
        count: Yup.number()
          .required('Số lượng không được để trống')
          .integer('Số lượng phải là số nguyên')
          .min(1, 'Số lượng phải lớn hơn 0')
      })
    )
    .min(1, 'Đơn hàng phải có ít nhất một sản phẩm'),
  
  address: Yup.string()
    .required('Địa chỉ giao hàng không được để trống')
    .min(10, 'Địa chỉ giao hàng phải có ít nhất 10 ký tự'),
  
  paymentMethod: Yup.string()
    .required('Phương thức thanh toán không được để trống')
    .oneOf(['COD', 'CREDIT_CARD', 'PAYPAL', 'MOMO'], 'Phương thức thanh toán không hợp lệ'),
  
  totalPrice: Yup.number()
    .required('Tổng giá trị đơn hàng không được để trống')
    .positive('Tổng giá trị đơn hàng phải lớn hơn 0')
});

/**
 * Schema validation cho form tạo địa chỉ
 */
export const addressSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Họ tên không được để trống')
    .min(3, 'Họ tên phải có ít nhất 3 ký tự'),
  
  phone: Yup.string()
    .required('Số điện thoại không được để trống')
    .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ'),
  
  province: Yup.string()
    .required('Tỉnh/Thành phố không được để trống'),
  
  district: Yup.string()
    .required('Quận/Huyện không được để trống'),
  
  ward: Yup.string()
    .required('Phường/Xã không được để trống'),
  
  street: Yup.string()
    .required('Địa chỉ chi tiết không được để trống')
    .min(5, 'Địa chỉ chi tiết phải có ít nhất 5 ký tự'),
  
  isDefault: Yup.boolean()
});

/**
 * Schema validation cho form tạo mã giảm giá
 */
export const couponSchema = Yup.object().shape({
  name: Yup.string()
    .required('Tên mã giảm giá không được để trống')
    .min(3, 'Tên mã giảm giá phải có ít nhất 3 ký tự')
    .max(30, 'Tên mã giảm giá không được vượt quá 30 ký tự')
    .matches(/^[A-Z0-9_]+$/, 'Tên mã giảm giá chỉ được chứa chữ hoa, số và dấu gạch dưới'),
  
  discount: Yup.number()
    .required('Giá trị giảm giá không được để trống')
    .min(1, 'Giá trị giảm giá phải từ 1% đến 99%')
    .max(99, 'Giá trị giảm giá phải từ 1% đến 99%'),
  
  expiry: Yup.date()
    .required('Ngày hết hạn không được để trống')
    .min(new Date(), 'Ngày hết hạn phải lớn hơn ngày hiện tại'),
  
  isActive: Yup.boolean(),
  
  minOrderAmount: Yup.number()
    .nullable()
    .min(0, 'Giá trị đơn hàng tối thiểu không được âm'),
  
  maxUsage: Yup.number()
    .nullable()
    .integer('Số lần sử dụng tối đa phải là số nguyên')
    .min(1, 'Số lần sử dụng tối đa phải lớn hơn 0')
});

/**
 * Schema validation cho form tạo bài viết
 */
export const blogSchema = Yup.object().shape({
  title: Yup.string()
    .required('Tiêu đề bài viết không được để trống')
    .min(5, 'Tiêu đề bài viết phải có ít nhất 5 ký tự')
    .max(200, 'Tiêu đề bài viết không được vượt quá 200 ký tự'),
  
  description: Yup.string()
    .required('Mô tả bài viết không được để trống')
    .min(10, 'Mô tả bài viết phải có ít nhất 10 ký tự'),
  
  category: Yup.string()
    .required('Danh mục bài viết không được để trống'),
  
  content: Yup.string()
    .required('Nội dung bài viết không được để trống')
    .min(50, 'Nội dung bài viết phải có ít nhất 50 ký tự'),
  
  tags: Yup.array()
    .nullable()
});

/**
 * Schema validation cho form liên hệ
 */
export const contactSchema = Yup.object().shape({
  name: Yup.string()
    .required('Họ tên không được để trống')
    .min(3, 'Họ tên phải có ít nhất 3 ký tự'),
  
  email: Yup.string()
    .required('Email không được để trống')
    .email('Email không hợp lệ'),
  
  phone: Yup.string()
    .nullable()
    .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ'),
  
  subject: Yup.string()
    .required('Tiêu đề không được để trống')
    .min(5, 'Tiêu đề phải có ít nhất 5 ký tự'),
  
  message: Yup.string()
    .required('Nội dung tin nhắn không được để trống')
    .min(10, 'Nội dung tin nhắn phải có ít nhất 10 ký tự')
});

/**
 * Schema validation cho form đăng ký nhận bản tin
 */
export const newsletterSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email không được để trống')
    .email('Email không hợp lệ'),
  
  name: Yup.string()
    .nullable()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
});

/**
 * Schema validation cho form cài đặt SEO
 */
export const seoSchema = Yup.object().shape({
  metaTitle: Yup.string()
    .nullable()
    .min(5, 'Tiêu đề meta phải có ít nhất 5 ký tự')
    .max(70, 'Tiêu đề meta không được vượt quá 70 ký tự'),
  
  metaDescription: Yup.string()
    .nullable()
    .min(50, 'Mô tả meta phải có ít nhất 50 ký tự')
    .max(160, 'Mô tả meta không được vượt quá 160 ký tự'),
  
  metaKeywords: Yup.array()
    .nullable(),
  
  ogTitle: Yup.string()
    .nullable()
    .min(5, 'Tiêu đề Open Graph phải có ít nhất 5 ký tự')
    .max(70, 'Tiêu đề Open Graph không được vượt quá 70 ký tự'),
  
  ogDescription: Yup.string()
    .nullable()
    .min(50, 'Mô tả Open Graph phải có ít nhất 50 ký tự')
    .max(160, 'Mô tả Open Graph không được vượt quá 160 ký tự'),
  
  canonicalUrl: Yup.string()
    .nullable()
    .url('URL chuẩn phải là một URL hợp lệ')
});

/**
 * Schema validation cho form cài đặt chung
 */
export const generalSettingsSchema = Yup.object().shape({
  siteName: Yup.string()
    .nullable()
    .min(2, 'Tên trang web phải có ít nhất 2 ký tự')
    .max(100, 'Tên trang web không được vượt quá 100 ký tự'),
  
  siteDescription: Yup.string()
    .nullable()
    .min(10, 'Mô tả trang web phải có ít nhất 10 ký tự')
    .max(500, 'Mô tả trang web không được vượt quá 500 ký tự'),
  
  contactEmail: Yup.string()
    .nullable()
    .email('Email liên hệ không hợp lệ'),
  
  contactPhone: Yup.string()
    .nullable()
    .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại liên hệ không hợp lệ'),
  
  address: Yup.string()
    .nullable()
    .min(10, 'Địa chỉ phải có ít nhất 10 ký tự')
});