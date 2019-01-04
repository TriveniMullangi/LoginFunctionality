const express = require('express');
const router = express.Router();
const expressJoi = require('express-joi-validator');
const loginSchema = require('../schema/login.schema');
const verifyToken = require('../middleware/verifyToken');
const adduserService = require('../services/addUser.service');
const loginService = require('../services/login.service');

router.get('/tokenGen',adduserService.tokenGen);
router.post('/addUser',expressJoi(loginSchema.userLoginSchema),adduserService.addUser);
router.get('/userLogin',loginService.userLogin);

module.exports = router;