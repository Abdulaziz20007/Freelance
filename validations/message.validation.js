const Joi = require("joi");

exports.messageValidation = (data) => {
  const messageSchema = Joi.object({
    id: Joi.number().optional(),
    sender_id: Joi.number().integer().required(),
    project_id: Joi.number().integer().required(),
    reply_to: Joi.number().integer(),
    content: Joi.string().max(1000).required(),
    is_read: Joi.boolean().default(false),
  });

  return messageSchema.validate(data, { abortEarly: false });
};
