// D:\DACNTT\middleware\auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware xác thực người dùng qua token
const authenticate = (...roles) => {
  return async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Lấy token từ header

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - Không có token' });
    }

    try {
      // Giải mã token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Kiểm tra user có tồn tại trong cơ sở dữ liệu không
      const user = await User.findById(decoded.userId);
      if (!user || user.status === 'INACTIVE') {
        return res.status(401).json({ error: 'Tài khoản không tồn tại hoặc đã bị vô hiệu hóa' });
      }

      // Gán thông tin người dùng vào request để có thể truy cập ở các middleware khác
      req.user = {
        _id: user._id,
        username: user.username,
        roles: user.roles,
        fullName: user.fullName,
        department: user.department
      };

      // Kiểm tra vai trò của người dùng có hợp lệ không
      if (roles.length && !roles.some(role => req.user.roles.includes(role))) {
        return res.status(403).json({
          error: `Yêu cầu quyền: ${roles.join(', ')}`
        });
      }

      next(); // Tiếp tục đến middleware hoặc route handler tiếp theo
    } catch (error) {
      res.status(401).json({ error: 'Token không hợp lệ' });
    }
  };
};


// Middleware kiểm tra quyền Admin
const isAdmin = (req, res, next) => {
  // Kiểm tra xem người dùng có vai trò 'ADMIN' không
  if (req.user?.roles?.includes('ADMIN')) {
    return next(); // Nếu có, cho phép tiếp tục đến middleware hoặc route handler tiếp theo
  }
  res.status(403).json({ error: 'Yêu cầu quyền ADMIN' }); // Nếu không, trả về lỗi 403
};

// Middleware kiểm tra quyền người dùng theo vai trò
const hasRole = (...roles) => {
  return (req, res, next) => {
    // Kiểm tra xem người dùng có một trong các vai trò được chỉ định trong tham số 'roles'
    if (!req.user?.roles?.some(role => roles.includes(role))) {
      return res.status(403).json({
        error: `Yêu cầu một trong các quyền: ${roles.join(', ')}` // Nếu không có quyền, trả về lỗi 403
      });
    }
    next(); // Nếu có quyền, cho phép tiếp tục
  };
};

module.exports = {
  authenticate,
  isAdmin,
  hasRole
};
