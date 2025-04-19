//D:\DACNTT\routes\departmentRoutes.js
const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');

// Tạo department mới
router.post('/', departmentController.createDepartment);

// Lấy tất cả departments
router.get('/', departmentController.getDepartments);

// Cập nhật department
router.put('/:id', departmentController.updateDepartment);

// Xóa department
router.delete('/:id', departmentController.deleteDepartment);

module.exports = router;