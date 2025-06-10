const Role = require('../models/Role');
const FunctionModel = require('../models/Function');
const RolePermission = require('../models/Role_Permission');

const getRoles = async (req, res) => {
    try {
        const roles = await Role.find({}, 'roleId roleName');
        res.json(roles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getFunctions = async (req, res) => {
    try {
        const functions = await FunctionModel.find({}, 'functionId functionName');
        res.json(functions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getRolePermissions = async (req, res) => {
    try {
        const { roleId } = req.params;
        const permissions = await RolePermission.find({ roleId });
        res.json(permissions.map(p => p.functionId));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const addRolePermission = async (req, res) => {
    try {
        const { roleId, functionId } = req.body;
        const exists = await RolePermission.findOne({ roleId, functionId });
        if (exists) return res.status(400).json({ message: 'Permission already exists' });

        const newPermission = new RolePermission({ roleId, functionId });
        await newPermission.save();
        res.json({ message: 'Permission added' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteRolePermission = async (req, res) => {
    try {
        const { roleId, functionId } = req.body;
        await RolePermission.deleteOne({ roleId, functionId });
        res.json({ message: 'Permission removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getRoles,
    getFunctions,
    getRolePermissions,
    addRolePermission,
    deleteRolePermission
};