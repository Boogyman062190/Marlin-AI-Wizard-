// Complete Marlin AI Firmware Generator

// Dependencies
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const archiver = require('archiver');
const path = require('path');
const axios = require('axios');

// Setup Express server
const app = express();
const port = process.env.PORT || 5000;

// Middleware for JSON and file uploads
app.use(express.json());
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'backend', 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

// Serve frontend files
app.use(express.static(path.join(__dirname, 'frontend', 'build')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

// Upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  res.json({ message: 'File uploaded successfully', filename: req.file.filename });
});

// Generate modified firmware and create download endpoint
app.post('/api/generate', (req, res) => {
  const originalFileName = req.body.originalFileName; // Get original file name from request

  // Simulated modification process
  const modifiedFileName = `modified_${originalFileName}`;
  const sourcePath = path.join(__dirname, 'backend', 'uploads', originalFileName);
  const destPath = path.join(__dirname, 'backend', 'uploads', modifiedFileName);

  // Example: Copying the file with a simulated modification
  fs.copyFileSync(sourcePath, destPath);

  // Create a ZIP archive of modified firmware
  const outputZip = fs.createWriteStream(path.join(__dirname, 'backend', 'uploads', 'modified_firmware.zip'));
  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level
  });
  archive.directory(path.join(__dirname, 'backend', 'uploads'), false); // Add all files in uploads directory to ZIP

  outputZip.on('close', () => {
    console.log('Archive created successfully');
    res.download(path.join(__dirname, 'backend', 'uploads', 'modified_firmware.zip'), (err) => {
      if (err) {
        console.error('Error downloading archive:', err);
        res.status(500).json({ message: 'Error downloading archive' });
      } else {
        // Clean up uploaded files after download
        fs.unlinkSync(sourcePath);
        fs.unlinkSync(destPath);
        fs.unlinkSync(path.join(__dirname, 'backend', 'uploads', 'modified_firmware.zip'));
      }
    });
  });

  archive.pipe(outputZip);
  archive.finalize();
});

// Handle frontend requests
app.post('/api/request-modify', async (req, res) => {
  // Simulated AI logic to generate modifications based on user request
  try {
    const modificationRequest = req.body.modificationRequest;
    // Simulated AI response
    const aiResponse = `AI has processed your request: ${modificationRequest}`;
    res.json({ message: aiResponse });
  } catch (error) {
    console.error('Error processing modification request:', error);
    res.status(500).json({ message: 'Error processing modification request' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
