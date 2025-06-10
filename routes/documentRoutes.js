// routes/documentRoutes.js

const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');

router.get('/get', documentController.getAllDocuments);

module.exports = router;
