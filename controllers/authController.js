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
        const roles = user.roles;
        if (roles.includes('ADMIN')) {
            return res.render('admin/index', { user });
        } else if (roles.includes('HEAD_OF_DEPARTMENT') || roles.includes('DEPUTY_HEAD')) {
            return res.render('headOfDepartment/index', { user });
        } else if (roles.includes('DIVISION_HEAD')) {
            return res.render('headOfSubject/index', { user });
        } else if (roles.includes('COORDINATOR')) {
            return res.render('taskContactPerson/index', { user });
        } else {
            return res.render('home/index', { user }); // Trang mặc định nếu không có quyền đặc biệt
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi hệ thống' });
    }
};
const logout = (req, res) => {
    try {
        res.clearCookie('token');  // 'token' là tên cookie chứa JWT
        res.redirect('/login');  // Sau khi đăng xuất, chuyển hướng về trang đăng nhập
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi hệ thống khi đăng xuất' });
    }
};


module.exports = { login, logout, register };
