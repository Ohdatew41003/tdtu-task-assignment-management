// D:\DACNTT\routes\homeRoutes.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth'); // Import middleware phân quyền chung

// Route cho trang chủ, chỉ yêu cầu xác thực người dùng
router.get('/home', authenticate(), (req, res) => {
    res.render('home/index', {
        title: 'Trang chủ',
        user: req.user,  // Gán thông tin người dùng từ middleware
        success: req.flash('success')  // Nếu có bất kỳ thông báo thành công nào
    });
});

// Route yêu cầu quyền ADMIN
router.get('/admin', authenticate('ADMIN'), (req, res) => {
    res.render('admin/index', {
        title: 'Trang Admin',
        user: req.user,  // Gán thông tin người dùng từ middleware
        success: req.flash('success')  // Nếu có bất kỳ thông báo thành công nào
    });
});

// Route yêu cầu vai trò trưởng/phó khoa
router.get('/head-of-department', authenticate('HEAD_OF_DEPARTMENT'), (req, res) => {
    res.render('headOfDepartment/index', {
        title: 'Trang Trưởng Phó Khoa',
        user: req.user,  // Gán thông tin người dùng từ middleware
        success: req.flash('success')  // Nếu có bất kỳ thông báo thành công nào
    });
});

// Route yêu cầu vai trò trưởng bộ môn
router.get('/head-of-subject', authenticate('HEAD_OF_SUBJECT'), (req, res) => {
    res.render('headOfSubject/index', {
        title: 'Trang Trưởng Bộ Môn',
        user: req.user,  // Gán thông tin người dùng từ middleware
        success: req.flash('success')  // Nếu có bất kỳ thông báo thành công nào
    });
});

// Route yêu cầu vai trò đầu mối công việc
router.get('/task-contact-person', authenticate('TASK_CONTACT_PERSON'), (req, res) => {
    res.render('taskContactPerson/index', {
        title: 'Trang Đầu Mối Công Việc',
        user: req.user,  // Gán thông tin người dùng từ middleware
        success: req.flash('success')  // Nếu có bất kỳ thông báo thành công nào
    });
});
module.exports = router;
