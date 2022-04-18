const {Router} = require("express");
const {authorize} = require("../helper/middlewares/authorize.middleware");
const {catchErrors} = require("../helper/middlewares/catchErrors");
const {usersService} = require("./users.service");
const {serializeUserResponse} = require("./users.serializes");
const {validate} = require("../helper/middlewares/validate");
const {updateSubscription} = require("./users.schema");


const usersRouter = Router();

usersRouter.get("/current", authorize(), catchErrors(async (req, res) => {
        const user = await usersService.getCurrentUser(req.userId);
        res.status(200).send(serializeUserResponse(user));
    })
);

usersRouter.patch("/updateSubscription", authorize(), validate(updateSubscription), catchErrors(async (req, res) => {
        const user = await usersService.updateUser(req.userId, req.body);
        res.status(200).send(serializeUserResponse(user));
    })
);

exports.usersRouter = usersRouter;