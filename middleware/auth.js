// D:\DACNTT\middleware\auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RolePermission = require('../models/Role_Permission');
const FunctionModel = require('../models/Function');
const UserRole = require('../models/UserRole'); // import model user-role
const authenticate = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1]; // Lấy token từ cookie hoặc header

  if (!token) {
    return res.status(401).json({ error: 'Không có token, yêu cầu xác thực người dùng.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Giải mã token và xác minh tính hợp lệ
    // Lấy userId từ payload token
    const userIdFromToken = decoded.userId;
    const user = await User.findOne({ userId: userIdFromToken });

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



const hasPermission = function (functionName) {
  return async (req, res, next) => {
    try {
      const userId = req.user.userId;


      // Bước 1: Lấy roleId từ bảng UserRole
      const ur = await UserRole.findOne({ userId });
      if (!ur) return res.status(403).send('Bạn chưa được gán vai trò');

      const roleId = ur.roleId;

      // Bước 2: Lấy functionId từ FunctionModel
      const func = await FunctionModel.findOne({ functionName });
      if (!func) return res.status(500).send('Function chưa được đăng ký');

      // Bước 3: Kiểm tra quyền trong RolePermission
      const permitted = await RolePermission.findOne({
        roleId,
        functionId: func.functionId
      });

      if (permitted) {
        return next();
      } else {
        return res.status(403).send('Bạn không có quyền thực hiện chức năng này');
      }

    } catch (err) {
      console.error('hasPermission lỗi:', err);
      return res.status(500).send('Lỗi kiểm tra quyền');
    }
  };
};

module.exports = {
  authenticate,
  hasPermission
};