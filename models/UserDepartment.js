//D:\DACNTT\models\UserDepartment.js
import mongoose from 'mongoose';
import { Position } from '../constants'; // đường dẫn bạn điều chỉnh cho đúng

const userDepartmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true,
    },
    position: {
        type: String,
        enum: Object.values(Position),  // dùng enum từ constants Position
        default: Position.USER,
    },
    joinDate: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

// đảm bảo userId + departmentId không trùng
userDepartmentSchema.index({ userId: 1, departmentId: 1 }, { unique: true });

export const UserDepartment = mongoose.model('UserDepartment', userDepartmentSchema);
