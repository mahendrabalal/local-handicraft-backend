const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

const router = express.Router();
const saltRounds = 10;

// POST /auth/signup  - Creates a new user in the database
router.post('/signup', (req, res, next) => {
    const { email, password, name } = req.body;
   
    // Check if the email or password or name is provided as an empty string 
    if (email === '' || password === '' || name === '') {
      res.status(400).json({ message: "Provide email, password and name" });
      return;
    }
   
    // Use regex to validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: 'Provide a valid email address.' });
      return;
    }
    
    // Use regex to validate the password format
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({ message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.' });
      return;
    }
   
   
    // Check the users collection if a user with the same email already exists
    User.findOne({ email })
      .then((foundUser) => {
        // If the user with the same email already exists, send an error response
        if (foundUser) {
          res.status(400).json({ message: "User already exists." });
          return;
        }
   
        // If the email is unique, proceed to hash the password
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
   
        // Create a new user in the database
        // We return a pending promise, which allows us to chain another `then` 
        return User.create({ email, password: hashedPassword, name });
      })
      .then((createdUser) => {
        // Deconstruct the newly created user object to omit the password
        // We should never expose passwords publicly
        const { email, name, _id } = createdUser;
      
        // Create a new object that doesn't expose the password
        const user = { email, name, _id };
   
        // Send a json response containing the user object
        res.status(201).json({ user: user });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" })
      });
  });
  
// POST  /auth/login - Verifies email and password and returns a JWT
router.post('/login', (req, res, next) => {
    const { email, password } = req.body;
   
    // Check if email or password are provided as empty string 
    if (email === '' || password === '') {
      res.status(400).json({ message: "Provide email and password." });
      return;
    }
   
    // Check the users collection if a user with the same email exists
    User.findOne({ email })
      .then((foundUser) => {
      
        if (!foundUser) {
          // If the user is not found, send an error response
          res.status(401).json({ message: "User not found." })
          return;
        }
   
        // Compare the provided password with the one saved in the database
        const passwordCorrect = bcrypt.compareSync(password, foundUser.password);
   
        if (passwordCorrect) {
          // Deconstruct the user object to omit the password
          const { _id, email, name } = foundUser;
          
          // Create an object that will be set as the token payload
          const payload = { _id, email, name };
   
          // Create and sign the token
          const authToken = jwt.sign( 
            payload,
            process.env.TOKEN_SECRET,
            { algorithm: 'HS256', expiresIn: "6h" }
          );
   
          // Send the token as the response
          res.status(200).json({ authToken: authToken });
        }
        else {
          res.status(401).json({ message: "Unable to authenticate the user" });
        }
   
      })
      .catch(err => res.status(500).json({ message: "Internal Server Error" }));
  });

// GET /auth/verify - Verify JWT
router.get('/verify', isAuthenticated, (req, res) => {
    res.status(200).json(req.payload);
});


//profile
router.get('/profile', isAuthenticated, async (req, res) => {
    const userId = req.payload._id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Include profileImage and bio in the response
        const { email, name, _id, profileImage, bio, socialLinks, hobbies} = user;
        res.status(200).json({ email, name, _id, profileImage, bio, socialLinks, hobbies});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// PUT /auth/profile - Update user profile
router.put('/profile', isAuthenticated, async (req, res) => {
    const { name, email, profileImage, bio, socialLinks, hobbies} = req.body;

    try {
        // Check if name and email are provided, which are mandatory fields
        if (!name || !email) return res.status(400).json({ message: 'Name and email are required' });

        // Update user with name, email, profileImage, and bio
        const updatedUser = await User.findByIdAndUpdate(
            req.payload._id,
            { name, email, profileImage, bio, socialLinks, hobbies}, // Add profileImage and bio here
            { new: true } // Return the updated document
        );

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating profile', error });
    }
});


module.exports = router;
