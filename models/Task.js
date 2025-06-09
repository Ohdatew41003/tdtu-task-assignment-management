const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const { Schema } = mongoose;

const taskSchema = new Schema({
    taskId: { type: String, required: true, unique: true, default: () => uuidv4() },
    title: { type: String, required: true, maxlength: 200 },
    description: { type: String, required: true },
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
    recurringPattern: { type: Schema.Types.Mixed, default: null },
    createdById: { type: String, default: null },
    departmentId: { type: String, default: null },
    deadlineType: {
        type: String,
        enum: ['Hard', 'Soft'],
        required: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

taskSchema.pre('save', function (next) {
    if (this.endDate <= this.startDate) {
        return next(new Error('Ngày kết thúc phải sau ngày bắt đầu'));
    }
    if (this.isRecurring && !this.recurringPattern) {
        return next(new Error('Công việc lặp lại phải có mẫu lặp lại (recurringPattern)'));
    }
    next();
});

module.exports = mongoose.models.Task || mongoose.model('Task', taskSchema);

