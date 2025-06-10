const express = require('express');
const router = express.Router();
const multer = require('multer');
const taskProgressController = require('../controllers/taskProgressController');
const fs = require('fs');
const path = require('path');

// Cấu hình Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const progressId = req.params.progressId;
        const dir = progressId ? `uploads/${progressId}` : 'uploads/temp';

        // Tạo folder nếu chưa có
        const fullPath = path.join(__dirname, '..', dir);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }

        cb(null, fullPath);
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop();
        cb(null, `${Date.now()}.${ext}`);
    }
});
const upload = multer({ storage });

// Routes
router.post('/create', taskProgressController.createTaskProgress);
router.get('/get', taskProgressController.getAllTaskProgress);
router.put('/update/:progressId', upload.single('attachment'), taskProgressController.updateProgress);
router.delete('/delete/:progressId', taskProgressController.deleteProgress);
// Example với Express
router.get('/:progressId/download', taskProgressController.downloadAttachment);

module.exports = router;
