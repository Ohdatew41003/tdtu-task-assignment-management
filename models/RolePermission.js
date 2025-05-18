const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rolePermissionSchema = new Schema({
    roleId: {
        type: String,
        required: true,
        ref: 'Role'
    },
    permissionId: {
        type: String,
        required: true,
        ref: 'Permission'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('RolePermission', rolePermissionSchema);
