const mongoose = require('mongoose');
const { Schema } = mongoose;

const ResourceSchema = new Schema({
    resourceId: { type: String, required: true, unique: true }, // UUID
    name: { type: String, required: true, maxlength: 100 },
    type: { type: String, enum: ['Room', 'Equipment', 'Software'], required: true },
    description: { type: String },
    location: { type: String },
    specifications: { type: String },
    status: { type: String, enum: ['Available', 'InUse', 'Maintenance', 'Unavailable'], default: 'Available' },
    managedById: { type: String, ref: 'User' }, // UUID
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resource', ResourceSchema);
