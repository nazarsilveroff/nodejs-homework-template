const {Router} = require('express')
const {catchErrors} = require("../helper/middlewares/catchErrors");
const {validate} = require("../helper/middlewares/validate");
const {signUpSchema, signInSchema, replayMail} = require("./auth.schema");
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
        const {existingUser, token} = await authService.signIn(req.body);
        res.status(201).send(serializeSignInResponse(existingUser, token))
    })
)

authRouter.get("/verify/:token", catchErrors(async (req, res) => {
        await authService.verifyUser(req.params.token);
        res.status(200).send("User successfully verified email");
    })
);

authRouter.post("/users/verify", validate(replayMail), catchErrors(async (req, res) => {
        await authService.replayMailToUser(req.body);
        res.status(200).send("Verification successful");
    })
);


exports.authRouter = authRouter