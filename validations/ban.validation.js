const Joi = require("joi");

exports.banValidation = (data) => {
  const banSchema = Joi.object({
    id: Joi.number().optional(),
    admin_id: Joi.number().integer().required(),
    user_id: Joi.number().integer().required(),
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/),
    reason: Joi.string().required(),
    until: Joi.date().greater("now"),
  });

  return banSchema.validate(data, { abortEarly: false });
};
