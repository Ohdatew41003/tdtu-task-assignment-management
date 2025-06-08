const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { USER_STATUS } = require('../constants');
const { generateOtp, sendOtpToUser } = require('../utils/opt');
const Role = require('../models/Role'); // Đường dẫn tùy theo cấu trúc project của bạn
const UserRole = require('../models/UserRole'); // Đường dẫn tùy theo cấu trúc project của bạn
// Mảng tạm lưu refresh token (thực tế bạn nên lưu DB hoặc cache)
let refreshTokensStore = [];

const generateAccessToken = (user, roles) => {
    return jwt.sign(
        {
            userId: user.userId,
            roles: roles,         // truyền roleNames vào đây
            department: user.department,
            position: user.position
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );
};


const generateRefreshToken = (user, roles) => {
    return jwt.sign(
        {
            userId: user.userId,
            roles: roles,
            department: user.department,
            position: user.position
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' } // ví dụ 7 ngày
    );
};


const register = async (req, res) => {
    res.json({ message: 'Tính năng đăng ký chưa được hỗ trợ' });
};

// Hàm lấy roleNames theo userId
const getRoleNamesByUserId = async (userId) => {
    const userRoles = await UserRole.find({ userId });
    if (!userRoles.length) return [];
    const roleIds = userRoles.map(ur => ur.roleId);
    const roles = await Role.find({ roleId: { $in: roleIds } });
    return roles.map(r => r.roleName);
};

// Hàm gửi token qua cookie
const sendTokens = (res, accessToken, refreshToken) => {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', accessToken, {
        httpOnly: true,
        secure: isProduction,
        maxAge: 3600000,
        sameSite: 'Strict',
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'Strict',
    });
};

// Hàm điều hướng theo role
const redirectByRole = (res, roleNames, user) => {
    if (roleNames.includes('ADMIN')) return res.render('admin/index', { user });
    if (roleNames.includes('DEPT_HEAD') || roleNames.includes('DEPUTY_HEAD'))
        return res.render('deptHead/index', { user });
    if (roleNames.includes('DIVISION_HEAD')) return res.render('divisionHead/index', { user });
    if (roleNames.includes('COORDINATOR')) return res.render('coordinator/index', { user });
    if (roleNames.includes('STAFF')) return res.render('staff/index', { user });
    return res.render('home/lecturerEvaluation', { user });
};

// Hàm chính login gọn hơn
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

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

        const roleNames = await getRoleNamesByUserId(user.userId);
        if (roleNames.length === 0) {
            return res.render('auth/login', { error: 'Người dùng chưa được phân quyền' });
        }
        console.log('Role names của user:', roleNames);

        const accessToken = generateAccessToken(user, roleNames);
        const refreshToken = generateRefreshToken(user, roleNames);
        console.log('Access Token:', accessToken);

        refreshTokensStore.push(refreshToken);

        sendTokens(res, accessToken, refreshToken);

        user.lastLoginTime = Date.now();
        user.refreshToken = refreshToken;
        await user.save();

        return redirectByRole(res, roleNames, user);

    } catch (error) {
        console.error('Lỗi hệ thống:', error);
        return res.render('auth/login', { error: 'Đã xảy ra lỗi hệ thống, vui lòng thử lại sau.' });
    }
};

module.exports = { login };



// Xử lý refresh token trả access token mới
const refreshToken = (req, res) => {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    if (!token) {
        return res.status(401).json({ error: 'Không tìm thấy refresh token.' });
    }

    if (!refreshTokensStore.includes(token)) {
        return res.status(403).json({ error: 'Refresh token không hợp lệ.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const userId = decoded.userId;

        User.findById(userId).then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Người dùng không tồn tại.' });
            }

            const newAccessToken = generateAccessToken(user);
            res.cookie('token', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000,
                sameSite: 'Strict',
            });
            return res.json({ accessToken: newAccessToken });
        }).catch(err => {
            console.error(err);
            return res.status(500).json({ error: 'Lỗi server.' });
        });
    } catch (error) {
        console.error('Lỗi refresh token:', error);
        return res.status(403).json({ error: 'Refresh token không hợp lệ hoặc đã hết hạn.' });
    }
};

const verifyOtp = async (req, res) => {
    const { otp, userId } = req.body;
    const user = await User.findById(userId);
    if (!user || user.otp !== otp) {
        return res.render('auth/verifyOtp', { error: 'Mã OTP không đúng, vui lòng thử lại.' });
    }

    const token = generateAccessToken(user);
    user.lastLoginTime = Date.now();
    user.otp = null;
    await user.save();

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000,
        sameSite: 'Strict',
    });

    return res.render('home/index', { user });
};

const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        // Xóa refresh token khỏi bộ nhớ tạm (nếu có dùng)
        refreshTokensStore = refreshTokensStore.filter(t => t !== refreshToken);

        // Nếu tồn tại refresh token thì xác thực và tìm user theo userId (UUID)
        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            const userId = decoded.userId;

            // Tìm và unset refreshToken theo userId (UUID dạng string)
            await User.findOneAndUpdate(
                { userId }, // Tìm theo userId (kiểu string)
                { $unset: { refreshToken: "" } },
                { new: true }
            );
        }

        // Xóa cookie và redirect
        res.clearCookie('token');
        res.clearCookie('refreshToken');
        res.redirect('/api/auth/login');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi hệ thống khi đăng xuất' });
    }
};



module.exports = { login, logout, register, verifyOtp, refreshToken };
