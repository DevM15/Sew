const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  mimetype: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return v === 'application/pdf';
      },
      message: 'Only PDF files are allowed'
    }
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

const roomSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    length: 6
  },
  files: [fileSchema],
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update lastAccessed timestamp on file operations
roomSchema.pre('save', function(next) {
  this.lastAccessed = new Date();
  next();
});

// Generate unique room code
roomSchema.statics.generateUniqueCode = async function() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const codeLength = 6;
  
  while (true) {
    let code = '';
    for (let i = 0; i < codeLength; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    // Check if code already exists
    const existingRoom = await this.findOne({ code });
    if (!existingRoom) {
      return code;
    }
  }
};

// Clean up old rooms
roomSchema.statics.cleanupOldRooms = async function() {
  const cleanupDays = process.env.ROOM_CLEANUP_DAYS || 7;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - cleanupDays);
  
  const result = await this.deleteMany({
    lastAccessed: { $lt: cutoffDate },
    'files.0': { $exists: false } // Only delete rooms with no files
  });
  
  console.log(`Cleaned up ${result.deletedCount} empty rooms`);
};

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;