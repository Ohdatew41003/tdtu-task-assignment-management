const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');

router.get('/get', evaluationController.getAllEvaluations);
router.post('/create', evaluationController.createEvaluation);
// thêm các route khác nếu có...

module.exports = router; // PHẢI export đúng như thế này
