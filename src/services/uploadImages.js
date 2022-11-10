const { unlink } = require('fs');
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const imageStorage = {};

imageStorage.upload = async (name) => {
  const tempPath = `./public/img/profiles/${name}`;
  const image = await cloudinary.uploader.upload(tempPath, {
    folder: process.env.CLOUDINARY_FOLDER_NAME,
    width: process.env.CLOUDINARY_IMAGE_WIDTH,
    height: process.env.CLOUDINARY_IMAGE_HEIGHT,
    crop: 'scale'
  });
  unlink(tempPath, (err) => {
    if (err) throw new Error(err);
  });

  return image;
};

imageStorage.destroy = async (imgUrlPath) => {
  const segments = imgUrlPath.split('/');
  const imageId = segments[segments.length - 1].split('.')[0];
  return await cloudinary.uploader.destroy(`${process.env.CLOUDINARY_FOLDER_NAME}/${imageId}`);
};

module.exports = imageStorage;
