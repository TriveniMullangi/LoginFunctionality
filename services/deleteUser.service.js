var logger = require('../util/logger');
var HTTP_CODES = require('../util/statusCodes');
var userLoginModel = require('../model/login.model');

var deleteUser =async (req, res, next) => {

    console.log("URL hit to :", req.hostname, req.originalUrl);
    logger.info("Entered into delete user service");

    try{
        var user = await userLoginModel.Login.findAll(
            {
                where: {
                    email: req.query.email
                }
            })
            //res.send(user);
        if(user.length!=0){
            if(user[0].isDeleted == 1){
                res.status(HTTP_CODES.OK).send({
                    "statusCode": HTTP_CODES.OK,
                    "info": "user doesn't exists",
                })
            }
            else{
                var update= await userLoginModel.Login.update(
                    {
                        "isDeleted" : 1
                    },
                    {
                        where: {
                            email: req.query.email
                        }
                    })
                    var afterDelete = await userLoginModel.Login.findAll(
                        {
                            where: {
                                        email: req.query.email
                                    }
                        }); 
                        res.status(HTTP_CODES.OK).send({
                            "statusCode": HTTP_CODES.OK,
                            "info": "user deleted successfully",
                            "data":afterDelete
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
    catch(err){
        next(err)
    }

}

module.exports = {
    deleteUser : deleteUser
}