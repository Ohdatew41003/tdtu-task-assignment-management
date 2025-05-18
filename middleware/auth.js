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


const UserRole = require('../models/UserRole');  // đường dẫn model UserRole
const Role = require('../models/Role');
const hasPermission = (...permissions) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Không xác định được userId' });
      }

      // Lấy tất cả roleId của user
      const userRoles = await UserRole.find({ userId });
      if (!userRoles.length) {
        return res.status(403).json({ error: 'User chưa được gán vai trò' });
      }

      const roleIds = userRoles.map(ur => ur.roleId);

      // Lấy tất cả permission theo role
      const rolePermissions = await RolePermission.find({ roleId: { $in: roleIds } });

      const userPermissions = rolePermissions.map(rp => rp.permissionCode);

      // Kiểm tra xem user có ít nhất một permission yêu cầu hay không
      const hasAtLeastOne = userPermissions.some(p => permissions.includes(p));

      if (!hasAtLeastOne) {
        return res.status(403).json({
          error: `Yêu cầu một trong các quyền: ${permissions.join(', ')}`
        });
      }

      next(); // Có quyền thì tiếp tục
    } catch (error) {
      console.error('Lỗi khi kiểm tra quyền:', error);
      res.status(500).json({ error: 'Lỗi hệ thống khi kiểm tra quyền' });
    }
  };
};


module.exports = {
  authenticate,
  hasPermission
};
