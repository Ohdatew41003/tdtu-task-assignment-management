const express = require('express');
const router = express.Router();
const { authenticate, hasRole } = require('../middleware/auth');
const { getUsers } = require('../controllers/userController');

router.get('/admin/users', authenticate, hasRole('ADMIN'), getUsers);

module.exports = router;
