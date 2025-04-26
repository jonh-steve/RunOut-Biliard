## Tài liệu hướng dẫn sử dụng

### 1. Giới thiệu

#### 1.1. Mục đích

Tài liệu này cung cấp hướng dẫn chi tiết về cách sử dụng ứng dụng Client mới, được phát triển để thay thế cho ứng dụng User hiện tại. Hướng dẫn này bao gồm tất cả các tính năng, chức năng và thay đổi quan trọng mà người dùng cần biết.

#### 1.2. Đối tượng sử dụng

- **Người dùng cuối**: Những người sử dụng ứng dụng để mua sắm, quản lý tài khoản, v.v.
- **Nhân viên hỗ trợ**: Những người cần hiểu ứng dụng để hỗ trợ người dùng
- **Quản trị viên**: Những người quản lý và giám sát hệ thống

#### 1.3. Các thay đổi chính

- Giao diện người dùng mới với Tailwind CSS thay vì Material UI
- Cải thiện hiệu suất và tốc độ tải trang
- Bổ sung các tính năng mới (chi tiết trong phần tương ứng)
- Cải thiện trải nghiệm người dùng trên thiết bị di động

### 2. Bắt đ��u

#### 2.1. Truy cập ứng dụng

Ứng dụng Client mới có thể được truy cập tại: `https://example.com`

Nếu bạn đang sử dụng ứng dụng User cũ, bạn sẽ được tự động chuyển hướng đến ứng dụng mới hoặc có tùy chọn để chuyển đổi.

#### 2.2. Yêu cầu hệ thống

- **Trình duyệt hỗ trợ**:
  - Google Chrome (phiên bản 90 trở lên)
  - Mozilla Firefox (phiên bản 88 trở lên)
  - Safari (phiên bản 14 trở lên)
  - Microsoft Edge (phiên bản 90 trở lên)
- **Thiết bị**: Máy tính, tablet, hoặc điện thoại thông minh
- **Kết nối internet**: Tối thiểu 1 Mbps

#### 2.3. Đăng ký và đăng nhập

##### Đăng ký tài khoản mới

1. Truy cập trang chủ và nhấp vào nút "Đăng ký" ở góc trên bên phải
2. Điền thông tin cá nhân vào form đăng ký:
   - Email
   - Mật khẩu (ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số)
   - Tên
   - Số điện thoại
3. Đọc và chấp nhận Điều khoản dịch vụ và Chính sách bảo mật
4. Nhấp vào nút "Đăng ký"
5. Xác nhận email của bạn bằng cách nhấp vào liên kết trong email xác nhận

##### Đăng nhập

1. Truy cập trang chủ và nhấp vào nút "Đăng nhập" ở góc trên bên phải
2. Nhập email và mật khẩu của bạn
3. (Tùy chọn) Đánh dấu "Ghi nhớ đăng nhập" để duy trì phiên đăng nhập
4. Nhấp vào nút "Đăng nhập"

##### Quên mật khẩu

1. Trên trang đăng nhập, nhấp vào liên kết "Quên mật khẩu?"
2. Nhập email đã đăng ký của bạn
3. Nhấp vào nút "Gửi liên kết đặt lại mật khẩu"
4. Kiểm tra email của bạn và làm theo hướng dẫn để đặt lại mật khẩu

### 3. Giao diện người dùng

#### 3.1. Trang chủ

![Trang chủ](../assets/images/home-page.png)

Trang chủ bao gồm các phần sau:

1. **Header**: Chứa logo, thanh tìm kiếm, liên kết đến giỏ hàng và tài khoản
2. **Banner chính**: Hiển thị các khuyến mãi và sản phẩm nổi bật
3. **Danh mục sản phẩm**: Hiển thị các danh mục sản phẩm chính
4. **Sản phẩm nổi bật**: Hiển thị các sản phẩm được đề xuất
5. **Sản phẩm mới**: Hiển thị các sản phẩm mới nhất
6. **Khuyến mãi**: Hiển thị các khuyến mãi đang diễn ra
7. **Footer**: Chứa thông tin liên hệ, liên kết hữu ích và đăng ký nhận tin

#### 3.2. Thanh điều hướng

Thanh điều hướng chính nằm ở phía trên của mỗi trang và bao gồm:

- **Logo**: Nhấp để quay lại trang chủ
- **Danh mục**: Menu dropdown với các danh mục sản phẩm
- **Tìm kiếm**: Thanh tìm kiếm sản phẩm
- **Giỏ hàng**: Hiển thị số lượng sản phẩm trong giỏ hàng
- **Tài khoản**: Truy cập thông tin tài khoản hoặc đăng nhập/đăng ký

