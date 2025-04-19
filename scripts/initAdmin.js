require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Đang kết nối database...');
        await User.createAdminIfNotExists();
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Lỗi khởi tạo admin:', err);
        process.exit(1);
    });