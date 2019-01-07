const nodeMailer = require('nodemailer');
var generator = require('random-password');
var logger = require('../util/logger');
var HTTP_CODES = require('../util/statusCodes');
var userLoginModel = require('../model/login.model');
const jwt = require('jsonwebtoken');

var tokenGen = async (req, res, next) => {
    console.log("URL hit to :", req.hostname, req.originalUrl);
    logger.info("Entered into token generation service");
    try {
        var token = await jwt.sign({
            data: 'users'
        }, "SECRET_KEY", { expiresIn: '300s' });
        res.status(HTTP_CODES.OK).send({
            "statusCode": HTTP_CODES.OK,
            "info": "token generated successfully",
            "token": token
        })
    }
    catch (e) {
        next(e);
    }

}

var addUser = async (req, res, next) => {
    console.log("URL hit to :", req.hostname, req.originalUrl);
    logger.info("Entered into adding new user service");

    try {
        let password = generator(10);
        //

        let payLoad = req.body;
        if (payLoad != undefined) {
            let userData = await userLoginModel.Login.create({
                email: req.body.email,
                userName: payLoad.userName,
                password: password,
                city: payLoad.city,
                state: payLoad.state,
                country: payLoad.country,
                phoneNo: payLoad.phoneNo,
                qualification: payLoad.qualification,
                createdOn: new Date(),
                createdBy: payLoad.email,
                modifiedOn: new Date(),
                modifiedBy: req.body.email
            }).then(user => {
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
                    subject: ' Password generated',
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

                    res.send({ "Info": "Password Changed,Check Your registered Email" });
                });
            }).catch(err => {
                console.log(err)
            })

            res.status(HTTP_CODES.OK).send({
                "statusCode": HTTP_CODES.OK,
                "info": "user Data saved in database",
                "User": userData
            })
        }
    }
    catch (e) {
        next(e);
    }
}

module.exports = {
    tokenGen: tokenGen,
    addUser: addUser
}