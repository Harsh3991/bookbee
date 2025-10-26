const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = (fileBuffer, folder = 'bookbee') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({
      folder,
      resource_type: 'auto',
    }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    });

    // Convert buffer to stream and pipe to Cloudinary
    const bufferStream = require('stream').Readable.from(fileBuffer);
    bufferStream.pipe(uploadStream);
  });
};

const deleteFromCloudinary = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
};
