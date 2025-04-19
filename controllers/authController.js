//D:\DACNTT\controllers\authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { USER_STATUS } = require('../constants');
const register = async (req, res) => {
    res.json({ message: 'Tính năng đăng ký chưa được hỗ trợ' });
};

const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            roles: user.roles,
            department: user.department,
            position: user.position
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

const login = async (req, res) => {
    try {
        // Kiểm tra req.body
        console.log('Request Body:', req.body);  // Debug xem có dữ liệu từ form
        // Validate request body
        if (!req.body.username || !req.body.password) {
            return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin đăng nhập' });
        }

        const { username, password } = req.body;
        console.log('Username:', username);  // Debug thông tin đầu vào

        const user = await User.findOne({ username }).select('+password');
        if (!user) {
            console.log('User not found');  // Debug khi không tìm thấy người dùng
            return res.status(401).json({ error: 'Thông tin đăng nhập không hợp lệ' });
        }

        console.log('Password:', password);  // Debug mật khẩu đầu vào
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch');  // Debug khi mật khẩu không khớp
            return res.status(401).json({ error: 'Mật khẩu không chính xác' });
        }

        // Kiểm tra trạng thái tài khoản
        if (user.status !== 'ACTIVE') {
            console.log('User is inactive');  // Debug khi tài khoản không hoạt động
            return res.status(403).json({ error: 'Tài khoản đã bị khóa hoặc chưa kích hoạt' });
        }

        const token = generateToken(user);
        user.lastLoginTime = Date.now();
        await user.save();

        res.json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                roles: user.roles,
                fullName: user.fullName,
                position: user.position,
                //department: user.department
            }
        });

    } catch (error) {
        console.error(error);  // Log lỗi chi tiết
        res.status(500).json({ error: 'Lỗi hệ thống' });
    }
};

const logout = (req, res) => {
    res.json({ message: 'Đăng xuất thành công' });
};

module.exports = { login, logout, register };