#### 3.3. Footer

Footer xuất hiện ở cuối mỗi trang và bao gồm:

- **Thông tin công ty**: Tên, địa chỉ, số điện thoại
- **Liên kết hữu ích**: Về chúng tôi, Chính sách bảo mật, Điều khoản dịch vụ
- **Dịch vụ khách hàng**: Liên hệ, FAQ, Trả hàng
- **Đăng ký nhận tin**: Form đăng ký email để nhận thông tin khuyến mãi
- **Mạng xã hội**: Liên kết đến các trang mạng xã hội

### 4. Tính năng chính

#### 4.1. Tìm kiếm sản phẩm

##### Tìm kiếm cơ bản

1. Nhấp vào thanh tìm kiếm ở header
2. Nhập từ khóa tìm kiếm
3. Nhấn Enter hoặc nhấp vào biểu tượng tìm kiếm

##### Tìm kiếm nâng cao

1. Nhấp vào "Tìm kiếm nâng cao" bên dưới thanh tìm kiếm
2. Chọn các bộ lọc:
   - Danh mục
   - Giá (từ - đến)
   - Thương hiệu
   - Đánh giá
   - Các thuộc tính khác
3. Nhấp vào nút "Áp dụng"

#### 4.2. Xem sản phẩm

##### Danh sách sản phẩm

![Danh sách sản phẩm](../assets/images/product-list.png)

Trang danh sách sản phẩm hiển thị:

- Hình ảnh sản phẩm
- Tên sản phẩm
- Giá (và giá khuyến mãi nếu có)
- Đánh giá (số sao)
- Nút "Thêm vào giỏ hàng"

Bạn có thể:
- **Lọc** sản phẩm theo danh mục, giá, thương hiệu, v.v.
- **Sắp xếp** sản phẩm theo giá, đánh giá, mới nhất, v.v.
- **Phân trang** để xem thêm sản phẩm

##### Chi tiết sản phẩm

![Chi tiết sản phẩm](../assets/images/product-detail.png)

Trang chi tiết sản phẩm hiển thị:

- Hình ảnh sản phẩm (có thể phóng to và xem nhiều hình)
- Tên sản phẩm
- Giá và khuyến mãi
- Mô tả sản phẩm
- Thông số kỹ thuật
- Đánh giá từ khách hàng
- Sản phẩm liên quan

Các tính năng:
- **Chọn số lượng** sản phẩm
- **Thêm vào giỏ hàng**
- **Mua ngay**
- **Thêm vào danh sách yêu thích**
- **Chia sẻ** sản phẩm qua mạng xã hội

#### 4.3. Giỏ hàng

##### Xem giỏ hàng

1. Nhấp vào biểu tượng giỏ hàng ở header
2. Xem danh sách sản phẩm trong giỏ hàng:
   - Hình ảnh sản phẩm
   - Tên sản phẩm
   - Giá
   - Số lượng
   - Tổng tiền

##### Cập nhật giỏ hàng

- **Thay đổi số lượng**: Sử dụng nút +/- hoặc nhập số lượng trực tiếp
- **Xóa sản phẩm**: Nhấp vào biểu tượng thùng rác bên cạnh sản phẩm
- **Xóa tất cả**: Nhấp vào nút "Xóa tất cả" ở dưới cùng
- **Áp dụng mã giảm giá**: Nhập mã giảm giá vào ô và nhấp "Áp dụng"

##### Tiến hành thanh toán

1. Kiểm tra lại giỏ hàng
2. Nhấp vào nút "Tiến hành thanh toán"

#### 4.4. Thanh toán

##### Thông tin giao hàng

1. Nhập thông tin giao hàng:
   - Tên người nhận
   - Địa chỉ
   - Số điện thoại
   - Ghi chú (nếu có)
2. Chọn phương thức giao hàng:
   - Giao hàng tiêu chuẩn
   - Giao hàng nhanh
   - Giao trong ngày

##### Phương thức thanh toán

Chọn một trong các phương thức thanh toán:
- **Thanh toán khi nhận hàng (COD)**
- **Thẻ tín dụng/ghi nợ**
- **Ví điện tử** (MoMo, ZaloPay, v.v.)
- **Chuyển khoản ngân hàng**

##### Xác nhận đơn hàng

1. Kiểm tra lại thông tin đơn hàng:
   - Sản phẩm
   - Thông tin giao hàng
   - Phương thức thanh toán
   - Tổng tiền
2. Nhấp vào nút "Đặt hàng"
3. Nhận xác nhận đơn hàng qua email và SMS

#### 4.5. Quản lý tài khoản

##### Thông tin cá nhân

