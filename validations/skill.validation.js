const Joi = require("joi");

exports.skillValidation = (data) => {
  const skillSchema = Joi.object({
    id: Joi.number().optional(),
    skill: Joi.string().max(100).required(),
  });

  return skillSchema.validate(data, { abortEarly: false });
};
