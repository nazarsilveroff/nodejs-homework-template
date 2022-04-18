const {UserModel} = require("../users/users.model");
const {Conflict, NotFound, Forbidden} = require('http-errors')
const {getConfig} = require("../../config");
const bcryptjs = require('bcryptjs')
const jsonwebtoken = require("jsonwebtoken");
const gravatar = require("gravatar");


class AuthService {

    async hashPassword(password) {
        const {bcryptCostFactor} = getConfig();
        return bcryptjs.hash(password, bcryptCostFactor)
    }

    async findUser(email) {
        return UserModel.findOne({email});
    }

    async createUser(username, email, passwordHash, subscription, avatarURL) {
        return UserModel.create({username, email, passwordHash, subscription, avatarURL})
    }

    async checkPassword(password, passwordHash) {
        return bcryptjs.compare(password, passwordHash)
    }

    createToken(user) {
        const {jwt: {secret}} = getConfig()
        const {id, subscription} = user
        return jsonwebtoken.sign({
            "uid": id,
            "subscription": subscription
        }, secret)
    }

    async signUp(userParams) {
        const {username, email, password, subscription} = userParams;
        const existingUser = await this.findUser(email);
        if (existingUser) throw new Conflict(`User with ${email} already exist`);

        const passwordHash = await this.hashPassword(password);
        const avatarURL = gravatar.url(email);
        const user = await this.createUser(username, email, passwordHash, subscription, avatarURL);

        return user
    };

    async signIn(logParams) {
        const {email, password} = logParams;
        const existingUser = await this.findUser(email);
        if (!existingUser) throw new NotFound(`User with ${email} not found`);

        const {passwordHash} = existingUser
        const isPasswordCorrect = await this.checkPassword(password, passwordHash)
        if (!isPasswordCorrect) throw new Forbidden(`Password is wrong`);

        const token = this.createToken(existingUser)

        return {existingUser, token}
    };
}

exports.authService = new AuthService()