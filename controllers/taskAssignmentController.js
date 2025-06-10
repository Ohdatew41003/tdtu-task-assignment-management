const TaskAssignment = require('../models/TaskAssignment');
const { v4: uuidv4 } = require('uuid');
const TaskProgress = require('../models/TaskProgress');
const Task = require('../models/Task');
const Notification = require('../models/Notification');

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
        if (!taskId || !assigneeId || !assigneeType || !assignedById) {
            return res.status(400).json({ error: 'Thiếu dữ liệu bắt buộc' });
        }

        const newAssignment = await TaskAssignment.create({
            assignmentId: uuidv4(), taskId, assigneeId, assigneeType, assignedById,
            assignedDate: assignedDate || Date.now(),
        });

        const newProgress = await TaskProgress.create({
            progressId: uuidv4(), taskId, reportedById: assignedById,
            progressPercentage: 0, description: 'Khởi tạo tiến độ sau khi phân công',
            createdAt: new Date(), updatedAt: new Date(),
        });

        await Task.findOneAndUpdate({ taskId }, {
            status: 'InProgress',
            updatedAt: new Date()
        });

        // ✅ Tạo Notification
        await Notification.create({
            notificationId: uuidv4(),
            userId: assignedById,
            type: 'TaskAssignment',
            content: `Bạn đã được phân công công việc với mã: ${taskId}`,
            relatedEntityId: taskId,
            relatedEntityType: 'TaskAssignment'
        });

        res.status(201).json({
            message: 'Phân công, tạo tiến độ và thông báo thành công',
            assignment: newAssignment,
            progress: newProgress
        });

    } catch (error) {
        console.error('Lỗi tạo phân công:', error);
        res.status(500).json({ error: 'Lỗi khi phân công công việc', details: error.message });
    }
};

module.exports = {
    getTaskAssignments,
    createTaskAssignment,
};
