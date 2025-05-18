const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const { authenticate, hasPermission } = require('../middleware/auth');

// Tạo đơn vị mới - chỉ admin hoặc leader được tạo
router.post('/create', authenticate, departmentController.createDepartment);

// Sửa đơn vị - chỉ admin hoặc leader được sửa
router.put('/update/:id', authenticate, departmentController.updateDepartment);

// Xóa đơn vị - chỉ admin mới xóa được
router.delete('/delete/:id', authenticate, departmentController.deleteDepartment);

// Lấy danh sách đơn vị - có thể public hoặc cần auth tùy yêu cầu
router.get('/', authenticate, departmentController.getDepartments);

module.exports = router;
