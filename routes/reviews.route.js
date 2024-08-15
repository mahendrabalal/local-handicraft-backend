const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Review = require('../models/review.model');
const Product = require('../models/Product.model');
const { isAuthenticated } = require('../middleware/jwt.middleware'); // Adjust path as needed

// POST /api/reviews/product/:productId/rate - Rate a product
router.post('/product/:productId/rate', isAuthenticated, async (req, res) => {
    const { productId } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    try {
        const newReview = new Review({
            user: req.payload._id,
            product: productId,
            rating
        });

        await newReview.save();

        // Calculate the average rating for the product
        const reviews = await Review.find({ product: productId });
        const avgRating = (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(2);

        // Update the product with the new average rating
        await Product.findByIdAndUpdate(productId, { averageRating: avgRating });

        res.status(201).json({ averageRating: avgRating });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting rating', error: error.message });
    }
});

module.exports = router;
