const paypal = require('paypal-rest-sdk');

// Configure PayPal SDK
paypal.configure({
    mode: 'sandbox', // Change to 'live' for production
    client_id: 'AdZyX3L51confO8DQuXMsQL2vw2sNqPj1b7jgkuJswAOPvl1g8GYDcOjNqDVDr1LeE-F6RM4QDrLHyGi',
    client_secret: 'EPp6J3c1btEEodH40UH7qPbW8I1XzbEKlVP-cAdLxL2yE29R-O4ZD0MfWURBE7HEvgIc87N8jWvfe-7L'
});

exports.createPayment = (req, res) => {
    const { totalPrice } = req.body;

    const create_payment_json = {
        intent: 'sale',
        payer: {
            payment_method: 'paypal'
        },
        transactions: [{
            amount: {
                currency: 'USD',
                total: totalPrice
            },
            description: 'This is the payment transaction description.'
        }],
        redirect_urls: {
            return_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/cancel'
        }
    };

    paypal.payment.create(create_payment_json, (error, payment) => {
        if (error) {
            console.error(error);
            res.status(500).send(error);
        } else {
            res.json(payment);
        }
    });
};

exports.capturePayment = (req, res) => {
    const { paymentId, payerId } = req.body;

    const execute_payment_json = {
        payer_id: payerId
    };

    paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
        if (error) {
            console.error(error);
            res.status(500).send(error);
        } else {
            res.json(payment);
        }
    });
};
