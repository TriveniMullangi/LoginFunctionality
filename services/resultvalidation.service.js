var logger = require('../util/logger');
var HTTP_CODES = require('../util/statusCodes');
var questionsModel = require('../model/questions.model');
const nodeMailer = require('nodemailer');
var transactionsModel = require('../model/transactions.model')

var addTransaction = async (req, res, next) => {
    console.log("URL hit to :", req.hostname, req.originalUrl);
    logger.info("Entered into transaction adding service");

    try{
        var payLoad = req.body;
        var transaction={},marks=0,percentage=0,status=""
        //res.send(payLoad)
        var data = await questionsModel.Questions.findAll(
            {
                where: {
                    technologyCode: payLoad.technologyCode
                }
            });
        if(data.length !=0){
            data[0].questions= JSON.parse(data[0].questions);
            for(var noOfQes=0; noOfQes < payLoad.questions.length ; noOfQes++){
                for(var qno=0; qno<data[0].questions.length;qno++){
                    if(payLoad.questions[noOfQes].qid === data[0].questions[qno].qid){
                        if(payLoad.questions[noOfQes].answer === data[0].questions[qno].answer) {
                            marks=marks+1;
                        }
                    }
                }
            }
        
            percentage = Math.floor((marks/payLoad.questions.length)*100)
            //console.log(percentage)
            if(percentage<75){
                    status="Disqualified"
            }
            else{
                status="Qualified"
            }
            // transaction.userName = payLoad.userName;
            // transaction.email = payLoad.email;
            // transaction.technology = payLoad.technology;
            // transaction.technologyCode = payLoad.technologyCode;
            // transaction.totalQuestions = payLoad.questions.length;
            // transaction.marksSecured = marks;
            // transaction.status = status;
            //res.send(transaction)
            let userData = await transactionsModel.Transactions.create({
                userName : payLoad.userName,
                email : payLoad.email,
                technology : payLoad.technology,
                technologyCode : payLoad.technologyCode,
                totalQuestions : payLoad.questions.length,
                marksSecured : marks,
                status : status
            })
            var transporter = nodeMailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                        user: 'thd.project2.0@gmail.com',
                        pass: 'thdproject@2.0'
                    },
                tls: {
                        rejectUnauthorized: false
                    }
            });
                
                
            var mailOptions = {
                
                to: payLoad.email,
                subject: 'certification result ',
                from: '"THD Project" <thd.project2.0@gmail.com>',
                html: '<h1> Your marks for  <u>' + payLoad.technology + '</u>  are : '  + marks + '</h1><b> <p> your status is: '+ status+ ' </p></b>'
            };
                
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    logger.error(error);
                }
                else {
                        console.log(info);
                }
            });
            res.status(HTTP_CODES.OK).send({
                "statusCode": HTTP_CODES.OK,
                "info": "transaction added successfully",
                "data" : userData
            })
        }
        else{
            res.status(HTTP_CODES.BAD_REQUEST).send({
                "statusCode": HTTP_CODES.BAD_REQUEST,
                "info": "error occured while submiting your response, please try agian",
                //"err" : userData
            })
        }
    }
    catch(err){
        next(err);
    }

}

module.exports = {
    addTransaction :addTransaction
}