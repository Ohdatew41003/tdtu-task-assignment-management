const jwt = require('jsonwebtoken');
const { jwtSecret, tokenExpiration } = require('../config/auth');
const User = require('../models/User');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });

    if (!user || !(await user.validPassword(password))) {
      return res.status(401).json({ error: 'Thông tin đăng nhập không chính xác' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        permissions: user.permissions
      },
      jwtSecret,
      { expiresIn: tokenExpiration }
    );

    res.json({
      accessToken: token,
      role: user.role,
      permissions: user.permissions
    });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
};

const logout = (req, res) => {
  // Xử lý thu hồi token ở đây
  res.json({ message: 'Đăng xuất thành công' });
};

module.exports = { login, logout };