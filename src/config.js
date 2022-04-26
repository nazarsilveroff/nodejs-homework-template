exports.getConfig=()=>{
    return{
        port: process.env.PORT||8080,
        allowedCorsOrigin:process.env.ALLOWED_CORS_ORIGIN,
        dbUrl:process.env.MONGODB_URI,
        bcryptCostFactor: parseInt(process.env.BCRYPT_COST_FACTOR) || 8,
        jwt: {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRES_IN || "1d",
        },
        mailer: {
            user: process.env.MAILER_UER,
            pass: process.env.NODEMAILER_PASSWORD,
        },
        SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ,
        SERVER_BASE_URL: process.env.SERVER_BASE_URL,
        SENDGRID_TEMPLATE_ID:process.env.SENDGRID_TEMPLATE_ID,
    }
}

