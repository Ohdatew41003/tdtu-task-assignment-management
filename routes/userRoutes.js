//D:\DACNTT\routes\userRoutes.js
const express = require('express');
const router = express.Router();
const { authenticate, hasPermission } = require('../middleware/auth');
const { getUsers, createUser, updateUser } = require('../controllers/userController');

router.get("/get", authenticate, getUsers);
router.post("/create", authenticate, createUser);
router.put("/update/:id", authenticate, updateUser);


module.exports = router;
