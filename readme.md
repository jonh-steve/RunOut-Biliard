RunOut/
├── create-project.ps1          # Script tạo dự án trên Windows
├── create-project.sh           # Script tạo dự án trên Linux/Mac
├── docker-compose.yml          # Cấu hình Docker Compose để triển khai dự án
├── readme.md                   # Tài liệu mô tả dự án
├── Admin/                      # Thư mục giao diện quản trị viên
│   ├── index.html              # Trang chính của giao diện quản trị
│   ├── login.html              # Trang đăng nhập cho quản trị viên
│   ├── src/                    # Mã nguồn của giao diện quản trị
│   │   ├── app.js              # Tập tin JavaScript chính
│   │   ├── assets/             # Tài nguyên tĩnh (CSS, JS, hình ảnh)
│   │   │   ├── css/            # Các tệp CSS
│   │   │   │   ├── bootstrap.min.css  # Thư viện Bootstrap
│   │   │   │   ├── style.css          # CSS tùy chỉnh
│   │   │   │   ├── switches.css       # CSS cho các công tắc
│   │   │   ├── img/            # Hình ảnh
│   │   │   ├── js/             # Các tệp JavaScript bổ sung
│   │   ├── components/         # Các thành phần giao diện
│   │   │   ├── _header.html    # Header của giao diện
│   │   │   ├── _sidebar.html   # Sidebar của giao diện
│   │   ├── controllers/        # Các controller xử lý logic
│   │   │   ├── AppController.js        # Controller chính
│   │   │   ├── CategoryController.js  # Controller quản lý danh mục
│   │   │   ├── CouponController.js    # Controller quản lý mã giảm giá
│   │   │   ├── ...             # Các controller khác
│   │   ├── pages/              # Các trang giao diện
│   │   │   ├── dashboard.html  # Trang dashboard
│   │   │   ├── category/       # Trang quản lý danh mục
│   │   │   ├── ...             # Các trang khác
│   │   ├── services/           # Các dịch vụ hỗ trợ
│   │   │   ├── APIServices.js  # Dịch vụ gọi API
│   │   │   ├── DataServices.js # Dịch vụ xử lý dữ liệu
├── Server/                     # Backend của dự án
│   ├── package.json            # Cấu hình Node.js và các thư viện
│   ├── server.js               # Điểm khởi động của server
│   ├── configs/                # Cấu hình server
│   │   ├── Cloudinary.js       # Cấu hình Cloudinary để lưu trữ hình ảnh
│   │   ├── ConnectDB.js        # Kết nối cơ sở dữ liệu
│   │   ├── CreateAdmin.js      # Tạo tài khoản admin mặc định
│   │   ├── sucurity.js         # Cấu hình bảo mật
│   ├── controllers/            # Các controller xử lý API
│   │   ├── bill.js             # Xử lý hóa đơn
│   │   ├── blog.js             # Xử lý bài viết
│   │   ├── ...                 # Các controller khác
│   ├── middlewares/            # Các middleware
│   │   ├── ErrorHandler.js     # Xử lý lỗi
│   │   ├── jwt.js              # Xử lý JWT
│   │   ├── verifyToken.js      # Middleware xác thực token
│   ├── models/                 # Các model cơ sở dữ liệu
│   │   ├── bill.js             # Model hóa đơn
│   │   ├── blog.js             # Model bài viết
│   │   ├── ...                 # Các model khác
│   ├── routes/                 # Các route API
│   │   ├── bill.js             # Route hóa đơn
│   │   ├── blog.js             # Route bài viết
│   │   ├── ...                 # Các route khác
│   ├── utils/                  # Các tiện ích
│   │   ├── sendMail.js         # Gửi email
├── User/                       # Giao diện người dùng
│   ├── index.html              # Trang chính của giao diện người dùng
│   ├── src/                    # Mã nguồn của giao diện người dùng
│   │   ├── app.js              # Tập tin JavaScript chính
│   │   ├── assets/             # Tài nguyên tĩnh (CSS, JS, hình ảnh)
│   │   ├── components/         # Các thành phần giao diện
│   │   │   ├── _footer.html    # Footer của giao diện
│   │   │   ├── _header.html    # Header của giao diện
│   │   ├── controllers/        # Các controller xử lý logic
│   │   │   ├── AppController.js        # Controller chính
│   │   │   ├── CartController.js      # Controller giỏ hàng
│   │   │   ├── ...             # Các controller khác
│   │   ├── pages/              # Các trang giao diện
│   │   │   ├── cart.html       # Trang giỏ hàng
│   │   │   ├── checkout.html   # Trang thanh toán
│   │   │   ├── ...             # Các trang khác
│   │   ├── services/           # Các dịch vụ hỗ trợ
│   │   │   ├── ApiServices.js  # Dịch vụ gọi API
│   │   │   ├── DataServices.js # Dịch vụ xử lý dữ liệu
