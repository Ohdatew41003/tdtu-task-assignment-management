const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Thêm thư viện bcryptjs để mã hóa mật khẩu
const UserRole = require('../models/UserRole');
const Role = require('../models/Role');

const getUsers = async (req, res) => {
    try {
        // Lấy tất cả user, bỏ password
        const users = await User.find().select('-password').lean();

        // Lấy tất cả UserRole
        const userRoles = await UserRole.find().lean();

        // Lấy tất cả Role
        const roles = await Role.find().lean();

        // Tạo map roleId -> roleName để dễ lookup
        const roleMap = {};
        roles.forEach(role => {
            roleMap[role.roleId] = role.roleName;
        });

        // Thêm thông tin roles cho từng user
        const usersWithRoles = users.map(user => {
            const rolesOfUser = userRoles
                .filter(ur => String(ur.userId) === String(user.userId))
                .map(ur => roleMap[ur.roleId])
                .filter(Boolean);

            // In ra roles của user để kiểm tra
            console.log(`User ${user.username} có roles:`, rolesOfUser);

            return {
                ...user,
                roles: rolesOfUser
            };
        });


        if (req.originalUrl.startsWith('/api/admin/get')) {
            res.render('admin/index', { users: usersWithRoles, user: req.user });
        } else {
            res.json(usersWithRoles);
        }
    } catch (error) {
        console.error(error);
        if (req.originalUrl.startsWith('/api/admin/get')) {
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
