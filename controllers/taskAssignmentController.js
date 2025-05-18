const TaskAssignment = require('../models/TaskAssignment');
const { v4: uuidv4 } = require('uuid');
const TaskProgress = require('../models/TaskProgress');
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

        // Tạo TaskAssignment mới
        const newAssignment = new TaskAssignment({
            assignmentId: uuidv4(),
            taskId,
            assigneeId,
            assigneeType,
            assignedById,
            assignedDate: assignedDate || Date.now(),
        });

        await newAssignment.save();

        // Tạo TaskProgress tương ứng với progressPercentage = 0
        const newProgress = new TaskProgress({
            progressId: uuidv4(),
            taskId,
            reportedById: assignedById,
            progressPercentage: 0,
            description: 'Khởi tạo tiến độ sau khi phân công thành công',
            reportDate: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await newProgress.save();

        res.status(201).json({
            message: 'Phân công thành công và tạo tiến độ công việc thành công',
            assignment: newAssignment,
            progress: newProgress
        });
    } catch (error) {
        console.error('Lỗi tạo phân công:', error);
        res.status(500).json({ error: 'Lỗi tạo phân công', details: error.message });
    }
};

module.exports = {
    getTaskAssignments,
    createTaskAssignment,
};
