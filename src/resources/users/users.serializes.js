function serializeUserResponse(user) {
    return {"user": serializeUser(user)};
}

// function serializeUsersListResponse(users) {
//     return { "users": users.map(serializeUser) };
// }


function serializeUser(user) {
    return {
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL
    };
}

exports.serializeUserResponse = serializeUserResponse;
// exports.serializeUsersListResponse = serializeUsersListResponse;
exports.serializeUser = serializeUser;