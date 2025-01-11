const Joi = require("joi");

exports.freelancerValidation = (data) => {
  const freelancerSchema = Joi.object({
    id: Joi.number().optional(),
    name: Joi.string().min(2).max(50).required(),
    surname: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().max(15),
    password: Joi.string().min(8).required(),
    bio: Joi.string().max(255),
    portfolio_url: Joi.string().pattern(/^https?:\/\/.+\..+/),
    availability: Joi.boolean().default(true),
    is_active: Joi.boolean().default(false),
  });

  return freelancerSchema.validate(data, { abortEarly: false });
};
