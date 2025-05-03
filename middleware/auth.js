// D:\DACNTT\middleware\auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1]; // Lấy token từ cookie hoặc header

  if (!token) {
    return res.status(401).json({ error: 'Không có token, yêu cầu xác thực người dùng.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Giải mã token và xác minh tính hợp lệ
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Người dùng không tồn tại.' });
    }

    req.user = user; // Lưu thông tin người dùng vào request để các route khác có thể sử dụng
    next(); // Tiếp tục xử lý request
  } catch (error) {
    console.error('Lỗi khi xác thực token:', error);
    return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn.' });
  }
};


const hasRole = (...roles) => {
  return (req, res, next) => {
    // Kiểm tra xem người dùng có một trong các vai trò được chỉ định trong tham số 'roles'
    if (!req.user?.roles?.some(role => roles.includes(role))) {
      return res.status(403).json({
        error: `Yêu cầu một trong các quyền: ${roles.join(', ')}`
      });
    }
    next(); // Nếu có quyền, cho phép tiếp tục
  };
};

module.exports = {
  authenticate,
  hasRole
};
