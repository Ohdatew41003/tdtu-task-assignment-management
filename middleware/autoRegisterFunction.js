// middleware/autoRegisterFunction.js
const FunctionModel = require('../models/Function');
const ensureAdminHasAllPermissions = require('../utils/ensureAdminPermissions');

function autoRegisterFunction(functionName) {
    return async (req, res, next) => {
        try {
            // Tự động thêm function mới nếu chưa có
            const exists = await FunctionModel.findOne({ functionName });
            if (!exists) {
                const func = await FunctionModel.create({ functionName });
                console.log('✅ Thêm chức năng:', functionName);

                // Sau khi thêm, chạy ensure để Admin có quyền luôn
                await ensureAdminHasAllPermissions();
            }

            next();
        } catch (err) {
            console.error('❌ autoRegisterFunction lỗi:', err);
            res.status(500).json({ error: 'Lỗi khi đăng ký chức năng' });
        }
    };
}

module.exports = autoRegisterFunction;
