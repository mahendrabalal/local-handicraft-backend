// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = require('./app');

// Connect to the database
require('./db'); // This will execute the connection code in db/index.js

// Start the server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
