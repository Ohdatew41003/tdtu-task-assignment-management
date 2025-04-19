require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const path = require('path');
const app = express();
const User = require('./models/User');
// Thêm vào server.js


// Khởi tạo admin
User.createAdminIfNotExists().catch(console.error);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Đảm bảo bạn có thể lấy dữ liệu từ form
app.use(express.static(path.join(__dirname, 'public'))); // Đảm bảo phục vụ các tệp tĩnh từ thư mục public

// Cấu hình view engine là Handlebars
app.set('view engine', 'hbs');
const hbs = require('hbs');
hbs.registerHelper('content', function (name, options) {
  const blocks = this._blocks || (this._blocks = {});
  const block = blocks[name] || (blocks[name] = []);
  block.push(options.fn(this));
});
app.set('views', path.join(__dirname, 'views'));  // Đảm bảo thư mục views đúng

// Kết nối database
connectDB();

// Routes
app.use('/', authRoutes); // Sử dụng routes với base path là '/'
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);

// Bắt đầu server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`🔑 Truy cập trang đăng nhập: http://localhost:${PORT}/login`);
});
