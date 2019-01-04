const Joi = require('joi');

var userLoginSchema = {
    body: {
        email:Joi.string().email({ minDomainAtoms: 2 }).required(),
        userName: Joi.string().required(),
        //password: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        country: Joi.string().required(),
        phoneNo: Joi.number().required(),
        qualification: Joi.string().required(),
        //notified: Joi.number().required(),
        //loginAttempts:Joi.number().required(),
        //status:Joi.string().required().valid('Active', 'Blocked'),
        //createdOn:Joi.date().timestamp().required(),
        //createdBy:Joi.string().required(),
        //modifiedOn:Joi.date().timestamp().required(),
        //modifiedBy:Joi.string().required(),
        //isDeleted:Joi.number().required()
    }
};

module.exports = {
    userLoginSchema: userLoginSchema
}