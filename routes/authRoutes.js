// D:\DACNTT\routes\authRoutes.js
const express = require('express');
const router = express.Router();
const { login, logout, register } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// Display login form
router.get('/login', (req, res) => {
    res.render('auth/login');  // Render trang đăng nhập
});

router.post('/login', login);  // Đảm bảo rằng route này xử lý POST cho /login


// Display registration form
router.get('/register', (req, res) => {
    res.render('auth/register');  // Render trang đăng ký
});

// Process registration
router.post('/register', register);

// Logout
router.post('/logout', logout);

module.exports = router;
