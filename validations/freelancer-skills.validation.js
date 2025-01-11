const Joi = require("joi");

exports.freelancerSkillsValidation = (data) => {
  const freelancerSkillsSchema = Joi.object({
    id: Joi.number().optional(),
    freelancer_id: Joi.number().integer().required(),
    skill_id: Joi.number().integer().required(),
  });

  return freelancerSkillsSchema.validate(data, { abortEarly: false });
};
