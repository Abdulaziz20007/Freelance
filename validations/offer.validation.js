const Joi = require("joi");

exports.offerValidation = (data) => {
  const offerSchema = Joi.object({
    id: Joi.number().optional(),
    project_id: Joi.number().integer().required(),
    amount: Joi.number().precision(2).positive().required(),
    duration: Joi.date().greater("now").required(),
    status: Joi.string()
      .valid("pending", "accepted", "rejected")
      .default("pending"),
  });

  return offerSchema.validate(data, { abortEarly: false });
};
