// controllers/taskController.js
const Task = require('../models/taskModel');
const path = require('path');

// Cập nhật trạng thái công việc
exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Công việc không tồn tại" });
        }

        task.status = status;
        await task.save();

        return res.status(200).json({ message: "Trạng thái công việc đã được cập nhật", task });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Lưu tiến độ công việc
exports.addProgress = async (req, res) => {
    try {
        const { progress, note, updatedBy } = req.body;
        const { id } = req.params;

        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Công việc không tồn tại" });
        }

        task.progressHistory.push({
            progress,
            note,
            updatedBy,
            timestamp: Date.now()
        });

        await task.save();

        return res.status(200).json({ message: "Đã lưu tiến độ", task });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Upload báo cáo công việc
exports.uploadReport = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Công việc không tồn tại" });
        }

        const file = req.file;
        task.reports.push({
            filename: file.originalname,
            path: file.path,
            uploadedAt: Date.now()
        });

        await task.save();

        return res.status(200).json({ message: "Tải lên báo cáo thành công", file });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Lấy timeline tiến độ công việc
exports.getTimeline = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Công việc không tồn tại" });
        }

        return res.status(200).json(task.progressHistory);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
