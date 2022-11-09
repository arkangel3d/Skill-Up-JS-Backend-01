const multer = require('multer');
const path = require('path');
const createHttpError = require('http-errors');

const multerSetting = (storageFolder) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, storageFolder)
        },
        filename: (req, file, cb) => {
            req.uploadedFileName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
            cb(null, req.uploadedFileName)
        }
    });

    const fileFilter = (req, file, cb) => {

        if (!file.originalname.match(/\.(png|jpg)$/)) {
            // upload only png and jpg format
            return cb(createHttpError(400, `[Error uploading image] - [users - POST]: invalid image extention`))
        }
        cb(null, true)

    };

    return multer({ storage, fileFilter });
}

module.exports = multerSetting;