// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");
const mongoose= require('mongoose');
const cors = require('cors');

//import middleware
const {isAuthenticated} = require("./middleware/jwt.middleware");

//create an Express app
const app = express();


//Configure CORS
const origin = process.env.ORIGIN || '*';
app.use(cors({
    origin: process.env.ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials:true
}));



// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);


// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const productRoutes = require('./routes/products.routes');
app.use('/api/products', productRoutes);
//const allRoutes = require("./routes");
//app.use("/api", allRoutes);

//example
//const projectRouter = require("./routes")
//app.use("/api", isAuthenticated, projectRouter)


//Authentication routes
const authRouter = require("./routes/auth.routes");
app.use("/auth", authRouter);

require("./error-handling")(app);


// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
