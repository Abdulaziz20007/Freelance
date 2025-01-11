const Joi = require("joi");

exports.userValidation = (data) => {
  const userSchema = Joi.object({
    id: Joi.number().optional(),
    name: Joi.string().min(2).max(50).required(),
    surname: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/),
    password: Joi.string().min(8).required(),
    bio: Joi.string().max(255),
    is_active: Joi.boolean().default(false),
  });

  return userSchema.validate(data, { abortEarly: false });
};
