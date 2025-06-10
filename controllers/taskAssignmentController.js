const TaskAssignment = require('../models/TaskAssignment');
const { v4: uuidv4 } = require('uuid');
const TaskProgress = require('../models/TaskProgress');
const Task = require('../models/Task'); // Import model Task để cập nhật trạng thái
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

        // Tạo TaskProgress tương ứng
        const newProgress = new TaskProgress({
            progressId: uuidv4(),
            taskId,
            reportedById: assignedById,
            progressPercentage: 0,
            description: 'Khởi tạo tiến độ sau khi phân công thành công',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await newProgress.save();

        // ✅ Cập nhật trạng thái Task thành InProgress
        await Task.findOneAndUpdate(
            { taskId }, // Giả sử taskId là UUID trong DB
            { status: 'InProgress', updatedAt: new Date() }
        );

        res.status(201).json({
            message: 'Phân công thành công, tạo tiến độ và cập nhật trạng thái công việc thành InProgress',
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
