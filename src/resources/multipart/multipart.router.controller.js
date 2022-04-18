const {Router} = require("express");
const {upload, resizeAvatar} = require("../helper/middlewares/multipart.middleware");
const {catchErrors} = require("../helper/middlewares/catchErrors");
const {usersService} = require("../users/users.service");
const {serializeUser} = require("../users/users.serializes");
const {authorize} = require("../helper/middlewares/authorize.middleware");


const multipartRouter = Router()

multipartRouter.post("/upload", upload.single("file"), catchErrors((req, res, next) => {
    res.status(200).send();
}));

multipartRouter.patch("/users/avatars", authorize(), upload.single("file"), resizeAvatar(), catchErrors(async (req, res, next) => {
    const user = await usersService.updateUser(req.userId, req.body);
    res.status(200).send(serializeUser(user))
}));


exports.multipartRouter = multipartRouter