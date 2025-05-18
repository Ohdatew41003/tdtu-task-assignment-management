// models/user.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Role, UserStatus, Position } = require('../constants');
const { v4: uuidv4 } = require('uuid');
const UserRole = require('./UserRole');
const RoleModel = require('./Role'); // đảm bảo đường dẫn đúng

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    username: {
        type: String,
        unique: true,
        required: true,
        maxlength: 50
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true,
        maxlength: 100
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phone: String,
    avatar: { type: String },
    status: {
        type: String,
        enum: Object.values(UserStatus),
        default: UserStatus.PENDING
    },
    lastLoginTime: Date,
    refreshToken: {
        type: String,
        default: null
    }
}, { timestamps: true }); // ✅ Tự động tạo createdAt và updatedAt

// Băm mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
    if (!this.userId) {
        this.userId = `${uuidv4()}`;
    }
    // phần hash password giữ nguyên
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});


userSchema.statics.createAdminIfNotExists = async function () {
    const adminRole = await RoleModel.findOne({ roleName: Role.ADMIN }); // Role.ADMIN là enum từ constants

    if (!adminRole) {
        throw new Error('Admin role chưa được tạo trong DB');
    }

    const adminUser = await this.findOne({ username: process.env.ADMIN_USERNAME || 'admin' });

    if (!adminUser) {
        const newAdminUser = new this({
            userId: `USR-${uuidv4()}`,
            username: process.env.ADMIN_USERNAME || 'admin',
            password: process.env.ADMIN_PASSWORD || 'admin',
            email: process.env.ADMIN_EMAIL || 'admin@gmail.com',
            fullName: 'System Administrator',
            phone: null,
            avatar: null,
            lastLoginTime: null,
            refreshToken: null,
            status: UserStatus.ACTIVE
        });

        await newAdminUser.save();

        const userRole = new UserRole({
            userId: newAdminUser.userId,
            roleId: adminRole.roleId,
            assignedDate: new Date(),
            expiryDate: null
        });

        await userRole.save();

        console.log('✅ Default admin account and role assignment created');
    } else {
        const adminUserRole = await UserRole.findOne({
            userId: adminUser.userId,
            roleId: adminRole.roleId
        });

        if (!adminUserRole) {
            const userRole = new UserRole({
                userId: adminUser.userId,
                roleId: adminRole.roleId,
                assignedDate: new Date(),
                expiryDate: null
            });
            await userRole.save();
            console.log('✅ Admin role assigned to existing admin user');
        }
    }
};

module.exports = mongoose.model('User', userSchema);
