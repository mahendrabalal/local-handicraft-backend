// ℹ️ Gets access to environment variables/settings
require("dotenv").config();

// Import and configure Cloudinary
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/* Example Cloudinary URL (optional, for testing purposes)
const url = cloudinary.url('signUpBanner_iwgqvd', {
    transformation: [{
        quality: 'auto'
    }, {
        fetch_format: 'auto'
    }]
});
console.log(url); */

// Connect to the database
require("./db");

// Import required packages
const express = require("express");
const cors = require('cors');

// Import middleware
const { isAuthenticated } = require("./middleware/jwt.middleware");

// Create an Express app
const app = express();

// Configure CORS
app.use(cors({
    origin: ['http://localhost:3000', 'https://local-handicraft.netlify.app'], // Add your production URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Preflight handling
app.options('*', cors());

// Middleware configuration (e.g., for parsing JSON)
require("./config")(app);

// Start handling routes
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const productRoutes = require('./routes/products.routes');
app.use('/api/products', productRoutes);

const uploadRoutes = require('./routes/upload.routes'); // Adjusted path
app.use('/api/upload', uploadRoutes);

// Authentication routes
const authRouter = require("./routes/auth.routes");
app.use("/auth", authRouter);

// Error handling
require("./error-handling")(app);

module.exports = app;
