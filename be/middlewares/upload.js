// middleware/upload.js

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    cb(
      null,
      `${Date.now()}-${file.originalname}`
    );
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(
      file.originalname
    ).toLowerCase();

    if (
      ext !== ".csv" &&
      file.mimetype !== "text/csv"
    ) {
      return cb(
        new Error(
          "Only CSV files are allowed"
        )
      );
    }

    cb(null, true);
  },
});

module.exports = upload;

// // middleware/upload.js

// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(
//       file.originalname
//     );

//     cb(
//       null,
//       `${Date.now()}${ext}`
//     );
//   },
// });

// const upload = multer({
//   storage,
// });

// module.exports = upload;

// const multer = require("multer");

// const upload = multer({
//   storage: multer.diskStorage({
//     destination: "uploads/",
//     filename: (req, file, cb) => {
//       cb(null, Date.now() + "-" + file.originalname);
//     },
//   }),
// });
// // const upload = multer({
// //   storage: multer.memoryStorage(),
// // });

// module.exports = upload;
