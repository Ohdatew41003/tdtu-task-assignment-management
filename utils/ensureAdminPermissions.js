// utils/ensureAdminPermissions.js

const Role = require('../models/Role');
const FunctionModel = require('../models/Function');
const RolePermission = require('../models/Role_Permission');

async function ensureAdminHasAllPermissions() {
    try {
        // 1. Tìm role ADMIN
        const adminRole = await Role.findOne({ roleName: 'ADMIN' });
        if (!adminRole) {
            console.log('Không tìm thấy role ADMIN');
            return;
        }

        const roleId = adminRole.roleId;

        // 2. Lấy danh sách functionId hiện có
        const allFunctions = await FunctionModel.find().select('functionId');
        const allFunctionIds = allFunctions.map(f => f.functionId);

        // 3. Lấy các functionId mà ADMIN đã có
        const existingPermissions = await RolePermission.find({ roleId }).select('functionId');
        const existingFunctionIds = existingPermissions.map(p => p.functionId);

        // 4. Xác định các functionId còn thiếu
        const missingFunctionIds = allFunctionIds.filter(fid => !existingFunctionIds.includes(fid));

        // 5. Nếu thiếu thì thêm
        if (missingFunctionIds.length > 0) {
            const newPermissions = missingFunctionIds.map(fid => ({
                roleId,
                functionId: fid
            }));

            await RolePermission.insertMany(newPermissions);

            console.log(`ADMIN đã được cấp thêm ${missingFunctionIds.length} quyền mới`);
        } else {
            console.log('ADMIN đã có đầy đủ quyền');
        }
    } catch (error) {
        console.error('Lỗi khi kiểm tra/gán quyền ADMIN:', error);
    }
}

module.exports = ensureAdminHasAllPermissions;
