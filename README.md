# Client Application

Đây là ứng dụng client được phát triển theo kế hoạch đồng bộ hóa từ thư mục User sang thư mục Client.

## Cài đặt

```bash
# Clone repository
git clone <repository-url>
cd client

# Cài đặt dependencies
npm install
```

## Phát triển

```bash
# Chạy ứng dụng ở chế độ development
npm start

# Kiểm tra lỗi linting
npm run lint

# Sửa lỗi linting tự động
npm run lint:fix

# Format code
npm run format
```

## Kiểm thử

```bash
# Chạy tests
npm test
```

## Build

```bash
# Build ứng dụng cho production
npm run build
```

## Cấu trúc thư mục

```
.
├── .qodo
├── RunOut
│   ├── Admin
│   │   ├── index.html
│   │   ├── login.html
│   │   ├── src
│   │   │   ├── app.js
│   │   │   ├── assets
│   │   │   │   ├── css
│   │   │   │   │   ├── bootstrap.min.css
│   │   │   │   │   ├── style.css
│   │   │   │   │   └── switches.css
│   │   │   │   ├── img
│   │   │   │   │   ├── ao2.webp
│   │   │   │   │   ├── ao4.webp
│   │   │   │   │   ├── avatar.jpg
│   │   │   │   │   ├── favicon.webp
│   │   │   │   │   ├── logo2.png
│   │   │   │   │   ├── logo_run_out1.jpg
│   │   │   │   │   ├── logo_steve.png
│   │   │   │   │   ├── logo.svg
│   │   │   │   │   ├── runout_logo2-Photoroom.png
│   │   │   │   │   ├── runout_no_backgound.png
│   │   │   │   │   └── sp1 (1).webp
│   │   │   │   └── js
│   │   │   │       ├── angular-cookie.js
│   │   │   │       ├── angular.js
│   │   │   │       ├── angular-jwt.js
│   │   │   │       ├── angular-router.js
│   │   │   │       ├── bootstrap.bundle.min.js
│   │   │   │       ├── chart.js
│   │   │   │       ├── data-location.json
│   │   │   │       ├── file.js
│   │   │   │       ├── img-preview.js
│   │   │   │       ├── script.js
│   │   │   │       └── ui-switchery.js
│   │   │   ├── components
│   │   │   │   ├── _header.html
│   │   │   │   └── _sidebar.html
│   │   │   ├── controllers
│   │   │   │   ├── AppController.js
│   │   │   │   ├── CategoryController.js
│   │   │   │   ├── CouponController.js
│   │   │   │   ├── DashboardController.js
│   │   │   │   ├── FeedbackController.js
│   │   │   │   ├── LoginController.js
│   │   │   │   ├── OrderController.js
│   │   │   │   ├── ProductController.js
│   │   │   │   └── UserController.js
│   │   │   ├── pages
│   │   │   │   ├── category
│   │   │   │   │   └── category.html
│   │   │   │   ├── coupon
│   │   │   │   │   ├── add.html
│   │   │   │   │   └── coupon.html
│   │   │   │   ├── dashboard.html
│   │   │   │   ├── feedback
│   │   │   │   │   ├── feedback-detail.html
│   │   │   │   │   └── feedback.html
│   │   │   │   ├── order
│   │   │   │   │   ├── detail.html
│   │   │   │   │   └── order.html
│   │   │   │   ├── product
│   │   │   │   │   ├── add.html
│   │   │   │   │   ├── edit.html
│   │   │   │   │   └── product.html
│   │   │   │   ├── statistical
│   │   │   │   │   └── statistical.html
│   │   │   │   └── user
│   │   │   │       ├── add.html
│   │   │   │       ├── edit.html
│   │   │   │       └── user.html
│   │   │   └── services
│   │   │       ├── APIServices.js
│   │   │       └── DataServices.js
│   │   └── .vscode
│   │       └── settings.json
│   ├── client
│   │   ├── node_modules
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   └── src
│   │       ├── assets
│   │       ├── components
│   │       │   ├── common
│   │       │   │   ├── FormikValidation.jsx
│   │       │   │   └── FormValidation.jsx
│   │       │   ├── features
│   │       │   └── layout
│   │       ├── config
│   │       ├── context
│   │       ├── hooks
│   │       │   ├── useFormikValidation.js
│   │       │   └── useFormValidation.js
│   │       ├── pages
│   │       ├── schemas
│   │       │   └── validationSchema.js
│   │       ├── services
│   │       │   ├── adapters
│   │       │   └── api
│   │       ├── store
│   │       ├── styles
│   │       ├── types
│   │       ├── utils
│   │       │   └── validationUtils.js
│   │       └── validators
│   │           ├── addressValidator.js
│   │           ├── adminValidator.js
│   │           ├── blogValidator.js
│   │           ├── brandValidator.js
│   │           ├── cartValidator.js
│   │           ├── contactValidator.js
│   │           ├── couponValidator.js
│   │           ├── index.js
│   │           ├── newsletterValidator.js
│   │           ├── notificationValidator.js
│   │           ├── orderValidator.js
│   │           ├── paymentValidator.js
│   │           ├── productValidator.js
│   │           ├── reviewValidator.js
│   │           ├── seoValidator.js
│   │           ├── settingsValidator.js
│   │           └── wishlistValidator.js
│   ├── create-project.ps1
│   ├── create-project.sh
│   ├── docker-compose.yml
│   ├── docs
│   │   ├── api-migration-guide.md
│   │   ├── huongdandongbo-phan-tiep-theo.md
│   │   ├── huongDanSuDungAdapter.md
│   │   ├── ke-hoach-dong-bo-hoa.md
│   │   ├── migration-guide.md
│   │   ├── summary.md
│   │   ├── sync-plan.md
│   │   └── sync-plan-supplement
│   │       ├── chien-luoc-ui.md
│   │       ├── huong-dan-phat-trien.md
│   │       ├── huong-dan-su-dung-bo-sung.md
│   │       ├── huong-dan-su-dung.md
│   │       ├── ke-hoach-accessibility.md
│   │       ├── ke-hoach-dao-tao.md
│   │       ├── ke-hoach-kiem-thu.md
│   │       ├── ke-hoach-quoc-te-hoa.md
│   │       ├── ke-hoach-trien-khai.md
│   │       ├── kien-truc-tong-the.md
│   │       ├── phan-tich-chi-phi-loi-ich.md
│   │       └── phan-tich-hien-trang.md
│   ├── .DS_Store
│   ├── .env.development
│   ├── .env.production
│   ├── .eslintrc.js
│   ├── giai-doan-1-chuan-bi
│   │   ├── 1.1-thiet-lap-du-an
│   │   │   ├── .env.example
│   │   │   ├── package.json
│   │   │   └── README.md
│   │   ├── 1.3-component-co-ban
│   │   │   ├── Alert
│   │   │   │   ├── Alert.client.jsx
│   │   │   │   ├── Alert.jsx
│   │   │   │   └── README.md
│   │   │   ├── Button
│   │   │   │   ├── Button.client.jsx
│   │   │   │   └── Button.jsx
│   │   │   ├── Card
│   │   │   │   ├── Card.client.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   └── README.md
│   │   │   ├── Form
│   │   │   │   ├── Form.client.jsx
│   │   │   │   ├── Form.jsx
│   │   │   │   └── README.md
│   │   │   ├── Input
│   │   │   │   ├── Input.client.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   └── README.md
│   │   │   ├── Loader
│   │   │   │   ├── Loader.client.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   └── README.md
│   │   │   ├── Modal
│   │   │   │   ├── Modal.client.jsx
│   │   │   │   └── Modal.jsx
│   │   │   └── Typography
│   │   │       ├── README.md
│   │   │       ├── Typography.client.jsx
│   │   │       └── Typography.jsx
│   │   └── 1.4-routing
│   │       ├── AuthGuard.jsx
│   │       ├── GuestGuard.jsx
│   │       ├── README.md
│   │       ├── RouterConfig.jsx
│   │       ├── routes.client.js
│   │       └── routes.js
│   ├── giai-doan-2-xay-dung-nen-tang
│   │   ├── 2.1-service-api
│   │   │   ├── api-client.js
│   │   │   ├── auth-service
│   │   │   │   ├── AuthService.client.js
│   │   │   │   └── AuthService.js
│   │   │   ├── order-service
│   │   │   │   ├── OrderService.client.js
│   │   │   │   └── OrderService.js
│   │   │   ├── product-service
│   │   │   │   ├── ProductService.client.js
│   │   │   │   └── ProductService.js
│   │   │   └── user-service
│   │   │       ├── UserService.client.js
│   │   │       └── UserService.js
│   │   ├── 2.2-he-thong-xac-thuc
│   │   │   ├── AuthContext.jsx
│   │   │   ├── authUtils.js
│   │   │   └── useAuth.js
│   │   ├── 2.3-trien-khai-quan-ly-trang-thai
│   │   │   ├── AppProviders.jsx
│   │   │   ├── CartContext.jsx
│   │   │   ├── NotificationContext.jsx
│   │   │   ├── Notification.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   ├── useCart.js
│   │   │   ├── useNotification.js
│   │   │   └── useTheme.js
│   │   └── 2.4-tich-hop-ung-dung
│   │       ├── App.jsx
│   │       └── index.jsx
│   ├── giai-doan-3-trien-khai-ui
│   │   └── 3.1-layout
│   │       └── Header
│   │           └── Header.jsx
│   ├── .git
│   ├── .gitignore
│   ├── huongdandongbo.md
│   ├── package.json
│   ├── .prettierrc
│   ├── .qodo
│   ├── readme.md
│   ├── README.md
│   ├── run.md
│   ├── Server
│   │   ├── configs
│   │   │   ├── Cloudinary.js
│   │   │   ├── ConnectDB.js
│   │   │   ├── CreateAdmin.js
│   │   │   └── sucurity.js
│   │   ├── controllers
│   │   │   ├── bill.js
│   │   │   ├── blogCategory.js
│   │   │   ├── blog.js
│   │   │   ├── brand.js
│   │   │   ├── category.js
│   │   │   ├── coupon.js
│   │   │   ├── product.js
│   │   │   └── user.js
│   │   ├── .env
│   │   ├── .gitignore
│   │   ├── middlewares
│   │   │   ├── ErrorHandler.js
│   │   │   ├── jwt.js
│   │   │   ├── rateLimit.js
│   │   │   ├── validation.js
│   │   │   ├── validators
│   │   │   │   ├── addressValidator.js
│   │   │   │   ├── adminValidator.js
│   │   │   │   ├── billValidator.js
│   │   │   │   ├── blogValidator.js
│   │   │   │   ├── brandValidator.js
│   │   │   │   ├── cartValidator.js
│   │   │   │   ├── categoryValidator.js
│   │   │   │   ├── contactValidator.js
│   │   │   │   ├── couponValidator.js
│   │   │   │   ├── index.js
│   │   │   │   ├── newsletterValidator.js
│   │   │   │   ├── notificationValidator.js
│   │   │   │   ├── orderValidator.js
│   │   │   │   ├── paymentValidator.js
│   │   │   │   ├── productValidator.js
│   │   │   │   ├── reviewValidator.js
│   │   │   │   ├── seoValidator.js
│   │   │   │   ├── settingsValidator.js
│   │   │   │   ├── userValidator.js
│   │   │   │   └── wishlistValidator.js
│   │   │   └── verifyToken.js
│   │   ├── models
│   │   │   ├── bill.js
│   │   │   ├── blogCategory.js
│   │   │   ├── blog.js
│   │   │   ├── brand.js
│   │   │   ├── category.js
│   │   │   ├── coupon.js
│   │   │   ├── product.js
│   │   │   └── user.js
│   │   ├── node_modules
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   ├── routes
│   │   │   ├── bill.js
│   │   │   ├── blogCategory.js
│   │   │   ├── blog.js
│   │   │   ├── brand.js
│   │   │   ├── category.js
│   │   │   ├── coupon.js
│   │   │   ├── index.js
│   │   │   ├── product.js
│   │   │   └── user.js
│   │   ├── server.js
│   │   ├── test
│   │   ├── utils
│   │   │   └── sendMail.js
│   │   └── yarn.lock
│   ├── src
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── components
│   │   │   ├── common
│   │   │   │   ├── Button.css
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.css
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Input.css
│   │   │   │   ├── Input.jsx
│   │   │   │   └── UIWrapper.js
│   │   │   ├── features
│   │   │   │   ├── Search
│   │   │   │   │   ├── SearchBar.css
│   │   │   │   │   └── SearchBar.jsx
│   │   │   │   └── Wishlist
│   │   │   │       ├── WishlistButton.css
│   │   │   │       └── WishlistButton.jsx
│   │   │   └── layout
│   │   │       ├── Footer.css
│   │   │       ├── Footer.jsx
│   │   │       ├── Header.css
│   │   │       ├── Header.jsx
│   │   │       ├── Layout.css
│   │   │       ├── Layout.jsx
│   │   │       ├── Sidebar.css
│   │   │       └── Sidebar.jsx
│   │   ├── context
│   │   │   ├── AppProvider.jsx
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   └── WishlistContext.jsx
│   │   ├── hooks
│   │   │   ├── useDebounce.js
│   │   │   ├── useFetch.js
│   │   │   ├── useForm.js
│   │   │   └── useLocalStorage.js
│   │   ├── index.css
│   │   ├── index.jsx
│   │   ├── pages
│   │   │   ├── AuthPage.css
│   │   │   ├── AuthPage.jsx
│   │   │   ├── CartPage.css
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.css
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── HomePage.css
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProductDetailPage.css
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── ProductsPage.css
│   │   │   ├── ProductsPage.jsx
│   │   │   ├── ProfilePage.css
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── WishlistPage.css
│   │   │   └── WishlistPage.jsx
│   │   ├── services
│   │   │   ├── adapters
│   │   │   │   └── apiAdapter.js
│   │   │   ├── api
│   │   │   │   ├── authService.js
│   │   │   │   ├── axiosConfig.js
│   │   │   │   ├── cartService.js
│   │   │   │   ├── productService.js
│   │   │   │   └── userService.js
│   │   │   ├── apiAdapter.js
│   │   │   ├── authAdapter.js
│   │   │   ├── dataFetchingAdapter.js
│   │   │   ├── errorHandlingAdapter.js
│   │   │   ├── formAdapter.js
│   │   │   ├── i18nAdapter.js
│   │   │   ├── notificationAdapter.js
│   │   │   ├── routeAdapter.js
│   │   │   ├── storageAdapter.js
│   │   │   └── theme
│   │   │       └── themeAdapter.js
│   │   ├── state
│   │   │   └── stateAdapter.js
│   │   └── utils
│   │       ├── formatUtils.js
│   │       ├── storageUtils.js
│   │       └── validationUtils.js
│   ├── tempfor_gen.js
│   ├── tools
│   │   ├── api-analyzer.js
│   │   ├── api-mapping-tool.js
│   │   ├── component-consistency-checker.js
│   │   ├── component-conversion-cli.js
│   │   ├── folder-structure-analyzer.js
│   │   ├── mui-to-tailwind.js
│   │   ├── route-mapping-tool.js
│   │   ├── state-management-analyzer.js
│   │   ├── user-folder-analysis.json
│   │   └── utility-adapter.js
│   ├── txt.txt
│   ├── User
│   │   ├── index.html
│   │   ├── src
│   │   │   ├── app.js
│   │   │   ├── assets
│   │   │   │   ├── css
│   │   │   │   │   ├── animation.css
│   │   │   │   │   ├── boostrap.min.css
│   │   │   │   │   └── custom.css
│   │   │   │   ├── img
│   │   │   │   │   ├── icon
│   │   │   │   │   │   ├── app_store.svg
│   │   │   │   │   │   ├── avatar.png
│   │   │   │   │   │   ├── background_blog.jpg
│   │   │   │   │   │   ├── banner1.webp
│   │   │   │   │   │   ├── banner2.webp
│   │   │   │   │   │   ├── bocongthuong (1).svg
│   │   │   │   │   │   ├── chung-nhan-chinh-hang.webp
│   │   │   │   │   │   ├── EmtyReview.86be870e.svg
│   │   │   │   │   │   ├── f90a9027dcd34b969f1bc90d345ded0d_optimized_original_image.webp
│   │   │   │   │   │   ├── favicon.webp
│   │   │   │   │   │   ├── footer-logo.webp
│   │   │   │   │   │   ├── google_play.svg
│   │   │   │   │   │   ├── icon-bag-2.svg
│   │   │   │   │   │   ├── icon-bag-3.svg
│   │   │   │   │   │   ├── icon-bag-4.svg
│   │   │   │   │   │   ├── icon-bag-5.svg
│   │   │   │   │   │   ├── icon-bag.svg
│   │   │   │   │   │   ├── icon-cart-2.svg
│   │   │   │   │   │   ├── icon-cart-3.svg
│   │   │   │   │   │   ├── icon-cart-plus.svg
│   │   │   │   │   │   ├── icon-cart.svg
│   │   │   │   │   │   ├── icon-check.svg
│   │   │   │   │   │   ├── icon-circle-arrow.svg
│   │   │   │   │   │   ├── icon-delivery.svg
│   │   │   │   │   │   ├── icon-fb2.svg
│   │   │   │   │   │   ├── icon-fb.svg
│   │   │   │   │   │   ├── icon-fls.png
│   │   │   │   │   │   ├── icon-fls.svg
│   │   │   │   │   │   ├── icon-gg.svg
│   │   │   │   │   │   ├── icon-lc.svg
│   │   │   │   │   │   ├── icon-like.svg
│   │   │   │   │   │   ├── icon-money-2.svg
│   │   │   │   │   │   ├── icon-money.svg
│   │   │   │   │   │   ├── icon-payment.svg
│   │   │   │   │   │   ├── icon-special.svg
│   │   │   │   │   │   ├── icon-support.svg
│   │   │   │   │   │   ├── icon-toptop.svg
│   │   │   │   │   │   ├── icon-tracking.svg
│   │   │   │   │   │   ├── icon-truck.svg
│   │   │   │   │   │   ├── icon-user-circle.svg
│   │   │   │   │   │   ├── icon-user.svg
│   │   │   │   │   │   ├── icon-ytb.svg
│   │   │   │   │   │   ├── icon-zalo.svg
│   │   │   │   │   │   ├── logo.svg
│   │   │   │   │   │   ├── logo-white.svg
│   │   │   │   │   │   ├── qrcode2.svg
│   │   │   │   │   │   └── store-bg.jpg
│   │   │   │   │   └── product
│   │   │   │   │       ├── 17085842809257720.webp
│   │   │   │   │       ├── 77ab3bceae124015949c1df535d6ba86_optimized_original_image.webp
│   │   │   │   │       ├── apl1.webp
│   │   │   │   │       ├── asmn1.webp
│   │   │   │   │       ├── asmn2.webp
│   │   │   │   │       ├── cf7bf4bc26dd4dc9b801354b8e4b8148_optimized_original_image.webp
│   │   │   │   │       ├── chan-vay-chong-nang.webp
│   │   │   │   │       ├── polo-co-vai-tron.webp
│   │   │   │   │       ├── size_guide.webp
│   │   │   │   │       ├── sp1.webp
│   │   │   │   │       ├── sp2.webp
│   │   │   │   │       ├── sp3.webp
│   │   │   │   │       └── sp4.webp
│   │   │   │   └── js
│   │   │   │       ├── angular-cookie.js
│   │   │   │       ├── angular.js
│   │   │   │       ├── angular-jwt.js
│   │   │   │       ├── angular-router.js
│   │   │   │       ├── data-location.json
│   │   │   │       └── sweet-alert.js
│   │   │   ├── components
│   │   │   │   ├── _footer.html
│   │   │   │   └── _header.html
│   │   │   ├── controllers
│   │   │   │   ├── AppController.js
│   │   │   │   ├── CartController.js
│   │   │   │   ├── CheckoutController.js
│   │   │   │   ├── DetailController.js
│   │   │   │   ├── ForgotPasswotdController.js
│   │   │   │   ├── HomeController.js
│   │   │   │   ├── LoginController.js
│   │   │   │   ├── LookupController.js
│   │   │   │   ├── ProductController.js
│   │   │   │   ├── ProfileController.js
│   │   │   │   ├── RegisterController.js
│   │   │   │   ├── ResetPasswordController.js
│   │   │   │   ├── SearchController.js
│   │   │   │   ├── UserOrderController.js
│   │   │   │   └── UserWhishlistController.js
│   │   │   ├── pages
│   │   │   │   ├── cart.html
│   │   │   │   ├── checkout.html
│   │   │   │   ├── forgot-password.html
│   │   │   │   ├── home.html
│   │   │   │   ├── login.html
│   │   │   │   ├── look-up-order.html
│   │   │   │   ├── product-detail.html
│   │   │   │   ├── product.html
│   │   │   │   ├── profile.html
│   │   │   │   ├── register.html
│   │   │   │   ├── reset-password.html
│   │   │   │   ├── user-order.html
│   │   │   │   └── wishlist.html
│   │   │   └── services
│   │   │       ├── ApiServices.js
│   │   │       └── DataServices.js
│   │   └── .vscode
│   │       └── settings.json
│   └── .vscode
│       └── launch.json
├── TokyoLife.zip
└── txt.txt
```

## Môi trường

Ứng dụng sử dụng các biến môi trường sau:

- `REACT_APP_API_URL`: URL của API server
- `REACT_APP_ENV`: Môi trường hiện tại (development, production)
- `REACT_APP_DEBUG`: Bật/tắt chế độ debug

## Quy trình phát triển

1. Tạo nhánh từ `main` cho tính năng mới
2. Phát triển và kiểm thử tính năng
3. Tạo pull request để merge vào `main`
4. Code review và approval
5. Merge vào `main`

## Liên hệ

Nếu có bất kỳ câu hỏi hoặc góp ý nào, vui lòng liên hệ với team phát triển.