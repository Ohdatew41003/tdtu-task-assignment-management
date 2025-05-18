const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Role } = require('../constants');
const { v4: uuidv4 } = require('uuid');

const RoleSchema = new Schema({
    roleId: { type: String, required: true, unique: true }, // UUID
    roleName: {
        type: String,
        enum: Object.values(Role),
        required: true,
        unique: true
    },
    description: { type: String },
    permissions: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

RoleSchema.statics.createDefaultRolesIfNotExists = async function () {
    for (const roleName of Object.values(Role)) {
        const existing = await this.findOne({ roleName });
        if (!existing) {
            await this.create({
                roleId: `${uuidv4()}`,
                roleName,
                description: `${roleName} role`,
                permissions: []
            });
            console.log(`✅ Role '${roleName}' created`);
        }
    }
};
module.exports = mongoose.model('Role', RoleSchema);
