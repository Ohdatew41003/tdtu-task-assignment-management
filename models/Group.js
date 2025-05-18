const mongoose = require('mongoose');
const { Schema } = mongoose;

const GroupSchema = new Schema({
    groupId: { type: String, required: true, unique: true }, // UUID
    name: { type: String, required: true, maxlength: 100 },
    description: { type: String },
    purpose: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    departmentId: { type: String, ref: 'Department' }, // UUID hoặc chuỗi id tùy hệ thống
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Group', GroupSchema);
