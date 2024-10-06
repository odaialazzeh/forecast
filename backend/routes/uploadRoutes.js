import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

const filenameSanitizer = (filename) => {
  return filename.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
};

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    const sanitizedFileName = filenameSanitizer(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}-${sanitizedFileName}`);
  },
});

function fileFilter(req, file, cb) {
  const allowedTypes = /jpeg|jpg|png|webp|pdf/;
  const mimeTypes = /image\/jpeg|image\/jpg|image\/png|image\/webp|application\/pdf/;

  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimeTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images and PDF files are allowed!'), false);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: process.env.FILE_SIZE_LIMIT || 10 * 1024 * 1024 } // 10 MB limit
});
const uploadSingleFile = upload.single('file');

router.post('/upload', (req, res) => {
  uploadSingleFile(req, res, function (err) {
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).send({ message: 'No file uploaded' });
    }
    res.status(200).send({
      message: 'File uploaded successfully',
      file: `/${req.file.path}`
    });
  });
});

export default router;
