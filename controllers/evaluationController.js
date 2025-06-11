const Evaluation = require('../models/Evaluation');
const User = require('../models/User');
const TaskProgress = require('../models/TaskProgress');
const Task = require('../models/Task');

// Tạo mới đánh giá
const createEvaluation = async (req, res) => {
    try {
        console.log('Dữ liệu nhận được từ client:', req.body);

        const newEvaluation = new Evaluation(req.body);
        const saved = await newEvaluation.save();

        console.log('Đánh giá mới đã lưu:', saved);

        res.status(201).json(saved);
    } catch (error) {
        console.error('Lỗi khi tạo đánh giá:', error);
        res.status(400).json({ message: 'Tạo đánh giá thất bại', error });
    }
};


// Lấy tất cả đánh giá
const getAllEvaluations = async (req, res) => {
    try {
        const evaluations = await Evaluation.find();
        res.json(evaluations);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách đánh giá', error });
    }
};

// Lấy đánh giá theo ID
const getEvaluationById = async (req, res) => {
    try {
        const evaluation = await Evaluation.findOne({ evaluationId: req.params.id });
        if (!evaluation) return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
        res.json(evaluation);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tìm đánh giá', error });
    }
};

// Cập nhật đánh giá
const updateEvaluation = async (req, res) => {
    try {
        const updated = await Evaluation.findOneAndUpdate(
            { evaluationId: req.params.id },
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Không tìm thấy đánh giá để cập nhật' });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: 'Cập nhật thất bại', error });
    }
};

// Xoá đánh giá
const deleteEvaluation = async (req, res) => {
    try {
        const deleted = await Evaluation.findOneAndDelete({ evaluationId: req.params.id });
        if (!deleted) return res.status(404).json({ message: 'Không tìm thấy đánh giá để xoá' });
        res.json({ message: 'Xoá thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Xoá thất bại', error });
    }
};

const getUserTaskStats = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Lấy thông tin user
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ error: 'Không tìm thấy user' });
        }

        // Lấy taskId mà user này đã báo cáo
        const progressList = await TaskProgress.find({ reportedById: userId });
        const taskIds = progressList.map(p => p.taskId);
        console.log('Task IDs:', taskIds);
        // Lấy thông tin task tương ứng
        const tasks = await Task.find({ taskId: { $in: taskIds } });

        // Đếm theo status
        let inProgress = 0, completed = 0, cancelled = 0;
        tasks.forEach(task => {
            if (task.status === 'InProgress') inProgress++;
            else if (task.status === 'Completed') completed++;
            else if (task.status === 'Cancelled') cancelled++;
        });

        // Trả về client
        res.json({
            fullName: user.fullName,
            role: user.role,
            inProgress,
            completed,
            cancelled
        });
    } catch (error) {
        console.error('Lỗi khi lấy thống kê:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
};



module.exports = {
    createEvaluation,
    getAllEvaluations,
    getEvaluationById,
    updateEvaluation,
    deleteEvaluation,
    getUserTaskStats
};
