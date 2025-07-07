const Room = require('../models/Room');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Ensure upload directory exists
const ensureUploadDir = async () => {
  const uploadDir = path.join(__dirname, '..', process.env.UPLOAD_DIR);
  try {
    await fs.access(uploadDir);
  } catch (error) {
    await fs.mkdir(uploadDir, { recursive: true });
  }
  return uploadDir;
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const uploadDir = await ensureUploadDir();
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    // Generate unique filename while preserving extension
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: (process.env.MAX_FILE_SIZE || 10) * 1024 * 1024 // Default 10MB
  }
});

// Create a new room
exports.createRoom = async (req, res) => {
  try {
    const code = await Room.generateUniqueCode();
    const room = new Room({ code });
    await room.save();
    res.status(201).json({ code });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create room' });
  }
};

// Upload files to a room
exports.uploadFiles = async (req, res) => {
  try {
    const { code } = req.params;
    const room = await Room.findOne({ code });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Handle file upload
    upload.array('files')(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        console.error('Multer error:', err);
        return res.status(400).json({ error: err.message });
      } else if (err) {
        console.error('Upload error:', err);
        return res.status(500).json({ error: err.message });
      }

      try {
        // Add files to room
        const files = req.files.map(file => ({
          filename: file.filename,
          originalName: file.originalname,
          size: file.size,
          mimetype: file.mimetype
        }));

        room.files.push(...files);
        await room.save();

        res.status(200).json(files);
      } catch (error) {
        console.error('Error saving files to room:', error);
        res.status(500).json({ error: 'Failed to save files to room' });
      }
    });
  } catch (error) {
    console.error('Error in upload handler:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
};

// Get files in a room
exports.getFiles = async (req, res) => {
  try {
    const { code } = req.params;
    const room = await Room.findOne({ code });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json(room.files);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get files' });
  }
};

// Delete a file from a room
exports.deleteFile = async (req, res) => {
  try {
    const { code, fileId } = req.params;
    const room = await Room.findOne({ code });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const file = room.files.id(fileId);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '.', '.', process.env.UPLOAD_DIR, file.filename);
    await fs.unlink(filePath);

    // Remove file from room
    room.files.pull(fileId);
    await room.save();

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete file' });
  }
};