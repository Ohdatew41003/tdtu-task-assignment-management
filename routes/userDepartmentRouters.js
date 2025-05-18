const express = require('express');
const router = express.Router();
const userDepartmentController = require('../controllers/userDepartmentController');
const { authenticate, hasPermission } = require('../middleware/auth');

// Tạo quan hệ User - Department mới
router.post('/create', authenticate, userDepartmentController.createUserDepartment);

// Cập nhật thông tin UserDepartment (ví dụ đổi vị trí, ngày tham gia)
router.put('/update/:id', authenticate, userDepartmentController.updateUserDepartment);

// Xóa UserDepartment (gỡ user khỏi đơn vị)
router.delete('/delete/:id', authenticate, userDepartmentController.deleteUserDepartment);

// Lấy danh sách UserDepartment (có thể filter theo userId hoặc departmentId)
router.get('/', authenticate, userDepartmentController.getUserDepartments);

module.exports = router;
