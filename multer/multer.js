const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./public");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});

function fileFilter(req, file, cb) {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    //prevent to upload
    cb({ message: "unsupported File Format" }, false);
  }
}

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
