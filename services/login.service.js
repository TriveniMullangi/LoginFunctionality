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
                    email: req.query.email
                }
            }
            );

        if(data[0].status === 'Active'){
            
            if (data[0].password === req.query.password && data[0].loginAttempts < 5) {
                console.log("hi")
                res.status(HTTP_CODES.OK).send({
                    "statusCode": HTTP_CODES.OK,
                    "info": "logged in successfully"
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
                              email : req.query.email
                                }
                }).then(()=>{
                    res.status(HTTP_CODES.OK).send({
                        "statusCode": HTTP_CODES.OK,
                        "info": "your account is blocked please try agin after a while",
                        "updateStatus" : updateStatus
                    })
                })
                .catch(err=>{
                    res.send(err);
                })
            }
            else{
                console.log("hii")
                var updateLoginAttempts = userLoginModel.Login.update(
                    { "loginAttempts" : data[0].loginAttempts+1,},
                    { where :{ email : req.query.email}}
                )

                .then(()=>{
                    res.status(HTTP_CODES.OK).send({
                        "statusCode": HTTP_CODES.OK,
                        "info": "invalid credentials",
                        "updateLoginAttempts" : updateLoginAttempts
                    })
                }).catch(err=>{
                    next(err)
                })
              
            }
        }
        else{
            if(data[0].status === "Blocked" )
            {
                var data = await userLoginModel.Login.findAll(
                    {
                        where: {
                            email: req.query.email
                        }
                    }
                    );
                   
                    // var endDate = new Date();
                     //console.log(startDate < endDate)
                if (data[0].password === req.query.password){
                    var startDate = data[0].modifiedOn;
                    var DateDiff =moment().subtract(1, 'hours').toDate();
                    if( startDate < DateDiff){
                        var update = await userLoginModel.Login.update(
                        {
                            "status" : 'Active'
                        },
                        {
                            where : {
                               
                                    email: req.query.email,
                                    modifiedOn : {
                                        [Op.lte]: DateDiff
                                        }      
                                    }               
                        })
                        .then(()=>{
                            res.status(HTTP_CODES.OK).send({
                            "statusCode": HTTP_CODES.OK,
                            "info": "logged in successfully"
                            })
                        })
                        .catch(err=>{
                             next(err);
                         })
                    }  
                    else{
                        res.status(HTTP_CODES.OK).send({
                        "statusCode": HTTP_CODES.OK,
                        "info": "sorry, your account is still in blocked state.please try again later."
                        })
                    }
                }
                else{
                        res.status(HTTP_CODES.OK).send({
                        "statusCode": HTTP_CODES.OK,
                        "info": "invalid password"
                        })
                }
            }
        }

    }
    catch (e) {

        next(e)
    }
}

module.exports = {
    userLogin: userLogin
}