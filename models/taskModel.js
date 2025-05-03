// models/taskModel.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true, enum: ["PENDING", "IN_PROGRESS", "DONE", "LATE"] },
    deadline: { type: Date, required: true },
    assignedTo: { type: String, required: true },
    progressHistory: [
        {
            progress: { type: Number, required: true },
            note: { type: String, required: true },
            updatedBy: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ],
    reports: [
        {
            filename: { type: String, required: true },
            path: { type: String, required: true },
            uploadedAt: { type: Date, default: Date.now }
        }
    ]
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
