const Joi = require('joi');
//transactions  schema
var transactionSchema = {
    body: {
        userName:Joi.string().required(),
        email:Joi.string().email({ minDomainAtoms: 2 }).required(),
        technology: Joi.string().required(),
        technologyCode: Joi.string().required(),
        totalQuestions: Joi.number().required(),
        marksSecured:Joi.number().required(),
        status:Joi.string().required().valid('Qualified', 'DisQualified')
    }
};

module.exports = {
    transactionSchema: transactionSchema
}