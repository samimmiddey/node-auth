const express = require('express');
const router = express.Router();
const regiserController = require('../controllers/registerController');

router.post('/', regiserController.registerNewUser);

module.exports = router;