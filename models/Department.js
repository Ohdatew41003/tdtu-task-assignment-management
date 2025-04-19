//D:\DACNTT\models\Department.js
const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    departmentId: {
        type: String,
        unique: true,
        required: true
    },
    name: { type: String, required: true },
    description: String,
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    path: String,
    head: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deputyHead: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'ACTIVE'
    },
    createdDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now }
});

// Instance methods
departmentSchema.methods.getMembers = async function () {
    return mongoose.model('User').find({ department: this._id });
};

departmentSchema.methods.addMember = async function (userId) {
    const user = await mongoose.model('User').findById(userId);
    user.department = this._id;
    return user.save();
};

// Middleware to automatically update modifiedDate
departmentSchema.pre('save', function (next) {
    this.modifiedDate = Date.now();
    next();
});

module.exports = mongoose.model('Department', departmentSchema);
