const express = require('express');
const router = express.Router();
const { authenticate, authorizeRole } = require('../middlewares/auth');
const extensionController = require('../controllers/extensionController');

// Trang giao diện gửi yêu cầu gia hạn (dành cho giảng viên/cán bộ, trưởng nhóm dự án)
router.get('/request', authenticate, extensionController.getExtensionRequestPage);
router.post('/request', authenticate, extensionController.postExtensionRequest);

// Trang phê duyệt gia hạn (dành cho trưởng khoa/phó khoa)
router.get('/approve', authenticate, authorizeRole(['truong-khoa', 'pho-khoa']), extensionController.getApprovalPage);
router.post('/approve/:id', authenticate, authorizeRole(['truong-khoa', 'pho-khoa']), extensionController.postApproval);

module.exports = router;
