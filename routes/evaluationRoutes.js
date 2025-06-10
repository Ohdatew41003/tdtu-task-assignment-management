const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');
const { authenticate, hasPermission } = require('../middleware/auth');

router.get('/get', evaluationController.getAllEvaluations);
router.post('/create', evaluationController.createEvaluation);
router.get('/lecturerEvaluation', authenticate, (req, res) => {
    res.render('lecturerEvaluation/lecturerEvaluation', { user: req.user });
});

router.get('/stats/:userId', evaluationController.getUserTaskStats);

module.exports = router; // PHẢI export đúng như thế này
