const Joi = require("joi");

exports.freelancerSocialValidation = (data) => {
  const freelancerSocialSchema = Joi.object({
    id: Joi.number().optional(),
    freelancer_id: Joi.number().integer().required(),
    social_id: Joi.number().integer().required(),
  });

  return freelancerSocialSchema.validate(data, { abortEarly: false });
};
