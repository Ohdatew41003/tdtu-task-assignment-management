const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

const { authenticate, hasPermission } = require('../middleware/auth');
const autoRegisterFunction = require('../middleware/autoRegisterFunction');
// GET /task
router.get('/task', (req, res) => {
    res.render('task/task', {
        title: 'Quản lý đầu việc'
    });
});
router.get('/dashboard', (req, res) => {
    res.render('task/dashboard', {
        title: 'Quản lý việc'
    });
});
router.get('/evalution', authenticate, autoRegisterFunction('trangdanhgiacongviec'), (req, res) => {
    res.render('task/evalution', {
        title: 'Đánh giá đầu việc',
        user: req.user // giả sử req.user có userId
    });
});



router.get("/get", taskController.getTasks);
router.post("/create", taskController.createTask);
router.put("/update/:id", taskController.updateTask);
router.delete("/delete/:id", taskController.deleteTask);

module.exports = router; 
