//D:\DACNTT\controllers\authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { USER_STATUS } = require('../constants');
const { generateOtp, sendOtpToUser } = require('../utils/opt');
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
        const { username, password, otp } = req.body; // Thêm trường otp để người dùng nhập mã OTP

        // Kiểm tra dữ liệu đầu vào
        if (!username || !password) {
            return res.render('auth/login', { error: 'Vui lòng điền đầy đủ thông tin đăng nhập' });
        }

        const user = await User.findOne({ username }).select('+password');
        if (!user) {
            return res.render('auth/login', { error: 'Tên đăng nhập hoặc mật khẩu không đúng' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('auth/login', { error: 'Tên đăng nhập hoặc mật khẩu không đúng' });
        }

        if (user.status !== 'ACTIVE') {
            return res.render('auth/login', { error: 'Tài khoản đã bị vô hiệu hóa, vui lòng liên hệ quản trị viên' });
        }

        /** Đăng nhập thành công, kiểm tra vai trò yêu cầu xác thực hai yếu tố
        const roles = user.roles;

        // Nếu là quản trị viên hoặc ban lãnh đạo khoa, yêu cầu 2FA
        if (roles.includes('ADMIN') || roles.includes('DEPT_HEAD') || roles.includes('DEPUTY_HEAD')) {
            // Gửi mã OTP đến email hoặc số điện thoại của người dùng
            const otpCode = generateOtp(); // Hàm này tạo mã OTP ngẫu nhiên
            await sendOtpToUser(user, otpCode); // Gửi mã OTP qua email hoặc SMS

            // Lưu OTP tạm thời trong database (hoặc cache) để kiểm tra sau
            user.otp = otpCode;
            await user.save();

            // Hiển thị form yêu cầu nhập OTP
            return res.render('auth/verifyOtp', { user });
        }

        // Nếu không yêu cầu 2FA, tiếp tục như cũ
        const token = generateToken(user);
        user.lastLoginTime = Date.now();
        await user.save();
        */
        // Đăng nhập thành công
        const token = generateToken(user);
        user.lastLoginTime = Date.now();
        await user.save();
        console.log('Token vừa tạo:', token); // 👉 In token ra terminal

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // chỉ sử dụng secure nếu môi trường là production
            maxAge: 3600000, // 1 giờ
            sameSite: 'Strict', // Giới hạn cookie chỉ có thể được gửi cùng domain
        });

        const roles = user.roles;
        // Điều hướng đến trang tương ứng theo role
        if (roles.includes('ADMIN')) {
            return res.render('admin/index', { user });
        } else if (roles.includes('DEPT_HEAD') || roles.includes('DEPUTY_HEAD')) {
            return res.render('deptHead/index', { user });
        } else if (roles.includes('DIVISION_HEAD')) {
            return res.render('divisionHead/index', { user });
        } else if (roles.includes('COORDINATOR')) {
            return res.render('coordinator/index', { user });
        } else if (roles.includes('STAFF')) {
            return res.render('staff/index', { user });
        } else {
            return res.render('home/upload-report', { user }); // Trang mặc định
        }

    } catch (error) {
        console.error('Lỗi hệ thống:', error);
        return res.render('auth/login', { error: 'Đã xảy ra lỗi hệ thống, vui lòng thử lại sau.' });
    }
};

// Hàm kiểm tra mã OTP
const verifyOtp = async (req, res) => {
    const { otp, userId } = req.body;

    // Kiểm tra xem mã OTP có khớp với mã đã lưu trong DB không
    const user = await User.findById(userId);
    if (!user || user.otp !== otp) {
        return res.render('auth/verifyOtp', { error: 'Mã OTP không đúng, vui lòng thử lại.' });
    }

    // Nếu mã OTP đúng, tiếp tục đăng nhập và tạo token
    const token = generateToken(user);
    user.lastLoginTime = Date.now();
    user.otp = null; // Xóa OTP sau khi xác thực thành công
    await user.save();

    return res.render('home/index', { user });
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


module.exports = { login, logout, register, verifyOtp };
