// D:\DACNTT\routes\authRoutes.js
const express = require('express');
const router = express.Router();
const { login, logout, register } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// Hiển thị form đăng nhập
router.get('/login', (req, res) => {
    res.render('auth/login');  // Render trang đăng nhập
});

// Xử lý đăng nhập (POST)
router.post('/login', login);

// Hiển thị form đăng ký
router.get('/register', (req, res) => {
    res.render('auth/register');  // Render trang đăng ký
});

// Xử lý đăng ký (POST)
router.post('/register', register);

// Đăng xuất (chỉ cho phép user đã đăng nhập mới logout được)
router.post('/logout', authenticate, logout);

module.exports = router;
