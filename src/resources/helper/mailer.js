const {getConfig} = require("../../config");

const sgMail = require('@sendgrid/mail')


class MailerClient {
    async sendVerificationEmail(to, verificationUrl) {
        return await this.sendMail(to, verificationUrl);
    }


    async sendMail(to, verificationUrl) {
        sgMail.setApiKey(getConfig().SENDGRID_API_KEY);
        return await sgMail.send({
            to,
            from: getConfig().mailer.user,
            templateId: getConfig().SENDGRID_TEMPLATE_ID,
            dynamicTemplateData: {
                verificationUrl: verificationUrl,
            },
        });
    }
}

exports.MailerClient = new MailerClient()