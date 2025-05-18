const mongoose = require('mongoose');
const { Schema } = mongoose;

const resourceBookingSchema = new Schema({
    bookingId: { type: String, required: true, unique: true }, // UUID

    resourceId: { type: String, required: true }, // FK Resource
    requestedById: { type: String, required: true }, // FK User
    taskId: { type: String, default: null }, // FK Task (nullable)

    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },

    purpose: { type: String, required: true }, // text

    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
        required: true,
        default: 'Pending'
    },

    approvedById: { type: String, default: null }, // FK User
    approvalDate: { type: Date, default: null },
    rejectionReason: { type: String, default: null },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Validator: endTime phải sau startTime
resourceBookingSchema.pre('save', function (next) {
    if (this.endTime <= this.startTime) {
        return next(new Error('Thời điểm kết thúc phải sau thời điểm bắt đầu.'));
    }
    next();
});

module.exports = mongoose.model('ResourceBooking', resourceBookingSchema);
