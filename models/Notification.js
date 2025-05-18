const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotificationSchema = new Schema({
    notificationId: { type: String, required: true, unique: true }, // UUID
    userId: { type: String, ref: 'User', required: true }, // UUID
    type: { type: String, enum: ['TaskAssignment', 'Reminder', 'StatusUpdate', 'Approval', 'Comment'], required: true },
    content: { type: String },
    relatedEntityId: { type: String },
    relatedEntityType: { type: String },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);
