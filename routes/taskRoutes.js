// routes/taskRoutes.js
const express = require('express');
const multer = require('multer');
const taskController = require('../controllers/taskController');

// Cấu hình multer để xử lý file upload
const upload = multer({ dest: 'uploads/reports/' });

const router = express.Router();

// Các API công việc
router.put('/:id/status', taskController.updateStatus);
router.post('/:id/progress', taskController.addProgress);
router.post('/:id/report', upload.single('file'), taskController.uploadReport);
router.get('/:id/timeline', taskController.getTimeline);

module.exports = router;
