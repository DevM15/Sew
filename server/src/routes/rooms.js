const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// Create a new room
router.post('/', roomController.createRoom);

// Upload files to a room
router.post('/:code/files', roomController.uploadFiles);

// Get files in a room
router.get('/:code/files', roomController.getFiles);

// Delete a file from a room
router.delete('/:code/files/:fileId', roomController.deleteFile);

module.exports = router;