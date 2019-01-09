const Joi = require('joi');
//certification schema
var questionSchema = {
    body: {

        technology: Joi.string().required(),
        technologyCode: Joi.string().required(),
        questions: Joi.any().required(),
    
    }
};

module.exports = {
    questionSchema: questionSchema
}