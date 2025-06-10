// middleware/autoRegisterFunction.js

const FunctionModel = require('../models/Function');

function autoRegisterFunction(functionName) {
    return async (req, res, next) => {
        try {
            // Kiểm tra functionName đã tồn tại chưa
            const existingFunction = await FunctionModel.findOne({ functionName });

            if (!existingFunction) {
                // Nếu chưa có thì thêm mới
                const newFunction = new FunctionModel({ functionName });
                await newFunction.save();
                console.log(`✅ Đã tự động thêm chức năng: ${functionName}`);
            } else {
                console.log(`ℹ️ Chức năng "${functionName}" đã tồn tại`);
            }

            // (Có thể thêm kiểm tra quyền user tại đây nếu cần)

            next(); // Cho phép đi tiếp
        } catch (err) {
            console.error('❌ Lỗi khi xử lý middleware autoRegisterFunction:', err);
            res.status(500).json({ error: 'Lỗi khi xử lý quyền chức năng' });
        }
    };
}

module.exports = autoRegisterFunction;
