const express = require('express');
const router = express.Router();
const { authenticate, hasPermission } = require('../middleware/auth');
const { getUsers } = require('../controllers/userController');

router.get('/index', authenticate, (req, res) => {
    res.render('admin/index', { user: req.user });
});

router.get('/get', authenticate, getUsers);

module.exports = router;
