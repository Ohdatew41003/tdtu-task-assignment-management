// controllers/userDepartmentController.js
const mongoose = require('mongoose');
const UserDepartment = require('../models/UserDepartment');

// Tạo quan hệ User - Department mới
const createUserDepartment = async (req, res) => {
    try {
        const { userId, departmentId, position, joinDate, isActive } = req.body;

        if (!userId || !departmentId) {
            return res.status(400).json({ error: 'Thiếu userId hoặc departmentId' });
        }

        const exist = await UserDepartment.findOne({ userId, departmentId });
        if (exist) {
            return res.status(400).json({ error: 'Quan hệ User - Department đã tồn tại' });
        }

        const newUserDept = new UserDepartment({
            userId,
            departmentId,
            position,
            joinDate: joinDate ? new Date(joinDate) : undefined,
            isActive: isActive !== undefined ? isActive : true,
        });

        await newUserDept.save();
        res.status(201).json(newUserDept);
    } catch (error) {
        console.error('Error createUserDepartment:', error);
        res.status(500).json({ error: 'Lỗi server khi tạo quan hệ UserDepartment' });
    }
};

// Cập nhật quan hệ
const updateUserDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'ID không hợp lệ' });
        }

        const updated = await UserDepartment.findByIdAndUpdate(id, updateData, { new: true });
        if (!updated) {
            return res.status(404).json({ error: 'Không tìm thấy UserDepartment' });
        }

        res.json(updated);
    } catch (error) {
        console.error('Error updateUserDepartment:', error);
        res.status(500).json({ error: 'Lỗi server khi cập nhật UserDepartment' });
    }
};

// Xóa
const deleteUserDepartment = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'ID không hợp lệ' });
        }

        const deleted = await UserDepartment.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ error: 'Không tìm thấy UserDepartment' });
        }

        res.json({ message: 'Xóa UserDepartment thành công' });
    } catch (error) {
        console.error('Error deleteUserDepartment:', error);
        res.status(500).json({ error: 'Lỗi server khi xóa UserDepartment' });
    }
};

// Lấy danh sách
const getUserDepartments = async (req, res) => {
    try {
        const { userId, departmentId } = req.query;
        const filter = {};
        if (userId) filter.userId = userId;
        if (departmentId) filter.departmentId = departmentId;

        const list = await UserDepartment.find(filter)
            .populate('userId', 'name email')
            .populate('departmentId', 'name description');

        res.json(list);
    } catch (error) {
        console.error('Error getUserDepartments:', error);
        res.status(500).json({ error: 'Lỗi server khi lấy danh sách UserDepartment' });
    }
};

module.exports = {
    createUserDepartment,
    updateUserDepartment,
    deleteUserDepartment,
    getUserDepartments,
};
