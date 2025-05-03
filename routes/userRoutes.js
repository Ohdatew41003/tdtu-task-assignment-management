//D:\DACNTT\routes\userRoutes.js
const express = require('express');
const router = express.Router();
const { authenticate, hasRole } = require('../middleware/auth');
const { getUsers, createUser, updateUser } = require('../controllers/userController');

router.get('/', authenticate, hasRole('ADMIN'), getUsers);
router.post('/', authenticate, hasRole('ADMIN'), createUser);
router.put('/:id', authenticate, hasRole('ADMIN'), updateUser);

module.exports = router;
