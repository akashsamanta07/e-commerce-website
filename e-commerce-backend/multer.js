
const multer = require('multer');
const path = require('path');

// Only allow image files
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Use memory storage, no local disk
const storage = multer.memoryStorage();

const multerOptions = {
  storage,
  fileFilter
};

module.exports = {
  multer,
  multerOptions,
};
