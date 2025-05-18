const TaskProgress = require('../models/TaskProgress');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// Tạo tiến độ mới
exports.createTaskProgress = async (req, res) => {
    try {
        const { taskId, reportedById, progressPercentage, description, issues } = req.body;

        if (!taskId || !reportedById) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc: taskId hoặc reportedById' });
        }

        const newProgress = new TaskProgress({
            progressId: uuidv4(),
            taskId,
            reportedById,
            progressPercentage: progressPercentage || 0,
            description: description || '',
            issues: issues || '',
            reportDate: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await newProgress.save();

        return res.status(201).json({ message: 'Tạo tiến độ công việc thành công', data: newProgress });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi server khi tạo tiến độ công việc' });
    }
};

// Lấy tất cả tiến độ
exports.getAllTaskProgress = async (req, res) => {
    try {
        const taskProgressList = await TaskProgress.find().lean();
        return res.status(200).json({ data: taskProgressList });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi server khi lấy tiến độ công việc' });
    }
};

// Cập nhật tiến độ (có upload file)
exports.updateProgress = async (req, res) => {
    try {
        const { progressId } = req.params;
        const { progressPercentage, description, issues } = req.body;

        const taskProgress = await TaskProgress.findOne({ progressId });
        if (!taskProgress) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy tiến độ công việc' });
        }

        if (progressPercentage !== undefined) taskProgress.progressPercentage = Number(progressPercentage);
        if (description !== undefined) taskProgress.description = description;
        if (issues !== undefined) taskProgress.issues = issues;

        // Nếu có file upload, xóa file cũ nếu có rồi lưu file mới
        if (req.file) {
            if (taskProgress.attachment) {
                // Xóa file cũ (nếu có)
                const oldPath = path.join(__dirname, '..', taskProgress.attachment);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            taskProgress.attachment = path.join('uploads', req.file.filename);
        }

        taskProgress.updatedAt = new Date();

        await taskProgress.save();

        return res.json({ success: true, data: taskProgress });
    } catch (error) {
        console.error('Lỗi khi cập nhật tiến độ công việc:', error);
        return res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Xóa tiến độ (nếu cần)
exports.deleteProgress = async (req, res) => {
    try {
        const { progressId } = req.params;
        const taskProgress = await TaskProgress.findOne({ progressId });
        if (!taskProgress) {
            return res.status(404).json({ message: 'Không tìm thấy tiến độ công việc' });
        }

        // Xóa file đính kèm nếu có
        if (taskProgress.attachment) {
            const filePath = path.join(__dirname, '..', taskProgress.attachment);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await TaskProgress.deleteOne({ progressId });

        return res.json({ message: 'Xóa tiến độ công việc thành công' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi server khi xóa tiến độ công việc' });
    }
};
