const TaskProgress = require('../models/TaskProgress');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');

// Thư mục uploads
const UPLOADS_BASE_PATH = path.join(__dirname, '..', 'uploads');

// Giả lập lấy tên file từ taskAssignmentId (sau này thay bằng DB thật)


// Controller download
const downloadAttachment = function (req, res) {
    const progressId = req.params.progressId;
    console.log('Download request for progressId:', progressId);

    try {
        const dirPath = path.join(UPLOADS_BASE_PATH, progressId);
        console.log('Checking directory:', dirPath);

        if (!fs.existsSync(dirPath)) {
            return res.status(404).send('Không tìm thấy thư mục cho progressId này');
        }

        // Lấy danh sách file trong thư mục
        const files = fs.readdirSync(dirPath);
        console.log('Files in directory:', files);

        if (files.length === 0) {
            return res.status(404).send('Không có file nào trong thư mục');
        }

        // Giả sử chỉ có 1 file cần download
        const fileName = files[0];
        const filePath = path.join(dirPath, fileName);

        res.download(filePath, fileName, function (err) {
            if (err) {
                console.error('Lỗi khi gửi file:', err);
                res.status(500).send('Lỗi khi gửi file');
            }
        });

    } catch (error) {
        console.error('Lỗi server:', error);
        res.status(500).send('Lỗi server');
    }
};

const createTaskProgress = async (req, res) => {
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

const getAllTaskProgress = async (req, res) => {
    try {
        let taskProgressList;
        console.log('User role:', req.user.username, req.user.userId);
        if (req.user.username === 'admin') {
            // Admin: lấy toàn bộ
            taskProgressList = await TaskProgress.find().lean();
        } else {
            // Người dùng thường: chỉ lấy tiến độ của mình
            taskProgressList = await TaskProgress.find({ reportedById: req.user.userId }).lean();
        }

        return res.status(200).json({ data: taskProgressList });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi server khi lấy tiến độ công việc' });
    }
};


const updateProgress = async (req, res) => {
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

        // Nếu có file upload → lưu Document mới → lưu documentId vào attachment
        if (req.file) {
            // Nếu trước đó đã có attachment (documentId), xóa document cũ + xóa file cũ
            if (taskProgress.attachment) {
                const oldDocument = await Document.findOne({ documentId: taskProgress.attachment });
                if (oldDocument) {
                    // Xóa file vật lý trên ổ đĩa
                    const oldFilePath = path.join(__dirname, '..', oldDocument.filePath);
                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                    }

                    // Xóa document record trong DB
                    await Document.deleteOne({ documentId: taskProgress.attachment });
                }
            }

            // Tạo Document mới
            const newDocumentId = uuidv4();
            const document = new Document({
                documentId: newDocumentId,
                title: req.file.originalname,
                description: `File đính kèm cho tiến độ ${progressId}`,
                filePath: path.join('uploads', progressId, req.file.filename), // ➜ đúng yêu cầu của bạn
                uploadedById: taskProgress.reportedById, // người báo cáo
                relatedTaskId: taskProgress.taskId
            });
            await document.save();

            // Lưu documentId vào field attachment
            taskProgress.attachment = newDocumentId;
        }

        taskProgress.updatedAt = new Date();

        await taskProgress.save();

        return res.json({ success: true, data: taskProgress });
    } catch (error) {
        console.error('Lỗi khi cập nhật tiến độ công việc:', error);
        return res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};



const deleteProgress = async (req, res) => {
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

module.exports = {
    createTaskProgress,
    getAllTaskProgress,
    updateProgress,
    deleteProgress,
    downloadAttachment
};
