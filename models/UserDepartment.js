// models/UserDepartment.js
const mongoose = require('mongoose');
const { Position } = require('../constants/index');

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
        enum: Object.values(Position),
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

userDepartmentSchema.index({ userId: 1, departmentId: 1 }, { unique: true });

module.exports = mongoose.model('UserDepartment', userDepartmentSchema);
