Cấu Trúc Dự Án RunOut
Cấu trúc cơ bản của dự án RunOut gồm ba thành phần chính:

Admin: Giao diện quản trị viên
Server: Backend của dự án
User/Client: Giao diện người dùng (đang được chuyển đổi từ User sang Client)

Thông Tin Công Nghệ

Frontend:

User (cũ): React với Redux và Material UI
Client (mới): React với Context API và Tailwind CSS


Backend: Node.js, Express
Database: MongoDB
Xác thực: JWT
Lưu trữ: Cloudinary

Kế Hoạch Đồng Bộ Hóa Giao Diện
Giai Đoạn 1: Phân Tích Cấu Trúc Code
Phân Tích User (Giao Diện Cũ)

Tạo sơ đồ cấu trúc thư mục và phân cấp component
Xác định các component tái sử dụng và component chuyên dụng
Phân tích luồng người dùng và các trang chính
Liệt kê tất cả API endpoints đang sử dụng và các tham số

Phân Tích Client (Giao Diện Mới)

Phân tích cấu trúc dự án React hiện tại
Liệt kê các thư viện/dependencies hiện có
Xác định các component đã hoàn thiện và các component còn thiếu

Hướng Dẫn Phân Tích

Sử dụng lệnh đặc biệt như /analyze [đường dẫn] để phân tích tệp tin cụ thể
Tạo ma trận so sánh chức năng giữa hai giao diện
Áp dụng mẫu phân tích từ tài liệu gốc:


## 2
# Prompt Tối Ưu: Hỗ Trợ Đồng Bộ Hóa Giao Diện User và Client

## Giới thiệu
Bạn là trợ lý AI trong VSCode, chuyên về đồng bộ hóa giao diện người dùng và phát triển phần mềm. Nhiệm vụ của bạn là hỗ trợ tôi thực hiện đồng bộ hóa giao diện User (cũ) sang Client (mới) trong dự án React/Express. Hãy hỗ trợ tôi theo từng giai đoạn, đảm bảo hiệu suất tốt và UX nhất quán.

## Giai đoạn 1: Phân tích cấu trúc code
Tôi cần phân tích cấu trúc hiện tại của cả hai giao diện:

- **Phân tích User (giao diện cũ):**
  - Giúp tôi tạo sơ đồ cấu trúc thư mục và phân cấp component
  - Xác định các component tái sử dụng và component chuyên dụng
  - Phân tích luồng người dùng và các trang chính
  - Liệt kê tất cả API endpoints đang sử dụng và các tham số

- **Phân tích Client (giao diện mới):**
  - Phân tích cấu trúc dự án React hiện tại 
  - Liệt kê các thư viện/dependencies hiện có (state management, UI libraries)
  - Xác định các component đã hoàn thiện vs các component còn thiếu

Hãy bắt đầu bằng cách hướng dẫn tôi cách phân tích cấu trúc thư mục và tạo ma trận so sánh chức năng.

## Giai đoạn 2: Mapping API và luồng dữ liệu
Sau khi phân tích xong, tôi cần:

- Tạo bảng ánh xạ API endpoints chi tiết giữa hai giao diện
- Phân tích và so sánh state management (Redux/Context API) giữa hai dự án
- Thiết kế chiến lược xử lý dữ liệu và thông báo lỗi nhất quán
- Xác định các điểm cần điều chỉnh trong API

Hãy hướng dẫn tôi tạo template cho việc mapping API và thiết kế adapter patterns nếu cần.

## Giai đoạn 3: Chiến lược chuyển đổi component
Tôi muốn chuyển đổi các component một cách có hệ thống:

- Bắt đầu với UI primitives (button, input, card, etc.)
- Tiếp theo là các layout components và containers
- Cuối cùng là các page components phức tạp

Cho mỗi component cần chuyển đổi, tôi cần:
1. So sánh props API và behavior
2. Đánh giá sự khác biệt về styling 
3. Chuyển đổi logic và xử lý sự kiện
4. Kiểm thử chức năng và visual regression

