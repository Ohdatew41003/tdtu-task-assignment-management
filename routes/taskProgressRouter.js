const express = require('express');
const router = express.Router();
const multer = require('multer');
const taskProgressController = require('../controllers/taskProgressController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop();
        cb(null, `${req.params.progressId || 'new'}-${Date.now()}.${ext}`);
    }
});
const upload = multer({ storage });

// Tạo tiến độ mới
router.post('/create', taskProgressController.createTaskProgress);

// Lấy danh sách tiến độ
router.get('/get', taskProgressController.getAllTaskProgress);

// Cập nhật tiến độ (upload file key là 'attachment')
router.put('/update/:progressId', upload.single('attachment'), taskProgressController.updateProgress);

// Xóa tiến độ
router.delete('/delete/:progressId', taskProgressController.deleteProgress);

module.exports = router;
