import path from "path";
import express from "express";
import multer from "multer";
import sharp from "sharp";
import fs from "fs";

const router = express.Router();

const filenameSanitizer = (filename) => {
  return filename.replace(/[^a-z0-9.]/gi, "_").toLowerCase();
};

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    const sanitizedFileName = filenameSanitizer(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}-${sanitizedFileName}`);
  },
});

function fileFilter(req, file, cb) {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const mimeTypes = /image\/jpeg|image\/jpg|image\/png|image\/webp/;

  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = mimeTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(
      new Error("Only image files (jpeg, jpg, png, webp) are allowed!"),
      false
    );
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: process.env.FILE_SIZE_LIMIT || 10 * 1024 * 1024 }, // 10 MB limit
});

const uploadSingleFile = upload.single("file");

// Disable sharp cache
sharp.cache(false);

router.post("/upload", (req, res) => {
  uploadSingleFile(req, res, async function (err) {
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(filePath).toLowerCase();

    if (
      fileExtension === ".jpeg" ||
      fileExtension === ".jpg" ||
      fileExtension === ".png" ||
      fileExtension === ".webp"
    ) {
      try {
        const resizedFilePath = `/resized-${req.file.filename}`;

        // Resize the image using sharp, focusing on the top part and resizing from the bottom
        await sharp(filePath)
          .resize(960, 960, {
            fit: "cover",
            position: "north",
          })
          .toFile(resizedFilePath);

        // Add a delay to ensure file is released before deleting
        setTimeout(async () => {
          try {
            await fs.promises.unlink(filePath);
          } catch (unlinkErr) {
            console.error(`Error deleting original file: ${unlinkErr.message}`);
          }
        }, 1000); // 1-second delay

        return res.status(200).send({
          message: "File uploaded and resized successfully",
          file: `/${resizedFilePath}`,
        });
      } catch (sharpError) {
        console.error(`Sharp error: ${sharpError.message}`);
        return res.status(500).send({ message: "Error processing image" });
      }
    } else {
      res.status(200).send({
        message: "File uploaded successfully",
        file: `/${req.file.path}`,
      });
    }
  });
});

export default router;