1. Đăng nhập vào tài khoản
2. Nhấp vào tên người dùng ở góc trên bên phải
3. Chọn "Thông tin cá nhân"
4. Xem và cập nhật:
   - Tên
   - Email
   - Số điện thoại
   - Ngày sinh
   - Giới tính

##### Địa chỉ

1. Trong trang tài khoản, chọn "Địa chỉ"
2. Xem danh sách địa chỉ đã lưu
3. Thêm địa chỉ mới:
   - Nhấp vào "Thêm địa chỉ mới"
   - Điền thông tin địa chỉ
   - Nhấp vào "Lưu"
4. Chỉnh sửa hoặc xóa địa chỉ hiện c��

##### Đơn hàng

1. Trong trang tài khoản, chọn "Đơn hàng"
2. Xem danh sách đơn hàng với trạng thái:
   - Chờ xác nhận
   - Đang xử lý
   - Đang giao hàng
   - Đã giao hàng
   - Đã hủy
3. Nhấp vào một đơn hàng để xem chi tiết
4. Thực hiện các hành động:
   - Hủy đơn hàng (nếu chưa xử lý)
   - Theo dõi đơn hàng
   - Đánh giá sản phẩm (sau khi nhận hàng)

##### Danh sách yêu thích

1. Trong trang tài khoản, chọn "Danh sách yêu thích"
2. Xem các sản phẩm đã thêm vào danh sách
3. Thêm vào giỏ hàng hoặc xóa khỏi danh sách

### 5. Tính năng mới

#### 5.1. So sánh sản phẩm

1. Trong trang danh sách sản phẩm, đánh dấu vào ô "So sánh" bên cạnh sản phẩm
2. Chọn tối đa 4 sản phẩm để so sánh
3. Nhấp vào nút "So sánh" ở dưới cùng
4. Xem bảng so sánh chi tiết các thông số kỹ thuật

#### 5.2. Đánh giá sản phẩm

1. Sau khi nhận hàng, vào "Đơn hàng" trong tài khoản
2. Tìm đơn hàng đã giao và nhấp vào "Đánh giá"
3. Chọn số sao (1-5)
4. Viết nhận xét về sản phẩm
5. (Tùy chọn) Tải lên hình ảnh sản phẩm
6. Nhấp vào "Gửi đánh giá"

#### 5.3. Thông báo

1. Nhấp vào biểu tượng chuông ở header
2. Xem danh sách thông báo:
   - Cập nhật đơn hàng
   - Khuyến mãi mới
   - Thông báo hệ thống
3. Đánh dấu đã đọc hoặc xóa thông báo

#### 5.4. Chế độ tối (Dark Mode)

1. Nhấp vào biểu tượng mặt trăng/mặt trời ở góc dưới bên phải
2. Chuyển đổi giữa chế độ sáng và tối
3. Hệ thống sẽ ghi nhớ tùy chọn của bạn cho lần truy cập tiếp theo

### 6. Hỗ trợ và trợ giúp

#### 6.1. Trung tâm trợ giúp

1. Nhấp vào "Trợ giúp" ở footer
2. Duyệt qua các danh mục câu hỏi thường gặp (FAQ)
3. Tìm kiếm câu hỏi cụ thể
4. Xem hướng dẫn sử dụng chi tiết

#### 6.2. Liên hệ hỗ trợ

Bạn có thể liên hệ với đội ngũ hỗ trợ qua:

- **Live chat**: Nhấp vào biểu tượng chat ở góc d��ới bên phải
- **Email**: support@example.com
- **Điện thoại**: 1900-xxxx (8:00 - 20:00, thứ Hai - Chủ nhật)
- **Form liên hệ**: Điền thông tin vào form tại trang "Liên hệ"

#### 6.3. Báo cáo vấn đề

1. Nhấp vào "Báo cáo vấn đề" ở footer
2. Chọn loại vấn đề:
   - Lỗi kỹ thuật
   - Vấn đề về sản phẩm
   - Vấn đề về thanh toán
   - Khác
3. Mô tả chi tiết vấn đề
4. (Tùy chọn) Tải lên ảnh chụp màn hình
5. Nhấp vào "Gửi báo cáo"

### 7. Các mẹo và thủ thuật

#### 7.1. Tìm kiếm nhanh

- Sử dụng phím tắt `/` để focus vào thanh tìm kiếm
- Sử dụng cú pháp đặc biệt trong tìm kiếm:
  - `"cụm từ chính xác"`: Tìm kiếm cụm từ chính xác
  - `danh-mục:tên`: Tìm kiếm trong danh mục cụ thể
  - `giá:<500`: Tìm kiếm sản phẩm có giá dưới 500.000đ

