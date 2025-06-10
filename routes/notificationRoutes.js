const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticate } = require('../middleware/auth');

// Lấy danh sách thông báo của user hiện tại
router.get('/get', authenticate, notificationController.getUserNotifications);

// Đánh dấu một thông báo đã đọc
router.post('/mark-read', authenticate, notificationController.markReadNotification);

module.exports = router;
