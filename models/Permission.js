const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Permission: PermissionEnum } = require('../constants/index'); // file constants export enum Permission
const { v4: uuidv4 } = require('uuid');
const Role = require('./Role');
const RolePermission = require('./RolePermission');
const UserRole = require('./UserRole');

const PermissionSchema = new Schema({
    permissionId: { type: String, required: true, unique: true }, // UUID
    code: {
        type: String,
        enum: Object.values(PermissionEnum),  // lấy enum từ constants
        required: true,
        unique: true
    },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

PermissionSchema.statics.createDefaultPermissionsIfNotExists = async function () {
    for (const code of Object.values(PermissionEnum)) {
        const existing = await this.findOne({ code });
        if (!existing) {
            await this.create({
                permissionId: `${uuidv4()}`,
                code,
                description: `${code} permission`
            });
            console.log(`✅ Permission '${code}' created`);
        }
    }
};


PermissionSchema.statics.assignAllPermissionsToAdminRole = async function () {
    // 1. Lấy role admin
    const adminRole = await Role.findOne({ roleName: 'ADMIN' });
    if (!adminRole) {
        console.log('Chưa có role admin');
        return;
    }

    // 2. Lấy tất cả permission
    const allPermissions = await this.find({});

    // 3. Xóa hết quyền cũ của role admin (nếu muốn reset)
    await RolePermission.deleteMany({ roleId: adminRole.roleId });

    // 4. Gán lại tất cả quyền cho role admin
    const rolePermissions = allPermissions.map(p => ({
        roleId: adminRole.roleId,
        permissionId: p.permissionId,
    }));
    await RolePermission.insertMany(rolePermissions);

    // 5. Lấy tất cả user được gán role admin
    const adminUsers = await UserRole.find({ roleId: adminRole.roleId });

    console.log(`✅ Đã gán tất cả quyền cho role admin`);
    console.log(`Có ${adminUsers.length} user đang có role admin`);

    // Nếu cần xử lý thêm user nào đó thì ở đây

};

module.exports = mongoose.model('Permission', PermissionSchema);
