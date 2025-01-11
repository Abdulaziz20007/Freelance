const Joi = require("joi");

exports.categoryValidation = (data) => {
  const categorySchema = Joi.object({
    id: Joi.number().optional(),
    name: Joi.string().max(100).required(),
    parent_category_id: Joi.number().integer(),
  });

  return categorySchema.validate(data, { abortEarly: false });
};
