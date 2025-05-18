require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const homeRoutes = require('./routes/homeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Models
const User = require('./models/User');
const RoleModel = require('./models/Role');
const Permission = require('./models/Permission');

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'hbs');
const hbs = require('hbs');
hbs.registerHelper('content', function (name, options) {
  const blocks = this._blocks || (this._blocks = {});
  const block = blocks[name] || (blocks[name] = []);
  block.push(options.fn(this));
});
app.set('views', path.join(__dirname, 'views'));

// Kết nối database và khởi tạo dữ liệu
const startServer = async () => {
  try {
    await connectDB();

    // 👉 Tự động tạo Role nếu chưa có
    await RoleModel.createDefaultRolesIfNotExists();

    // 👉 Tự động tạo tài khoản admin nếu chưa có
    await User.createAdminIfNotExists();

    // 👉 Tự động tạo PermissionPermission nếu chưa có
    await Permission.createDefaultPermissionsIfNotExists();
    await Permission.assignAllPermissionsToAdminRole();


    // Routes
    app.use('/api/home', homeRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/departments', departmentRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/tasks', taskRoutes);

    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🔑 Truy cập trang đăng nhập: http://localhost:${PORT}/api/auth/login`);
    });

  } catch (error) {
    console.error('❌ Lỗi khởi động server:', error);
  }
};

startServer();
