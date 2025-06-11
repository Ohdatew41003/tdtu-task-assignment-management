const express = require('express');
const router = express.Router();
const { authenticate, hasPermission } = require('../middleware/auth');

router.get('/extensionRequest', authenticate, (req, res) => {
    res.render('extensionRequest/extensionRequest', {
        title: 'Gia hạn',
        user: req.user
    });
});

module.exports = router; // PHẢI export đúng như thế này
