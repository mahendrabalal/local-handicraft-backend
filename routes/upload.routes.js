const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2; // Ensure to use v2
const streamifier = require('streamifier'); // To handle streams

// Configure multer for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    // Convert the buffer to a stream
    const stream = cloudinary.uploader.upload_stream(
      {
        // Optional: Cloudinary upload options
        folder: 'uploads', // Example folder
        use_filename: true,
        unique_filename: true
      },
      (error, result) => {
        if (error) {
          return res.status(500).send(error);
        }
        res.status(200).json({
          url: result.secure_url,
          public_id: result.public_id
        });
      }
    );

    // Pipe the file buffer to Cloudinary
    streamifier.createReadStream(req.file.buffer).pipe(stream);

  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
