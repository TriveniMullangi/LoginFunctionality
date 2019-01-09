var logger = require('../util/logger');
var generator = require('random-password');
const nodeMailer = require('nodemailer');
var HTTP_CODES = require('../util/statusCodes');
var userLoginModel = require('../model/login.model');
var moment = require("moment");
// const sequelize = require('sequelize');
// const Op = sequelize.Op;

var forgotPassword =async (req, res, next) => {
    console.log("URL hit to :", req.hostname, req.originalUrl);
    logger.info("Entered into forgot password service");

    try {

        let password = generator(10);
        let payLoad = req.body;
        var data = await userLoginModel.Login.findAll(
            {
                where: {
                    email: payLoad.email
                }
            });
        if(data.length!=0){
            if(data[0].isDeleted !=1){
                if(data[0].status === 'Active'){
              
                    var updatePassword = await userLoginModel.Login.update(
                {
                    "password" : password,
                    "modifiedOn" :new Date(),
                },
                {
                     where : {
                           
                        email: payLoad.email
                          
                        }               
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
                        subject: ' Password changed',
                        from: '"THD Project" <thd.project2.0@gmail.com>',
                        html: '<h1>Your New Password is :</h1>' + '<b>' + password + '</b>'
                    };
                        
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            logger.error(error);
                        }
                        else {
                                console.log(info);
                        }
                    });
                    var afterData = await userLoginModel.Login.findAll(
                        {
                            where: {
                                        email: req.body.email
                                    }
                        });   
                        //console.log(afterData)
                    res.status(HTTP_CODES.OK).send({
                        "statusCode": HTTP_CODES.OK,
                        "info": "Password Changed,Check Your registered Email",
                        "data":    afterData
                    })
            }   
            else{
                
                 if(data[0].status === "Blocked" ){
                   // console.log("hiii")
                    var startDate = data[0].modifiedOn;
                    var DateDiff =moment().subtract(1, 'hours').toDate();
                    if( startDate < DateDiff){
                        //console.log("hello")
                        var updatePassword = await userLoginModel.Login.update(
                            {
                                "status" : "Active",
                                "password" : password,
                                "modifiedOn" :new Date(),
                            },
                            {
                                 where : {
                                       
                                    email: payLoad.email
                                      
                                    }               
                            })
                            //sending email
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
                                    subject: ' Password changed',
                                    from: '"THD Project" <thd.project2.0@gmail.com>',
                                    html: '<h1>Your New Password is :</h1>' + '<b>' + password + '</b>'
                                };
                                    
                                transporter.sendMail(mailOptions, (error, info) => {
                                    if (error) {
                                        logger.error(error);
                                    }
                                    else {
                                            console.log(info);
                                    }
                                });
                                var afterData = await userLoginModel.Login.findAll(
                                    {
                                        where: {
                                                    email: req.body.email
                                                }
                                    });  
                                res.status(HTTP_CODES.OK).send({
                                    "statusCode": HTTP_CODES.OK,
                                    "info": "Password Changed,Check Your registered Email",
                                    "data":   afterData 
                                })
                    }
                    else{
                        res.status(HTTP_CODES.BAD_REQUEST).send({
                            "statusCode": HTTP_CODES.BAD_REQUEST,
                            "info": "you are in blocked state, you can't perform any opration",
                                   
                            })
                        }
                    }
                }
            }
            else{
                res.status(HTTP_CODES.BAD_REQUEST).send({
                    "statusCode": HTTP_CODES.BAD_REQUEST,
                    "info": "User doesn't exist",
                           
                })
            }
        }
        else{
            console.log("hello")
            res.status(HTTP_CODES.BAD_REQUEST).send({
                "statusCode": HTTP_CODES.BAD_REQUEST,
                "info": "enter valid email",
                       
            })
        }
    }
    catch (e) {
        next(e);
    }
}



module.exports = {
    forgotPassword : forgotPassword
}
