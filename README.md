# 📚 TDTU Task Assignment Management

> **Ứng dụng phân công và quản lý công việc trong khoa tại Trường Đại học Tôn Đức Thắng**

---

## 🧩 Giới thiệu

Đây là hệ thống hỗ trợ **Trưởng khoa**, **Phó khoa**, **Thư ký** và **Giảng viên** trong việc:

- Giao việc theo đầu việc định kỳ hoặc đột xuất
- Theo dõi và báo cáo tiến độ công việc
- Quản lý yêu cầu gia hạn công việc
- Đánh giá hiệu quả thực hiện công việc
- Quản lý đơn vị trực thuộc khoa (bộ môn, tổ)
- Tổng hợp và thống kê hiệu quả theo cá nhân hoặc đơn vị

---

## 🚀 Tính năng đã triển khai

### 🔐 Quản lý tài khoản và phân quyền
- Đăng nhập, xác thực bằng JWT
- Phân quyền: Admin, Trưởng khoa, Phó khoa, Giảng viên, Thư ký
- Quản lý người dùng, cấp quyền theo đơn vị

### 📋 Quản lý công việc
- Tạo, cập nhật, phân công đầu việc
- Giao việc cho nhóm hoặc cá nhân
- Theo dõi trạng thái: Chưa thực hiện – Đang thực hiện – Đã hoàn thành – Trễ hạn

### 📊 Báo cáo tiến độ & đánh giá
- Giảng viên cập nhật tiến độ theo mốc thời gian
- Trưởng/phó khoa nhận xét và đánh giá theo thang điểm
- Lưu lịch sử báo cáo và đánh giá

### 🕒 Yêu cầu gia hạn
- Gửi yêu cầu gia hạn công việc
- Trưởng/phó khoa xét duyệt yêu cầu
- Lưu lịch sử gia hạn và gửi thông báo

### 🏢 Quản lý tổ chức & đơn vị
- Tạo, cập nhật, vô hiệu hóa đơn vị (bộ môn, tổ)
- Thiết lập trưởng đơn vị, đơn vị cha
- Đảm bảo không tạo chu trình phân cấp

### 📦 Tệp đính kèm & tài nguyên
- Cho phép đính kèm tài liệu báo cáo
- Quản lý tài nguyên phục vụ công việc (nếu cần)

### 📈 Thống kê & báo cáo tổng hợp
- Tổng hợp tiến độ, hiệu quả theo:
  - Cá nhân
  - Đơn vị
  - Thời gian cụ thể
- Tính điểm đánh giá hoàn thành công việc

---

## ⚙️ Công nghệ sử dụng

| Thành phần         | Công nghệ sử dụng                         |
|--------------------|-------------------------------------------|
| Backend            | Node.js, Express, MongoDB                 |
| Frontend           | HTML, CSS, Handlebars (HBS)               |
| Auth & Security    | JSON Web Token (JWT)                      |
| Giao diện mẫu      | Bootstrap + custom CSS                    |
| Phân quyền         | Middleware phân quyền theo vai trò        |
| Môi trường dev     | VS Code, Git, GitHub/GitLab               |
| Triển khai (local) | `npm install`, `npm start`                |

---

## 🧠 Mô hình dữ liệu (trích lược)

- **User**: thông tin đăng nhập, phân quyền
- **Role**: vai trò hệ thống
- **Task**: thông tin đầu việc
- **TaskAssignment**: phân công công việc
- **TaskProgress**: tiến độ và báo cáo
- **Evaluation**: đánh giá kết quả
- **ExtensionRequest**: yêu cầu gia hạn
- **Department**: đơn vị tổ chức
- **Resource / Booking**: tài nguyên và đặt lịch (nếu cần)

> 📎 Toàn bộ schema chi tiết đã được định nghĩa trong file `models/` và khớp với tài liệu `FinalReport.docx`

---

## 🖼 Giao diện mẫu (gợi ý)

- Dashboard tổng quan công việc
- Form tạo đầu việc và phân công
- Giao diện đánh giá + nhận xét
- Form yêu cầu gia hạn
- Quản lý đơn vị (sơ đồ tổ chức dạng cây)
- Thống kê hiệu quả dưới dạng bảng + biểu đồ

---

## 🛠️ Cài đặt nhanh (Local)

```bash
git clone https://github.com/Ohdatew41003/tdtu-task-assignment-management.git
cd tdtu-task-assignment-management
npm install
npm start
