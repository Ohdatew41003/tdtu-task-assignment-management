// models/Function.js

const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const functionSchema = new mongoose.Schema({
    functionId: {
        type: Number,
        unique: true
    },
    functionName: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

functionSchema.plugin(AutoIncrement, { inc_field: 'functionId' });

module.exports = mongoose.model('Function', functionSchema);
