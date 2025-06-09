const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');

const TaskExtensionRequestSchema = new Schema({
    extensionRequestId: { type: String, required: true, unique: true, default: () => uuidv4() }, // UUID
    taskId: { type: String, ref: 'Task', required: true },
    requestedById: { type: String, ref: 'User', required: true },
    proposeNewEndDate: { type: Date, required: true },
    reason: { type: String },

    // Thêm trường này để lưu id TaskProgress liên quan
    taskProgressId: { type: String, ref: 'TaskProgress', default: null },

    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    adminComment: { type: String, default: '' },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});


module.exports = mongoose.models.TaskExtensionRequest || mongoose.model('TaskExtensionRequest', TaskExtensionRequestSchema);
