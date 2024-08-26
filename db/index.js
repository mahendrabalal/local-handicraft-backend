// db/index.js
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/https://localhandicraft.adaptable.app';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(`Connected to Mongo! Database name: "${mongoose.connections[0].name}"`);
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
