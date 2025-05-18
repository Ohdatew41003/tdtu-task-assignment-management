const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");



// GET /task
router.get('/task', (req, res) => {
    res.render('task/task', {
        title: 'Quản lý đầu việc'
    });
});

module.exports = router;

router.get("/get", taskController.getTasks);
router.post("/create", taskController.createTask);
router.put("/update/:id", taskController.updateTask);
router.delete("/delete/:id", taskController.deleteTask);

module.exports = router;
