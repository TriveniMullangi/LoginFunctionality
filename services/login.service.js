var logger = require('../util/logger');
var HTTP_CODES = require('../util/statusCodes');
var userLoginModel = require('../model/login.model');
var moment = require("moment");
const sequelize = require('sequelize');
const Op = sequelize.Op
//const jwt = require('jsonwebtoken');

var userLogin = async (req, res, next) => {
    console.log("URL hit to :", req.hostname, req.originalUrl);
    logger.info("Entered into user login validation service");

    try {

        var data = await userLoginModel.Login.findAll(
            {
                where: {
                    email: req.body.email
                }
            }
            );
            //res.send(data);
            //console.log(userLoginModel.email)
    if(data.length!=0){
        if(data[0].isDeleted != 1){

            if(data[0].status === 'Active'){
            
                if (data[0].password === req.body.password && data[0].loginAttempts < 5) {
                    var loginAttemptsUpdate = await userLoginModel.Login.update({ 
                        
                        "loginAttempts" : 0,
                        "modifiedOn" :new Date(),
                        "modifiedBy" : data[0].userName
                        }, 
                        {
                             where:{ 
                                  email : req.body.email
                                    }
                                })
                    
                    var afterData = await userLoginModel.Login.findAll(
                        {
                            where: {
                                        email: req.body.email
                                    }
                        });
                        res.status(HTTP_CODES.OK).send({
                            "statusCode": HTTP_CODES.OK,
                            "info": "logged in successfully",
                            "data" : afterData
                        })
                }
            else if (data[0].loginAttempts == 5) {
                console.log("hello")
                var updateStatus =  userLoginModel.Login.update({ 
                    "status" : 'Blocked',
                    "loginAttempts" : 0,
                    "modifiedOn" :new Date(),
                    "modifiedBy" : data[0].userName
                    }, 
                    {
                         where:{ 
                              email : req.body.email
                                }
                }).then(()=>{
                    res.status(HTTP_CODES.BAD_REQUEST).send({
                        "statusCode": HTTP_CODES.BAD_REQUEST,
                        "info": "your account is blocked please try agin after a while",
                        //"updateStatus" : data
                    })
                })
                .catch(err=>{
                    res.send(err);
                })
            }
            else{
                //console.log("hii")
                var updateLoginAttempts = userLoginModel.Login.update(
                    { "loginAttempts" : data[0].loginAttempts+1,},
                    { where :{ email : req.body.email}}
                )

                    res.status(HTTP_CODES.NOT_FOUND).send({
                        "statusCode": HTTP_CODES.NOT_FOUND,
                        "info": "invalid credentials",
                        //"updateLoginAttempts" : updateLoginAttempts
                    })
            }
        }
        else{
            if(data[0].status === "Blocked" )
            {
                var data = await userLoginModel.Login.findAll(
                    {
                        where: {
                            email: req.body.email
                        }
                    });
                   
                    // var endDate = new Date();
                     //console.log(startDate < endDate)
                if (data[0].password === req.body.password){
                    var startDate = data[0].modifiedOn;
                    var DateDiff =moment().subtract(1, 'hours').toDate();
                    if( startDate < DateDiff){
                        var updateLog = await userLoginModel.Login.update(
                        {
                            "status" : 'Active',
                            "modifiedOn" :new Date(),
                        },
                        {
                            where : {
                               
                                    email: req.body.email,
                                    modifiedOn : {
                                        [Op.lte]: DateDiff
                                        }      
                                    }               
                        })
                        var afterData = await userLoginModel.Login.findAll(
                            {
                                where: {
                                            email: req.body.email
                                        }
                            });
                            res.status(HTTP_CODES.OK).send({
                            "statusCode": HTTP_CODES.OK,
                            "info": "logged in successfully",
                            "data":afterData
                            })
                    }  
                    else{
                        res.status(HTTP_CODES.BAD_REQUEST).send({
                        "statusCode": HTTP_CODES.BAD_REQUEST,
                        "info": "sorry, your account is still in blocked state.please try again later."
                        })
                    }
                }
                else{
                        res.status(HTTP_CODES.BAD_REQUEST).send({
                        "statusCode": HTTP_CODES.BAD_REQUEST,
                        "info": "invalid password"
                        })
                }
            }
        }
    }
    else{
        res.status(HTTP_CODES.BAD_REQUEST).send({
            "statusCode": HTTP_CODES.OK,
            "info": "user dosen't exists"
            })
    }
}
else{
    res.status(HTTP_CODES.BAD_REQUEST).send({
        "statusCode": HTTP_CODES.BAD_REQUEST,
        "info": "enter valid email",
               
    })
}
}
    catch (e) {

        next(e)
    }
}

module.exports = {
    userLogin: userLogin
}