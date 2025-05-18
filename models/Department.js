import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';  // thư viện tạo UUID

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
        default: null, // nếu null tức là đơn vị cấp cao nhất (ví dụ: Khoa)
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

export const Department = mongoose.model('Department', departmentSchema);
