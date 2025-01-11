const Joi = require("joi");

exports.contractValidation = (data) => {
  const contractSchema = Joi.object({
    id: Joi.number().optional(),
    project_id: Joi.number().integer().required(),
    freelancer_id: Joi.number().integer().required(),
    amount: Joi.number().precision(2).positive().required(),
    start_date: Joi.date().required(),
    end_date: Joi.date().greater(Joi.ref("start_date")).required(),
    status: Joi.string().valid("active", "completed").default("active"),
    review: Joi.number().integer().min(1).max(5),
  });

  return contractSchema.validate(data, { abortEarly: false });
};
