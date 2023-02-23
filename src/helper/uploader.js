const multer = require("multer");
const fs = require("fs");

const uploader = (directory, filePrefix) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {},
    filename: (req, file, cb) => {},
  });

  const fileFilter = (req, file, cb) => {};

  return multer({ storage, fileFilter });
};

module.exports = uploader;
