const {Forbidden} = require("http-errors");
const multer = require("multer");
const path = require("path");
const {generate} = require("shortid");
const Jimp = require("jimp");

const tmpPath = path.join(__dirname, '../../../tmp/')
const avatarsPath = path.join(__dirname, '../../../public/avatars/')
exports.upload = multer({
    storage: multer.diskStorage({
        destination: tmpPath,
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            return cb(null, `${generate()}${ext}`);
        },
    }),
});

exports.resizeAvatar = () => {
    return async (req, res, next) => {
        const avatar = `${tmpPath}${req.file.filename}`
        const savePath = `${avatarsPath}${req.file.filename.replace('.jpg', '')}-new-image.jpg`
        const newAvatarUrl = `/avatars/${req.file.filename.replace('.jpg', '')}-new-image.jpg`
        try {
            const image = await Jimp.read(avatar)
            image.resize(256, 256).write(savePath);
        } catch (error) {
            throw new Forbidden();
        }
        req.body = {avatarURL: newAvatarUrl}
        next();
    }
}