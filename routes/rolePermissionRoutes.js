const express = require('express');
const router = express.Router();
const rolePermissionController = require('../controllers/rolePermissionController');

router.get('/roles', rolePermissionController.getRoles);
router.get('/functions', rolePermissionController.getFunctions);
router.get('/role-permission/:roleId', rolePermissionController.getRolePermissions);
router.post('/role-permission', rolePermissionController.addRolePermission);
router.delete('/role-permission', rolePermissionController.deleteRolePermission);

module.exports = router;