Hãy hướng dẫn tôi cách chuyển đổi một component cụ thể.

## Giai đoạn 4: Quản lý routing và navigation
Tôi cần đảm bảo routing hoạt động nhất quán:

- Tạo bảng mapping route parameters giữa hai giao diện
- Cung cấp chiến lược xử lý route guards và bảo mật
- Thiết kế UX cho việc chuyển đổi giữa hai giao diện trong giai đoạn chuyển tiếp
- Đảm bảo các deep links và bookmarks vẫn hoạt động

Hãy hướng dẫn tôi cách tạo hệ thống routing thống nhất.

## Giai đoạn 5: Testing và quy trình triển khai
Tôi cần chiến lược kiểm thử và triển khai:

- Tạo test cases cho các component đã chuyển đổi (unit và integration tests)
- Thiết lập visual regression testing 
- Xây dựng CI/CD pipeline hỗ trợ cả hai giao diện
- Lên kế hoạch triển khai dần dần với feature flags
- Chuẩn bị kịch bản rollback chi tiết

Hãy bắt đầu bằng cách hướng dẫn tôi triển khai test automation và thiết lập CI/CD pipeline.

## Thông tin bổ sung
- Framework: React (frontend) và Express (backend)
- Ưu tiên: Hiệu suất và UX nhất quán
- State management: Redux trong giao diện cũ, Context API trong giao diện mới
- UI Libraries: Material UI trong giao diện cũ, Tailwind CSS trong giao diện mới

# Hướng dẫn đồng bộ hóa giao diện User và Client

## 1. Phân tích và kế hoạch đồng bộ hóa

### Phân tích cấu trúc hiện tại
#### Phân tích folder User (giao diện cũ):
- **Cấu trúc thư mục và phân cấp component**
  - Xác định cấu trúc file/folder chính (components, pages, services, etc.)
  - Liệt kê các component tái sử dụng và component chuyên dụng
  - Phân tích các mối quan hệ phụ thuộc giữa components

- **Các trang và chức năng chính**
  - Lập danh sách tất cả các trang trong giao diện User
  - Xác định luồng người dùng chính và hành trình người dùng
  - Phân loại các trang theo chức năng (đăng nhập/đăng ký, dashboard, quản lý, etc.)

- **Tương tác với Server**
  - Xác định các service/helper để kết nối với Server
  - Phân tích cách xử lý request và response
  - Kiểm tra xử lý lỗi và cơ chế retry

- **API endpoint sử dụng**
  - Lập danh sách chi tiết tất cả API endpoints
  - Xác định tham số đầu vào và kết quả trả về của mỗi endpoint
  - Ghi chú các xử lý đặc biệt hoặc middleware cho mỗi endpoint

#### Phân tích folder Client (giao diện mới):
- **Cấu trúc và framework**
  - Xác định framework sử dụng (React, Vue, Angular, etc.)
  - Phân tích cấu trúc dự án và tiêu chuẩn code
  - Xác định các design pattern đang được áp dụng

- **Dependencies và thư viện**
  - Lập danh sách thư viện UI đang sử dụng
  - Kiểm tra các thư viện quản lý state (Redux, Context, etc.)
  - Xác định các utility libraries và công cụ hỗ trợ

- **Component đã phát triển**
  - Liệt kê các component đã hoàn thiện
  - Phân tích mức độ hoàn thiện của từng component
  - Xác định các component còn thiếu so với giao diện cũ

- **So sánh với yêu cầu từ giao diện cũ**
  - Tạo ma trận so sánh chức năng giữa User và Client
  - Xác định các chức năng khớp và chưa khớp
  - Đánh giá sự khác biệt về UX/UI giữa hai giao diện

### Chiến lược đồng bộ:
- **Xác định chức năng cần chuyển đổi**
  - Ưu tiên theo tầm quan trọng của chức năng
  - Phân loại theo độ phức tạp và thời gian cần thiết
  - Xác định các phụ thuộc giữa các chức năng

