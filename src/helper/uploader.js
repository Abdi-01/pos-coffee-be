const multer = require("multer");
const fs = require("fs");

const uploader = (directory, filePrefix) => {
  // directory = alamat simpan gambar,  prefix itu kode khusus untuk menggambarkan itu gambar apa
  // Define default directory storage

  let defaultDir = "./src/public";

  // Multer config
  // 1. config default storage location
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const storeDir = directory ? defaultDir + directory : defaultDir; // check klo user tdi memprovide parameter directory maka file akan disimpan ke src/public
      if (fs.existsSync(storeDir)) {
        console.log(`Directory ${storeDir} exists ✅`);
        cb(null, storeDir);
      } else {
        fs.mkdir(storeDir, { recursive: true }, (error) => {
          if (error) {
            console.log(`error at create directory: ${error}`);
          }
          cb(error, storeDir);
        });
      }
    },
    filename: (req, file, cb) => {
      console.log("cek original name", file.originalname);
      let ext =
        file.originalname.split(".")[file.originalname.split(".").length - 1];
      console.log("check extension = ", ext);

      let newName = filePrefix + Date.now() + "." + ext;
      console.log("New name = ", newName);
      cb(null, newName);
    },
  });

  // 2. config file filter
  const fileFilter = (req, file, cb) => {
    const extFilter = /\.(jpg|jpeg|png|webp|avif)/;
    let checkExt = file.originalname.toLowerCase().match(extFilter);
    if (checkExt) {
      cb(null, true);
    } else {
      cb(new Error("Your file extension denied"), false);
    }
  };

  return multer({ storage, fileFilter });
};

module.exports = uploader;
