const TaskAssignment = require('../models/TaskAssignment');
const { v4: uuidv4 } = require('uuid');

const getTaskAssignments = async (req, res) => {
    try {
        const assignments = await TaskAssignment.find().lean();
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi lấy danh sách phân công' });
    }
};

const createTaskAssignment = async (req, res) => {
    try {
        const { taskId, assigneeId, assigneeType, assignedById, assignedDate } = req.body;
        console.log('📦 Dữ liệu gửi đi:', taskId, assigneeId, assigneeType, assignedById, assignedDate);
        if (!taskId || !assigneeId || !assigneeType || !assignedById) {
            return res.status(400).json({ error: 'Thiếu dữ liệu bắt buộc' });
        }

        const newAssignment = new TaskAssignment({
            assignmentId: uuidv4(),
            taskId,
            assigneeId,
            assigneeType,
            assignedById,
            assignedDate: assignedDate || Date.now(),
        });

        await newAssignment.save();

        res.status(201).json({ message: 'Phân công thành công', assignment: newAssignment });
    } catch (error) {
        console.error('Lỗi tạo phân công:', error);
        res.status(500).json({ error: 'Lỗi tạo phân công', details: error.message });
    }
};

module.exports = {
    getTaskAssignments,
    createTaskAssignment,
};