- **Quyết định tiếp cận**
  - Đánh giá ưu/nhược điểm của chuyển đổi dần và triển khai song song
  - Lựa chọn phương pháp phù hợp với tài nguyên và thời gian
  - Xây dựng kế hoạch dự phòng cho các tình huống phát sinh

- **Lên lịch triển khai**
  - Tạo timeline chi tiết cho từng module/chức năng
  - Phân công trách nhiệm cho các thành viên trong team
  - Xác định điểm bắt đầu và kết thúc của mỗi giai đoạn

- **Thiết lập milestone và mục tiêu kiểm tra**
  - Định nghĩa các milestone chính trong quá trình đồng bộ hóa
  - Thiết lập KPIs cho mỗi giai đoạn
  - Chuẩn bị quy trình báo cáo và theo dõi tiến độ

## 2. API và luồng dữ liệu

### Phân tích API:
- **Bản đồ API endpoint từ Server**
  - Phân loại API theo module chức năng
  - Xác định các endpoint bắt buộc và tùy chọn
  - Lập tài liệu chi tiết cho mỗi endpoint: method, params, response

- **Kiểm tra tính tương thích**
  - Phân tích cách giao diện User gọi và xử lý API
  - Đánh giá khả năng tương thích với cấu trúc Client
  - Xác định các khác biệt trong cách xử lý dữ liệu

- **Điểm cần điều chỉnh trong API**
  - Liệt kê các endpoint cần cập nhật hoặc mở rộng
  - Đề xuất các tham số bổ sung hoặc thay đổi định dạng response
  - Lập kế hoạch kiểm thử cho các điều chỉnh API

### Quản lý luồng dữ liệu:
- **Phân tích quản lý state**
  - So sánh cơ chế quản lý state giữa User và Client
  - Xác định chiến lược chuyển đổi state management
  - Thiết kế cấu trúc state phù hợp với cả hai giao diện

- **Đảm bảo tính nhất quán dữ liệu**
  - Xác định các điểm đồng bộ dữ liệu giữa các giao diện
  - Thiết lập quy tắc validation thống nhất
  - Phát triển các utility function xử lý dữ liệu dùng chung

- **Xử lý lỗi và hiển thị thông báo**
  - Xây dựng chiến lược xử lý lỗi đồng nhất
  - Thiết kế hệ thống thông báo người dùng
  - Tạo các helper function xử lý lỗi dùng chung

## 3. Đồng bộ hóa mã nguồn

### Chuyển đổi component:
- **So sánh cấu trúc component**
  - Phân tích sự khác biệt về kiến trúc component
  - Xác định pattern sử dụng (functional vs class, HOC vs hooks)
  - Đánh giá sự khác biệt về props và state management

- **Component có thể tái sử dụng**
  - Liệt kê các component có thể tái sử dụng trực tiếp
  - Xác định các component cần điều chỉnh nhỏ
  - Tạo kế hoạch chuyển đổi cho từng component

- **Component cần viết lại hoặc điều chỉnh**
  - Lập danh sách component cần viết lại hoàn toàn
  - Phân tích nguyên nhân và mức độ phức tạp
  - Lên kế hoạch cho từng component theo mức độ ưu tiên

- **Quy trình chuyển đổi component**
  - Bắt đầu với những component cơ bản (UI primitives)
  - Xác định thứ tự chuyển đổi dựa trên phụ thuộc
  - Thiết lập quy trình review và kiểm thử cho component mới

### Quản lý routing:
- **So sánh hệ thống định tuyến**
  - Phân tích routing system trong cả hai giao diện
  - Xác định cơ chế bảo vệ route (route guards)
  - So sánh cách xử lý params và query string

- **Đảm bảo URL trỏ đến trang tương đương**
  - Lập bảng ánh xạ giữa URL cũ và mới
  - Xử lý các trường hợp URL không khớp hoàn toàn
  - Thiết lập các redirect rule cần thiết

