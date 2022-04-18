const {serializeUser} = require("../users/users.serializes");


exports.serializeSignInResponse = (userData, token) => {
    const user = serializeUser(userData);
    return { user, token };
};