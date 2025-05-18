const express = require('express');
const router = express.Router();

const {
    createTaskCategory,
    getAllTaskCategories,
    getTaskCategoryById,
    updateTaskCategory,
    deleteTaskCategory
} = require('../controllers/taskCategoryController');

// Định nghĩa route
router.get('/get', getAllTaskCategories);
router.post('/create', createTaskCategory);
router.get('/:id', getTaskCategoryById);
router.put('/:id', updateTaskCategory);
router.delete('/:id', deleteTaskCategory);

module.exports = router;  // dùng CommonJS export
