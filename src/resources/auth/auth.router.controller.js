const {Router} = require('express')
const {catchErrors} = require("../helper/middlewares/catchErrors");
const {validate} = require("../helper/middlewares/validate");
const {signUpSchema, signInSchema} = require("./auth.schema");
const {authService} = require("./auth.service");
const {serializeUserResponse} = require("../users/users.serializes");
const {serializeSignInResponse} = require("./auth.serializers");

const authRouter = Router()

authRouter.post('/sign-up', validate(signUpSchema), catchErrors(async (req, res, next) => {
        const user = await authService.signUp(req.body);
        res.status(201).send(serializeUserResponse(user))
    })
)

authRouter.post('/sign-in', validate(signInSchema), catchErrors(async (req, res, next) => {
        const {existingUser,token} = await authService.signIn(req.body);
        res.status(201).send(serializeSignInResponse(existingUser,token))
    })
)

exports.authRouter = authRouter