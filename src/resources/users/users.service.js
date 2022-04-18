const {UserModel} = require("./users.model");
const {NotFound} = require('http-errors')


class UsersService {
    async findUser(userId){
        return UserModel.findById(userId)
    };

    async getCurrentUser(userId){
        const user = await this.findUser(userId);
        if(!user) throw new NotFound(`User not found`);

        return user
    };

    async updateUser(id, updateParams) {
        const user = await UserModel.findByIdAndUpdate(id, updateParams, {
            new: true,
        });
        if (!user) {
            throw new NotFound("user not found");
        }

        return user;
    }
}
exports.usersService = new UsersService()