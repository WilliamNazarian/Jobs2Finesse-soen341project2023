const multer = require('multer');

// this code sets up a Multer middleware configuration that saves uploaded files to the CVs directory with a unique filename based on 
//the current timestamp and the original filename of the uploaded file.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'CVs');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

//this function allows only PDF files to be uploaded, and rejects all other file types with an error message.
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

// this code sets up a Multer middleware instance with the specified storage and file filtering options, which can be used to handle file uploads
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
