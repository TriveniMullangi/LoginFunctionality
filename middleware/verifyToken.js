const jwt = require('jsonwebtoken');
const logger = require('../util/logger');
const statusCode = require('../util/statusCodes');

module.exports = function verifyToken(req, res, next) {

    var token = req.headers['token'];
    if (!token) {
        logger.error("No Access Token Provided");

        res.status(401).send({
            "statusCode": statusCode.UNAUTHORIZED,
            "info": "Failed to Authenticate token."
        });
    }
    else {
        var current_time = new Date().getTime() / 1000;
        jwt.verify(token, "SECRET_KEY", function (err, decoded) {
            if (err) {
                res.send(err);
                logger.error("Failed to Authenticate token.");
                res.status(401).send({
                    "statusCode": statusCode.UNAUTHORIZED,
                    "info": "Failed to Authenticate token.",
                    "error": err.name + ' - ' + err.message
                });
            }else if (current_time > jwt.exp){
                logger.error("Failed to Authenticate token.");
                res.status(401).send({
                    "statusCode": statusCode.UNAUTHORIZED,
                    "info": "Failed to Authenticate token.",
                    "error": err.name + ' - ' + err.message
                });
            }
                        else {
                            //res.send("working");
                next();
            }
        });
    }
}
