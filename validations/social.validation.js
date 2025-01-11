const Joi = require("joi");

exports.socialValidation = (data) => {
  const socialSchema = Joi.object({
    id: Joi.number().optional(),
    name: Joi.string().max(100).required(),
    url: Joi.string()
      .pattern(/^https?:\/\/.+\..+/)
      .required(),
    icon: Joi.string().required(),
  });

  return socialSchema.validate(data, { abortEarly: false });
};
