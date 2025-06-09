const express = require('express');
const router = express.Router();

const taskExtensionRequestController = require('../controllers/taskExtensionRequestController');
const { authenticate, hasPermission } = require('../middleware/auth');

router.post('/create', authenticate, taskExtensionRequestController.createExtensionRequest);

// Admin xem danh sách yêu cầu
router.get('/get', taskExtensionRequestController.getAllExtensionRequests);

router.get('/getname', taskExtensionRequestController.get_name_ExtensionRequests);

// Admin duyệt yêu cầu
router.post('/:id/approve', taskExtensionRequestController.approveExtensionRequest);

router.get('/task-assignments', taskExtensionRequestController.getTaskAssignments);

module.exports = router;
