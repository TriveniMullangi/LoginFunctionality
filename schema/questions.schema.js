const Joi = require('joi');

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