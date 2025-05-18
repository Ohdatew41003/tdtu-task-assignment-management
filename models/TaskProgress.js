const mongoose = require('mongoose');
const { Schema } = mongoose;

const TaskProgressSchema = new Schema({
    progressId: { type: String, required: true, unique: true }, // UUID
    taskId: { type: String, ref: 'Task', required: true }, // UUID
    reportedById: { type: String, ref: 'User', required: true }, // UUID
    progressPercentage: { type: Number, min: 0, max: 100 },
    description: { type: String },
    attachment: { type: String },
    reportDate: { type: Date, default: Date.now },
    issues: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TaskProgress', TaskProgressSchema);
