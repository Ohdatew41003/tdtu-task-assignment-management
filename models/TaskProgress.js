const mongoose = require('mongoose');
const { Schema } = mongoose;
const Task = require('./Task'); // import model Task để lấy endDate

const TaskProgressSchema = new Schema({
    progressId: { type: String, required: true, unique: true }, // UUID
    taskId: { type: String, ref: 'Task', required: true }, // UUID
    reportedById: { type: String, ref: 'User', required: true }, // UUID
    progressPercentage: { type: Number, min: 0, max: 100 },
    description: { type: String },
    attachment: { type: String },
    reportDate: { type: Date }, // Không set default Date.now, sẽ xử lý trong pre-save
    issues: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Hook để gán reportDate = endDate của task nếu reportDate chưa có
TaskProgressSchema.pre('save', async function (next) {
    try {
        if (!this.reportDate) {
            const task = await Task.findOne({ taskId: this.taskId });
            if (!task) {
                return next(new Error('Task không tồn tại'));
            }
            this.reportDate = task.endDate;
        }
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('TaskProgress', TaskProgressSchema);

