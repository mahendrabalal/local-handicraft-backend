// db/index.js
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mongodb+srv://mahendrabalalport:kathmandu55AB@cluster0.csrbs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(`Connected to Mongo! Database name: "${mongoose.connections[0].name}"`);
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
