const Joi = require('@hapi/joi');

// register validation
const studentValidation = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    level: Joi.string().required(),
  });

  return schema.validate(data);
};

module.exports.studentValidation = studentValidation;