- **Xử lý chuyển hướng trong quá trình chuyển đổi**
  - Phát triển hệ thống middleware kiểm soát điều hướng
  - Xác định chiến lược xử lý deep links
  - Thiết kế UX cho việc chuyển đổi giữa hai giao diện

### Quản lý assets:
- **So sánh và đồng bộ tài nguyên**
  - Tạo inventory của tất cả assets trong cả hai giao diện
  - Xác định các assets cần cập nhật hoặc tạo mới
  - Thiết lập quy trình quản lý assets trong quá trình chuyển đổi

- **Hệ thống thiết kế chung**
  - Phát triển design system thống nhất (tokens, theme)
  - Xác định các biến CSS/SCSS dùng chung
  - Thiết lập quy tắc styling nhất quán

- **Xử lý sự khác biệt về UI/UX**
  - Lập danh sách các khác biệt về trải nghiệm người dùng
  - Đánh giá tác động của việc thay đổi UI/UX
  - Lên kế hoạch testing với người dùng thực

## 4. Kiểm thử và triển khai

### Chiến lược kiểm thử:
- **Môi trường kiểm thử**
  - Thiết lập môi trường dev, staging, testing
  - Xác định các công cụ kiểm thử phù hợp
  - Thiết lập CI pipeline cho automated testing

- **Xây dựng test case**
  - Phát triển test case cho từng chức năng
  - Tạo các regression test để đảm bảo tính ổn định
  - Thiết kế integration test cho các luồng chính

- **Kế hoạch kiểm thử**
  - Lên lịch cho unit test, integration test, và E2E test
  - Phân công trách nhiệm kiểm thử
  - Thiết lập quy trình báo cáo và xử lý lỗi

### Kế hoạch triển khai:
- **Quy trình CI/CD**
  - Thiết kế quy trình CI/CD hỗ trợ cả hai giao diện
  - Xác định gate checks và các điều kiện triển khai
  - Thiết lập monitoring và alerting

- **Triển khai dần dần**
  - Xác định các feature flags để kiểm soát triển khai
  - Thiết kế quy trình phát hành theo nhóm người dùng
  - Lên kế hoạch thu thập phản hồi và điều chỉnh

- **Kịch bản rollback**
  - Phát triển quy trình rollback chi tiết
  - Thiết lập các ngưỡng để quyết định rollback
  - Lên kế hoạch backup và khôi phục dữ liệu

## 5. Thách thức tiềm ẩn và giải pháp

### Xung đột phiên bản:
- **Phiên bản dependency tương thích**
  - Lập bảng so sánh các dependencies và phiên bản
  - Xác định các xung đột tiềm năng và đề xuất giải pháp
  - Thiết lập chiến lược cập nhật dependency dài hạn

- **Xử lý xung đột khi chạy song song**
  - Phát triển các wrapper/adapter cho các library không tương thích
  - Xác định chiến lược isolation khi cần thiết
  - Lên kế hoạch testing chuyên sâu cho các điểm xung đột

### Vấn đề hiệu suất:
- **So sánh hiệu suất**
  - Thiết lập benchmark cho cả hai giao diện
  - Đo lường và so sánh thời gian tải, thời gian phản hồi
  - Xác định các điểm nghẽn hiệu suất

- **Tối ưu hóa cho giao diện mới**
  - Đề xuất các giải pháp lazy loading, code splitting
  - Phát triển chiến lược caching tối ưu
  - Thiết kế UX để che giấu độ trễ khi cần thiết

### Quản lý xác thực và phiên làm việc:
- **Hệ thống xác thực nhất quán**
  - Phân tích cơ chế xác thực hiện tại
  - Thiết kế giải pháp SSO hoặc shared authentication
  - Xác định chiến lược bảo mật cho quá trình chuyển đổi

- **Chuyển đổi phiên giữa giao diện**
  - Phát triển cơ chế duy trì trạng thái đăng nhập
  - Thiết kế UX cho việc chuyển đổi giữa các giao diện
  - Xử lý các edge cases như session timeout

