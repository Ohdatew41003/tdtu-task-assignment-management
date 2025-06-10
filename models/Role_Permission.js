// models/Role_Permission.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const rolePermissionSchema = new Schema({
    roleId: { type: String, required: true, ref: 'Role' },
    functionId: { type: Number, required: true, ref: 'Function' },
    assignedDate: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Đảm bảo 1 role - 1 functionId là duy nhất
rolePermissionSchema.index({ roleId: 1, functionId: 1 }, { unique: true });

module.exports = mongoose.model('Role_Permission', rolePermissionSchema);
