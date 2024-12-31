const express = require('express');
const router = express.Router();
const protectedController = require('../controllers/protectedController');
const verifyJWT = require('../middleware/verifyJWT');
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middleware/VerifyRoles');

router.route('/').get(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), protectedController.protectedController);

module.exports = router;