const express = require('express');
const router = express.Router();

const taskCategoryMappingController = require('../controllers/taskCategoryMappingController');

// Route tạo mới mapping
router.post('/create', taskCategoryMappingController.createTaskCategoryMapping);
// Lấy toàn bộ mapping
router.get('/get', taskCategoryMappingController.getAllTaskCategoryMappings);
module.exports = router;
