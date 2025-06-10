//D:\DACNTT\routes\userRoutes.js
const express = require('express');
const router = express.Router();
const { authenticate, hasPermission } = require('../middleware/auth');
const { getUsers, createUser, updateUser } = require('../controllers/userController');
const autoRegisterFunction = require('../middleware/autoRegisterFunction');

router.get("/get", authenticate, getUsers);
router.post("/create", authenticate, createUser);
router.put("/update/:id", authenticate, updateUser);

router.get('/user',
    authenticate,
    autoRegisterFunction('trangquanlynguoidung'),
    hasPermission('trangquanlynguoidung'),
    (req, res) => {
        res.render('user/index', {
            title: 'Quản lý Nguời dùng',
            user: req.user
        });
    });
module.exports = router;
