const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Create Payment Route
router.post('/create-payment', paymentController.createPayment);

// Capture Payment Route
router.post('/capture-payment', paymentController.capturePayment);

module.exports = router;
