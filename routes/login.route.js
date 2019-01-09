const express = require('express');
const router = express.Router();
const expressJoi = require('express-joi-validator');
const loginSchema = require('../schema/login.schema');
const questionSchema = require('../schema/questions.schema')
const verifyToken = require('../middleware/verifyToken');
const adduserService = require('../services/addUser.service');
const loginService = require('../services/login.service');
const forgotPasswordService = require('../services/forgotPassword.service');
const changepasswordService = require('../services/changePassword.service');
const deletePasswordService = require('../services/deleteUser.service');
const QuestionsService = require('../services/Questions.service')


router.get('/tokenGen',adduserService.tokenGen);
router.post('/addUser',expressJoi(loginSchema.userLoginSchema),adduserService.addUser);
router.get('/userLogin/:email/:password',loginService.userLogin);
router.post('/forgotPassword',forgotPasswordService.forgotPassword)
router.post('/changePassword',changepasswordService.changePassword)
router.post('/deleteUser',deletePasswordService.deleteUser)
router.post('/addQuestions',expressJoi(questionSchema.questionSchema), QuestionsService.addQuestions);
router.get('/getQuestions/:technology', QuestionsService.getAll);



module.exports = router;