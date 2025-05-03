const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Thêm thư viện bcryptjs để mã hóa mật khẩu

// Lấy danh sách người dùng (trừ mật khẩu)
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');

        if (req.originalUrl.startsWith('/admin/users')) {
            // Nếu truy cập từ giao diện admin
            res.render('admin/users', { users, user: req.user });
        } else {
            // Nếu là API
            res.json(users);
        }
    } catch (error) {
        console.error(error);
        if (req.originalUrl.startsWith('/admin/users')) {
            res.status(500).send('Lỗi khi hiển thị giao diện quản lý người dùng');
        } else {
            res.status(500).json({ error: 'Lỗi khi lấy danh sách người dùng' });
        }
    }
};

// Tạo người dùng mới
const createUser = async (req, res) => {
    try {
        // Kiểm tra tính hợp lệ của dữ liệu
        const { fullName, username, email, password, roles } = req.body;

        // Kiểm tra nếu thiếu thông tin
        if (!fullName || !username || !email || !password || !roles) {
            return res.status(400).json({ error: 'Thiếu thông tin cần thiết' });
        }

        // Kiểm tra nếu tên đăng nhập hoặc email đã tồn tại
        const userExists = await User.findOne({ $or: [{ username }, { email }] });
        if (userExists) {
            return res.status(400).json({ error: 'Tên đăng nhập hoặc email đã tồn tại' });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo tài khoản mới
        const newUser = new User({
            fullName,
            username,
            email,
            password: hashedPassword, // Mã hóa mật khẩu trước khi lưu
            roles,
            status: 'ACTIVE', // Mặc định trạng thái là ACTIVE
        });

        // Lưu người dùng vào cơ sở dữ liệu
        await newUser.save();

        res.status(201).json({
            message: 'Tạo người dùng thành công',
            user: {
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                roles: newUser.roles
            }
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Tạo người dùng thất bại' });
    }
};

// Cập nhật thông tin người dùng
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, username, email, roles, status } = req.body;

        // Kiểm tra tính hợp lệ của dữ liệu
        if (!fullName || !username || !email || !roles || !status) {
            return res.status(400).json({ error: 'Thiếu thông tin cần thiết' });
        }

        // Cập nhật người dùng
        const updatedUser = await User.findByIdAndUpdate(id, {
            fullName,
            username,
            email,
            roles,
            status
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: 'Người dùng không tìm thấy' });
        }

        res.json({
            message: 'Cập nhật người dùng thành công',
            user: updatedUser
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Cập nhật thất bại' });
    }
};

module.exports = { getUsers, createUser, updateUser };
