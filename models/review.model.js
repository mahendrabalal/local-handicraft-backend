const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/jwt.middleware');
const Review = require('../models/review.model');
const Product = require('../models/Product.model');

router.post('/product/:id/rate', isAuthenticated, async (req, res) => {
    const { id: productId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    try {
        const newReview = new Review({
            user: req.payload._id,
            product: productId,
            rating,
            comment
        });

        await newReview.save();

        const reviews = await Review.find({ product: productId });
        const avgRating = (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(2);

        await Product.findByIdAndUpdate(productId, { averageRating: avgRating }, { new: true });

        res.status(201).json({ averageRating: avgRating });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ message: 'Error submitting review', error: error.message });
    }
});

module.exports = router;
