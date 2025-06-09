const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');  // thư viện tạo UUID

const departmentSchema = new mongoose.Schema({
    departmentId: {
        type: String,
        required: true,
        unique: true,
        default: () => uuidv4(), // tự tạo UUID khi tạo document mới
    },
    name: {
        type: String,
        required: true,
        unique: true, // tên đơn vị duy nhất
        trim: true,
    },
    code: {
        type: String,
        required: true,
        unique: true, // mã đơn vị duy nhất
        uppercase: true,
        trim: true,
    },
    description: {
        type: String,
    },
    parentDepartmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        default: null, // đơn vị cấp cao nhất nếu null
    },
    headUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    establishedDate: {
        type: Date,
    },
    displayOrder: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Department', departmentSchema);
