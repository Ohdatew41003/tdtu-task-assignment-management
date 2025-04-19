
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Role, UserStatus, Position } = require('../constants');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    phone: String,
    position: {
        type: String,
        enum: Object.values(Position)
    },
    roles: {
        type: [String],
        enum: Object.values(Role),
        required: true
    },
    status: {
        type: String,
        enum: Object.values(UserStatus),
        default: UserStatus.PENDING
    },
    lastLoginTime: Date,
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    }
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.statics.createAdminIfNotExists = async function () {
    const adminExists = await this.findOne({
        roles: Role.ADMIN
    });

    if (!adminExists) {
        const adminUser = new this({
            username: process.env.ADMIN_USERNAME || 'admin',
            password: process.env.ADMIN_PASSWORD || 'admin',
            email: process.env.ADMIN_EMAIL || 'admin@gmail.com',
            fullName: 'System Administrator',
            roles: [Role.ADMIN],
            status: UserStatus.ACTIVE
        });

        await adminUser.save();
        console.log('✅ Default admin account created');
    }
};

module.exports = mongoose.model('User', userSchema);
