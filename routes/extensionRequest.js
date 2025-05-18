const express = require('express');
const router = express.Router();


router.get('/extensionRequest', (req, res) => {
    res.render('extensionRequest/extensionRequest', {
        title: 'Gia hạn'
    });
});

module.exports = router; // PHẢI export đúng như thế này
