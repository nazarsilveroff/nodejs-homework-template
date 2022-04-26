const {UserModel} = require("../users/users.model");
const {Conflict, NotFound, Forbidden, Gone, PreconditionFailed} = require('http-errors')
const {getConfig} = require("../../config");
const bcryptjs = require('bcryptjs')
const jsonwebtoken = require("jsonwebtoken");
const gravatar = require("gravatar");
const {MailerClient} = require("../helper/mailer");
const {generate} = require("shortid");
const {replayMail} = require("./auth.schema");


class AuthService {

    async hashPassword(password) {
        const {bcryptCostFactor} = getConfig();
        return bcryptjs.hash(password, bcryptCostFactor)
    }

    async findUser(email) {
        return UserModel.findOne({email});
    }

    async createUser(username, email, passwordHash, subscription, avatarURL, verificationToken) {
        return UserModel.create({username, email, passwordHash, subscription, avatarURL, verificationToken})
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

    async verifyUser(verificationToken) {
        const user = await UserModel.findOne({verificationToken});
        if (!user) {
            throw new Gone("Verification link is not valid or already used");
        }

        await UserModel.updateOne(
            {verificationToken},
            {verificationToken: null, verify: true}
        );
    }

    async sendVerificationEmail(user) {
        const verificationUrl = `${getConfig().SERVER_BASE_URL}/api/auth/verify/${
            user.verificationToken
        }`;

        return MailerClient.sendVerificationEmail(user.email, verificationUrl);
    }

    async signUp(userParams) {
        const {username, email, password, subscription} = userParams;
        const existingUser = await this.findUser(email);
        if (existingUser) throw new Conflict(`User with ${email} already exist`);

        const passwordHash = await this.hashPassword(password);
        const avatarURL = gravatar.url(email);

        const verificationToken = generate()

        const user = await this.createUser(username, email, passwordHash, subscription, avatarURL, verificationToken);

        await this.sendVerificationEmail(user);

        return user
    };

    async signIn(logParams) {
        const {email, password} = logParams;
        const existingUser = await this.findUser(email);
        if (!existingUser) throw new NotFound(`User with ${email} not found`);

        const {passwordHash} = existingUser
        const isPasswordCorrect = await this.checkPassword(password, passwordHash)
        if (!isPasswordCorrect) throw new Forbidden(`Password is wrong`);

        if (!existingUser.verify) {
            throw new PreconditionFailed("User is not verified");
        }

        const token = this.createToken(existingUser)

        return {existingUser, token}
    };

    async replayMailToUser(logParams) {
        const {email} = logParams
        const existingUser = await this.findUser(email);
        if (!existingUser) throw new NotFound(`User with ${email} not found`);

        if (existingUser.verify === true) throw new PreconditionFailed("Verification is already used done");

        await this.sendVerificationEmail(existingUser);
    }
}

exports.authService = new AuthService()