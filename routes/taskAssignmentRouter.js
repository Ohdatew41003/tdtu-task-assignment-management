const express = require('express');
const router = express.Router();
const taskAssignmentController = require('../controllers/taskAssignmentController');
// Controller giả định

router.get('/', (req, res) => {
    res.render('task/taskAssignment'); // file .hbs trong views/task/
});


router.get('/get', taskAssignmentController.getTaskAssignments);
router.post('/create', taskAssignmentController.createTaskAssignment);


module.exports = router;
