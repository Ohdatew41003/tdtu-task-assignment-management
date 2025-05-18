const mongoose = require('mongoose');
const { Schema } = mongoose;

const DocumentSchema = new Schema({
    documentId: { type: String, required: true, unique: true }, // UUID
    title: { type: String, required: true },
    description: { type: String },
    filePath: { type: String, required: true },
    uploadedById: { type: String, ref: 'User', required: true }, // UUID
    uploadDate: { type: Date, default: Date.now },
    relatedTaskId: { type: String, ref: 'Task' } // UUID
});

module.exports = mongoose.model('Document', DocumentSchema);
