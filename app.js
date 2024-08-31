// ℹ️ Gets access to environment variables/settings
require("dotenv").config();

// Import and configure Cloudinary
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Connect to the database
require("./db");

// Import required packages
const express = require("express");
const cors = require('cors');

// Import middleware
const { isAuthenticated } = require("./middleware/jwt.middleware");

// Create an Express app
const app = express();

// Get allowed origins from environment variables
const allowedOrigins = [
    'http://localhost:5173', // Local development origin
    'https://localhandicraft.netlify.app' // Production origin
];

// Set up CORS middleware with detailed options
app.use(cors({
    origin: function (origin, callback) {
      // Check if the incoming origin is allowed
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error('Not allowed by CORS')); // Block the request
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow additional HTTP methods if needed
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow headers needed by your requests
    credentials: true // Allow credentials (cookies, authorization headers, TLS client certificates)
  }));

// Preflight handling
app.options('*', cors());

// Middleware configuration (e.g., for parsing JSON)
require("./config")(app);



//product routes
const productRoutes = require('./routes/products.routes');
app.use('/api/products', productRoutes);

//review
const reviewRoutes = require('./routes/reviews.routes'); // Adjust the path as necessary
app.use('/api/reviews', reviewRoutes);

// send e-mail
const sendEmail =  require('./routes/email.routes');
app.use('/api/email', sendEmail);

//upload
const uploadRoutes = require('./routes/upload.routes'); // Adjusted path
app.use('/api/upload', uploadRoutes);

// Authentication routes
const authRouter = require("./routes/auth.routes");
app.use("/auth", authRouter);

// Error handling
require("./error-handling")(app);

module.exports = app;
