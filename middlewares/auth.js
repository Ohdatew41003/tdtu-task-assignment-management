const { roles } = require('../config/auth');

const authorize = (requiredRoles = [], requiredPermissions = []) => {
  return (req, res, next) => {
    // Kiểm tra vai trò
    if (requiredRoles.length > 0 && !requiredRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Không đủ quyền truy cập' });
    }

    // Kiểm tra quyền hạn
    const userPermissions = req.user.permissions || [];
    const hasPermission = requiredPermissions.every(p => userPermissions.includes(p));

    if (!hasPermission) {
      return res.status(403).json({ message: 'Không đủ quyền thực hiện' });
    }

    next();
  };
};

module.exports = { authorize };