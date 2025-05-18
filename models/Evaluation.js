const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');
const EvaluationSchema = new Schema({
    evaluationId: {
        type: String,
        default: uuidv4,
        required: true,
    },
    taskId: { type: String, ref: 'Task', required: true }, // UUID
    evaluatorId: { type: String, ref: 'User', required: true }, // UUID
    rating: {
        type: String,
        enum: ['NotCompleted', 'Weak', 'Completed', 'Active', 'Good', 'Excellent']
    },
    comment: { type: String },
    improvementSuggestions: { type: String },
    evaluationDate: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Evaluation', EvaluationSchema);
