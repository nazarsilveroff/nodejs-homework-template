const Joi = require("joi");

const emailSchema = Joi.string().email().required();
const passwordSchema = Joi.string().min(8).required();
const subscription = Joi.string().valid("starter", "pro", "business")

exports.signUpSchema = Joi.object({
    "username": Joi.string().required(),
    "email": emailSchema,
    "password": passwordSchema,
    subscription: subscription
});

exports.signInSchema = Joi.object({
    "email": emailSchema,
    "password": passwordSchema,
});

exports.replayMail = Joi.object({
    "email": emailSchema,
});