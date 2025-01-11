const Joi = require("joi");

exports.projectValidation = (data) => {
  const projectSchema = Joi.object({
    id: Joi.number().optional(),
    client_id: Joi.number().integer().required(),
    category_id: Joi.number().integer().required(),
    title: Joi.string().min(5).max(255).required(),
    description: Joi.string().min(20).required(),
    budget: Joi.number().precision(2).positive().required(),
    deadline: Joi.date().greater("now").required(),
    status: Joi.string()
      .valid("open", "in_progress", "completed", "cancelled")
      .default("open"),
  });

  return projectSchema.validate(data, { abortEarly: false });
};
