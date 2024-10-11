const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/local-handicraft-backend';

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(`Connected to MongoDB! Database name: "${mongoose.connection.name}"`);
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit the process if there's an error
  });

// Optional: Listen for connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