## 6. Quản lý mã nguồn và phiên bản

### Chiến lược Git:
- **Cấu trúc branch**
  - Thiết lập mô hình branching (Gitflow, trunk-based)
  - Xác định các quy tắc đặt tên cho branch
  - Thiết lập chiến lược tách và merge feature

- **Quy trình merge và review code**
  - Thiết lập template cho pull request
  - Xác định các tiêu chí đánh giá code
  - Thiết lập quy trình CI check trước khi merge

- **Sử dụng tag và phiên bản**
  - Thiết lập chiến lược semantic versioning
  - Xác định các milestone cần đánh dấu
  - Thiết lập quy trình release notes

### Tài liệu:
- **Cập nhật tài liệu API và component**
  - Phát triển hệ thống tài liệu API tự động
  - Thiết lập storybook hoặc tương tự cho components
  - Lên kế hoạch cập nhật tài liệu song song với phát triển

- **Ghi chú thay đổi quan trọng**
  - Thiết lập quy trình changelog
  - Xác định các thay đổi cần thông báo cho các bên liên quan
  - Lưu trữ các quyết định kiến trúc quan trọng

- **Hướng dẫn cho nhóm phát triển**
  - Phát triển coding guidelines cho dự án mới
  - Thiết lập tài liệu onboarding cho developer mới
  - Lên kế hoạch đào tạo cho team

## 7. Các bước thực hiện cụ thể

### Giai đoạn chuẩn bị (1-2 tuần):
- Phân tích sâu cả hai codebase
  - Code walkthrough với team hiện tại
  - Xây dựng sơ đồ kiến trúc cho cả hai hệ thống
  - Xác định các dependency quan trọng

- Lập danh sách đầy đủ các chức năng và API
  - Tạo ma trận chức năng-API
  - Đánh giá độ phức tạp của từng chức năng
  - Xác định các chức năng ưu tiên cao

- Thiết lập môi trường phát triển
  - Cài đặt các công cụ phát triển cần thiết
  - Thiết lập môi trường test và staging
  - Chuẩn bị các script automation cần thiết

- Tạo kế hoạch chi tiết cho từng module
  - Phân công trách nhiệm cho team members
  - Thiết lập timeline và milestone
  - Xác định các điểm kiểm tra tiến độ

### Giai đoạn 1: Đồng bộ hóa cơ sở (2-3 tuần):
- Chuẩn hóa API endpoints
  - Cập nhật API documentation
  - Thống nhất format request/response
  - Phát triển các adapter nếu cần thiết

- Chuyển đổi các component cơ sở
  - Bắt đầu với các primitive components (button, input, etc.)
  - Phát triển các layout components
  - Đảm bảo khả năng tái sử dụng cao

- Thiết lập hệ thống thiết kế chung
  - Định nghĩa design tokens (colors, spacing, typography)
  - Xây dựng theme provider
  - Thống nhất các animation và transitions

- Kiểm thử các component đã chuyển đổi
  - Viết unit test cho mỗi component
  - Thực hiện visual regression testing
  - Đánh giá khả năng tương thích cross-browser

### Giai đoạn 2: Chuyển đổi trang và chức năng (3-4 tuần):
- Triển khai từng trang theo thứ tự ưu tiên
  - Bắt đầu với các trang đơn giản, ít phụ thuộc
  - Phát triển các container components
  - Tích hợp với hệ thống routing

- Chuyển đổi logic nghiệp vụ
  - Chuyển đổi các service và helper
  - Cập nhật xử lý validation
  - Đảm bảo tính nhất quán của business rules

- Đồng bộ hóa luồng dữ liệu
  - Phát triển các store/context cần thiết
  - Thống nhất cách xử lý loading state
  - Chuẩn hóa error handling

