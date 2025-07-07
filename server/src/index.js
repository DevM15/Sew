const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Import routes
const roomRoutes = require('./routes/rooms');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());

// Serve uploaded files
// app.use('/uploads', express.static(path.join(__dirname, ".", process.env.UPLOAD_DIR)));

app.get('/uploads/:filename', (req, res) => {
  const filePath = path.join(__dirname, process.env.UPLOAD_DIR, req.params.filename);
  res.download(filePath, req.params.filename, err => {
    if (err) {
      res.status(404).send("File not found");
    }
  });
});

// API routes
app.use('/api/rooms', roomRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });