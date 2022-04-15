const {Unauthorized, Forbidden} = require("http-errors");
const jsonwebtoken = require("jsonwebtoken");
const {getConfig} = require("../../../config");

// const checkPermissions = (tokenPermissions, requiredPermissions) => {
//     let hasPermission = false;
//     if (!requiredPermissions.length) {
//         return true;
//     }
//
//     requiredPermissions.forEach((permission) => {
//         if (tokenPermissions.includes(permission)) {
//             hasPermission = true;
//         }
//     });
//
//     return hasPermission;
// }

exports.authorize = (...permissions) => {
    return (req, res, next) => {
        const authHeader = req.headers["authorization"] || "";
        const token = authHeader.replace("Bearer ", "");

        let payload;
        const {jwt: {secret}} = getConfig();
        try {
            payload = jsonwebtoken.verify(token, secret)

        } catch (error) {
            throw new Unauthorized();
        }

        // const hasPermission = checkPermissions(payload.subscription, permissions);
        // if (!hasPermission) throw new Forbidden();

        req.userId = payload.uid;
        next();
    }
}