- Kiểm thử tính năng trên mỗi trang
  - Thực hiện integration test cho các luồng chính
  - Kiểm tra khả năng xử lý edge cases
  - Đánh giá UX cho từng chức năng

### Giai đoạn 3: Tích hợp và tinh chỉnh (2-3 tuần):
- Tích hợp các trang thành ứng dụng hoàn chỉnh
  - Kết nối các trang thông qua navigation
  - Phát triển các shared state cần thiết
  - Đảm bảo tính nhất quán giữa các trang

- Kiểm tra tính nhất quán của UX
  - Thực hiện usability testing
  - Đảm bảo accessibility compliance
  - Kiểm tra responsive design

- Tối ưu hóa hiệu suất
  - Thực hiện phân tích bundle size
  - Tối ưu hóa rendering performance
  - Cải thiện loading time

- Thực hiện kiểm thử end-to-end
  - Tự động hóa các test case chính
  - Kiểm tra các luồng người dùng hoàn chỉnh
  - Xác định và xử lý các regression

### Giai đoạn 4: Triển khai song song (1-2 tuần):
- Chuẩn bị môi trường staging
  - Thiết lập hạ tầng cho cả hai giao diện
  - Cấu hình load balancing nếu cần
  - Thiết lập monitoring và logging

- Thực hiện kiểm thử A/B
  - Lựa chọn nhóm người dùng thử nghiệm
  - Thu thập và phân tích feedback
  - Điều chỉnh dựa trên kết quả thử nghiệm

- Lên kế hoạch chuyển đổi hoàn toàn
  - Xác định timeline cho việc loại bỏ giao diện cũ
  - Chuẩn bị thông báo cho người dùng
  - Thiết lập các chỉ số đánh giá thành công

### Giai đoạn 5: Chuyển đổi hoàn toàn (1 tuần):
- Loại bỏ dần giao diện cũ
  - Thực hiện theo lịch trình đã xác định
  - Giám sát chặt chẽ các vấn đề phát sinh
  - Sẵn sàng kịch bản rollback

- Hoàn thiện tài liệu
  - Cập nhật tất cả tài liệu kỹ thuật
  - Phát triển tài liệu hướng dẫn người dùng
  - Lưu trữ các bài học kinh nghiệm

- Đánh giá hiệu suất và trải nghiệm người dùng
  - Thu thập metrics về hiệu suất hệ thống
  - Phân tích feedback từ người dùng
  - Lên kế hoạch cải tiến tiếp theo

## 8. Các công cụ đề xuất

### Quản lý mã nguồn:
- Git
- GitHub/GitLab

### Quản lý dự án:
- Jira
- Trello

### CI/CD:
- Jenkins
- GitHub Actions

### Kiểm thử:
- Jest
- Cypress
- React Testing Library

### Phân tích mã nguồn:
- ESLint
- SonarQube

### Theo dõi lỗi:
- Sentry

### Đo lường hiệu suất:
- Lighthouse
- WebPageTest

## 9. Lưu ý quan trọng

- **Giao tiếp rõ ràng:** Duy trì communication thường xuyên và rõ ràng giữa các thành viên nhóm, đặc biệt khi có thay đổi lớn hoặc quyết định quan trọng.

- **Backup dữ liệu:** Thực hiện backup đầy đủ trước khi triển khai các thay đổi lớn, đảm bảo khả năng khôi phục nhanh chóng khi cần thiết.

- **Ưu tiên bảo mật:** Ưu tiên bảo mật dữ liệu người dùng trong toàn bộ quá trình chuyển đổi, đặc biệt là thông tin nhạy cảm và dữ liệu xác thực.

- **Cập nhật tài liệu:** Luôn cập nhật tài liệu song song với quá trình phát triển, không để tài liệu trở nên lạc hậu so với code thực tế.

- **Kế hoạch xử lý tình huống khẩn cấp:** Chuẩn bị kế hoạch dự phòng chi tiết cho các tình huống khẩn cấp, bao gồm các kịch bản rollback và các bước khôi phục hệ thống.