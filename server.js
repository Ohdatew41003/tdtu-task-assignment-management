// D:\DACNTT\server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const homeRoutes = require('./routes/homeRoutes');

// Models
const User = require('./models/User');

const app = express();

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

// Khởi tạo admin nếu chưa tồn tại
User.createAdminIfNotExists().catch(console.error);

// Routes
app.use('/', authRoutes);  // Auth routes ở base path '/'
app.use(homeRoutes);       // Home routes
app.use('/api/auth', authRoutes);  // API auth routes
app.use('/api/users', userRoutes);  // API users routes
app.use('/api/departments', departmentRoutes);  // API departments routes

// Bắt đầu server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`🔑 Truy cập trang đăng nhập: http://localhost:${PORT}/login`);
});
