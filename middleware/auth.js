//D:\DACNTT\middleware\auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kiểm tra user tồn tại trong database
    const user = await User.findById(decoded.userId);
    if (!user || user.status === 'INACTIVE') {
      return res.status(401).json({ error: 'Tài khoản không tồn tại hoặc đã bị vô hiệu hóa' });
    }

    req.user = {
      _id: user._id,
      username: user.username,
      roles: user.roles,
      fullName: user.fullName,
      department: user.department
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Token không hợp lệ' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user?.roles?.includes('ADMIN')) {
    return next();
  }
  res.status(403).json({ error: 'Yêu cầu quyền ADMIN' });
};

const hasRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user?.roles?.some(role => roles.includes(role))) {
      return res.status(403).json({
        error: `Yêu cầu một trong các quyền: ${roles.join(', ')}`
      });
    }
    next();
  };
};

module.exports = {
  authenticate,
  isAdmin,
  hasRole
};