const multerSetting = require('../helpers/multerSetting');
const upload = multerSetting('./public/img/profiles');
const uploadSingleImage = upload.single('profile-pic');

console.log('loaded')
const profilePictureHandler = (req, res, next) => {
    uploadSingleImage(req, res, err => {
        if (err) {
            return res.status(400).json({
                message: err.message
            })
        }
        return next();
    })
}

module.exports = profilePictureHandler;