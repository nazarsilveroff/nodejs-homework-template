const Joi = require("joi");

const subscription = Joi.string().valid("starter", "pro", "business").required()

exports.updateSubscription = Joi.object({
    subscription: subscription
});
