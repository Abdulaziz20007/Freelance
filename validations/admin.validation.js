const Joi = require("joi");

exports.adminValidation = (data) => {
  const adminSchema = Joi.object({
    id: Joi.number().optional(),
    name: Joi.string().min(2).max(50).required(),
    surname: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string()
      .pattern(/^\+?[1-9]\d{1,14}$/)
      .required(),
    password: Joi.string().min(8).required(),
  });

  return adminSchema.validate(data, { abortEarly: false });
};
