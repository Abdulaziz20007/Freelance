const Joi = require("joi");

exports.paymentValidation = (data) => {
  const paymentSchema = Joi.object({
    id: Joi.number().optional(),
    contract_id: Joi.number().integer().required(),
    amount: Joi.number().precision(2).positive().required(),
    payment_method: Joi.string().max(50).required(),
    status: Joi.string()
      .valid("pending", "completed", "failed")
      .default("pending"),
  });

  return paymentSchema.validate(data, { abortEarly: false });
};
