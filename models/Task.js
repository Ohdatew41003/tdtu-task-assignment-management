import mongoose from 'mongoose';
const { Schema } = mongoose;
import { v4 as uuidv4 } from 'uuid';

const taskSchema = new Schema({
    taskId: { type: String, required: true, unique: true, default: () => uuidv4(), }, // UUID chuỗi
    title: { type: String, required: true, maxlength: 200 },
    description: { type: String, required: true }, // text
    objective: { type: String, default: null },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    priority: {
        type: String,
        enum: ['Urgent', 'High', 'Medium', 'Low', 'Planned'],
        required: true
    },
    status: {
        type: String,
        enum: ['NotStarted', 'Assigned', 'InProgress', 'Completed', 'Paused', 'Cancelled'],
        required: true
    },
    isRecurring: { type: Boolean, default: false },
    recurringPattern: { type: Schema.Types.Mixed, default: null }, // JSON, có thể null
    createdById: { type: String, default: null }, // FK User, UUID
    departmentId: { type: String, default: null }, // FK Department, UUID
    deadlineType: {
        type: String,
        enum: ['Hard', 'Soft'],
        required: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Validator đảm bảo endDate sau startDate
taskSchema.pre('save', function (next) {
    if (this.endDate <= this.startDate) {
        return next(new Error('Ngày kết thúc phải sau ngày bắt đầu'));
    }
    if (this.isRecurring && !this.recurringPattern) {
        return next(new Error('Công việc lặp lại phải có mẫu lặp lại (recurringPattern)'));
    }
    next();
});

export const Task = mongoose.model('Task', taskSchema);