#### 7.2. Mua sắm hiệu quả

- Đăng ký nhận thông báo về sản phẩm để được thông báo khi có khuyến mãi
- Sử dụng tính năng so sánh để đưa ra quyết định tốt hơn
- Lưu các sản phẩm yêu thích để mua sau
- Đọc đánh giá từ khách hàng khác trước khi mua

#### 7.3. Tối ưu hóa trải nghiệm

- Sử dụng ứng dụng trên thiết bị di động để trải nghiệm tốt nhất
- Lưu thông tin thanh toán để thanh toán nhanh hơn
- Bật thông báo để nhận cập nhật về đơn hàng và khuyến mãi
- Sử dụng chế độ tối vào ban đêm để giảm mỏi mắt

### 8. Câu hỏi thường gặp (FAQ)

#### 8.1. Tài khoản và đăng nhập

**Q: Tôi không thể đăng nhập vào tài khoản của mình. Tôi nên làm gì?**

A: Hãy thử các bước sau:
1. Kiểm tra xem bạn đã nhập đúng email và mật khẩu chưa
2. Đảm bảo Caps Lock không được bật
3. Xóa cache và cookie của trình duyệt
4. Sử dụng tính năng "Quên mật khẩu" để đặt lại mật khẩu
5. Nếu vẫn không được, hãy liên hệ với bộ phận hỗ trợ

**Q: Làm thế nào để thay đổi mật khẩu của tôi?**

A: Để thay đổi mật khẩu:
1. Đăng nhập vào tài khoản
2. Vào "Thông tin cá nhân"
3. Chọn "Thay đổi mật khẩu"
4. Nhập mật khẩu hi��n tại và mật khẩu mới
5. Nhấp vào "Lưu thay đổi"

#### 8.2. Đặt hàng và thanh toán

**Q: Làm thế nào để theo dõi đơn hàng của tôi?**

A: Để theo dõi đơn hàng:
1. Đăng nhập vào tài khoản
2. Vào "Đơn hàng"
3. Tìm đơn hàng cần theo dõi
4. Nhấp vào "Theo dõi"
5. Bạn sẽ thấy trạng thái hiện tại và lịch sử đơn hàng

**Q: Tôi có thể hủy đơn hàng sau khi đã đặt không?**

A: Bạn có thể hủy đơn hàng nếu nó chưa được xử lý:
1. Đăng nhập vào tài khoản
2. Vào "Đơn hàng"
3. Tìm đơn hàng cần hủy
4. Nhấp vào "Hủy đơn hàng"
5. Chọn lý do hủy và xác nhận

#### 8.3. Sản phẩm và giỏ hàng

**Q: Làm thế nào để áp dụng mã giảm giá?**

A: Để áp dụng mã giảm giá:
1. Thêm sản phẩm vào giỏ hàng
2. Vào trang giỏ hàng
3. Nhập mã giảm giá vào ô "Mã giảm giá"
4. Nhấp vào "Áp dụng"
5. Giảm giá sẽ được áp dụng vào tổng đơn hàng

**Q: Tôi có thể lưu giỏ hàng để mua sau không?**

A: Có, giỏ hàng của bạn sẽ được lưu tự động nếu bạn đã đăng nhập. Bạn có thể quay lại bất cứ lúc nào để hoàn tất việc mua hàng.

### 9. Phụ lục

#### 9.1. Bảng thuật ngữ

| Thuật ngữ | Định nghĩa |
|-----------|------------|
| COD | Cash On Delivery - Thanh toán khi nhận hàng |
| SKU | Stock Keeping Unit - Mã quản lý hàng hóa |
| Wishlist | Danh sách sản phẩm yêu thích |
| Dark Mode | Chế độ tối - giao diện với nền tối và chữ sáng |
| Responsive | Khả năng hiển thị tốt trên nhiều kích thước màn hình |

#### 9.2. Phím tắt

| Phím tắt | Chức năng |
|----------|-----------|
| `/` | Focus vào thanh tìm kiếm |
| `Esc` | Đóng popup hoặc modal |
| `Ctrl + B` | Xem giỏ hàng |
| `Ctrl + D` | Chuyển đổi chế độ tối/sáng |
| `Ctrl + H` | Mở trung tâm trợ giúp |

#### 9.3. Thông tin liên hệ

- **Website**: https://example.com
- **Email hỗ trợ**: support@example.com
- **Điện thoại**: 1900-xxxx
- **Địa chỉ**: 123 Đường ABC, Quận XYZ, Thành phố HCM
- **Giờ làm việc**: 8:00 - 20:00, thứ Hai - Chủ nhật