const mongoose = require('mongoose');
const { Schema } = mongoose;

const userRoleSchema = new Schema({
    userId: {
        type: String,  // UUID string
        required: true,
        ref: 'User'
    },
    roleId: {
        type: String,  // UUID string
        required: true,
        ref: 'Role'
    },
    assignedDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    expiryDate: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Tạo compound index cho (userId, roleId) duy nhất
userRoleSchema.index({ userId: 1, roleId: 1 }, { unique: true });

// Bạn có thể tạo middleware để giả lập "ON DELETE CASCADE" khi xóa User hoặc Role
// Ví dụ khi xóa User, xóa hết các userRole liên quan:
userRoleSchema.statics.deleteByUserId = async function (userId) {
    return this.deleteMany({ userId });
};
userRoleSchema.statics.deleteByRoleId = async function (roleId) {
    return this.deleteMany({ roleId });
};

module.exports = mongoose.model('UserRole', userRoleSchema);
