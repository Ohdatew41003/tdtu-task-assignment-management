const Notification = require('../models/Notification');
const Task = require('../models/Task');

const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.userId })
            .sort({ createdAt: -1 });

        // Lấy danh sách relatedEntityId duy nhất
        const relatedIds = notifications.map(n => n.relatedEntityId).filter(Boolean);
        const tasks = await Task.find({ taskId: { $in: relatedIds } });
        const taskMap = {};
        tasks.forEach(task => {
            taskMap[task.taskId] = task.title;
        });

        const result = notifications.map(n => ({
            notificationId: n.notificationId,
            content: n.content,
            isRead: n.isRead,
            createdAt: n.createdAt,
            relatedEntityId: n.relatedEntityId,
            relatedTitle: taskMap[n.relatedEntityId] || null
        }));
        console.log('Lấy danh sách thông báo:', result);
        res.json(result);
    } catch (err) {
        console.error('Lỗi khi lấy danh sách thông báo:', err);
        res.status(500).json({ error: 'Không thể lấy danh sách thông báo' });
    }
};


// Đánh dấu thông báo đã đọc
const markReadNotification = async (req, res) => {
    try {
        const { notificationId } = req.body;
        console.log('Marking notification as read:', notificationId);
        if (!notificationId) return res.status(400).json({ error: 'Thiếu notificationId' });

        const notif = await Notification.findOne({ notificationId, userId: req.user.userId });
        if (!notif) return res.status(404).json({ error: 'Không tìm thấy thông báo này' });

        notif.isRead = true;
        await notif.save();

        res.json({ success: true });
    } catch (err) {
        console.error('Error marking notification read:', err);
        res.status(500).json({ error: 'Lỗi khi cập nhật trạng thái' });
    }
};

module.exports = {
    getUserNotifications,
    markReadNotification
};