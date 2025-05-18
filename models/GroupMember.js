const mongoose = require('mongoose');
const { Schema } = mongoose;

const GroupMemberSchema = new Schema({
    groupId: { type: String, ref: 'Group', required: true }, // UUID
    userId: { type: String, ref: 'User', required: true }, // UUID
    role: { type: String, maxlength: 50 },
    joinDate: { type: Date },
    isActive: { type: Boolean, default: true }
}, { _id: false });

GroupMemberSchema.index({ groupId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('GroupMember', GroupMemberSchema);
