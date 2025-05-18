const mongoose = require('mongoose');
const { Schema } = mongoose;

const TaskAssignmentSchema = new Schema({
    assignmentId: { type: String, required: true, unique: true }, // UUID
    taskId: { type: String, ref: 'Task', required: true }, // UUID
    assigneeId: { type: String, required: true }, // UUID
    assigneeType: { type: String, enum: ['User', 'Group'], required: true },
    assignedById: { type: String, ref: 'User' }, // UUID
    assignedDate: { type: Date, default: Date.now }
});

const TaskAssignment = mongoose.model('TaskAssignment', TaskAssignmentSchema);

module.exports = TaskAssignment;
