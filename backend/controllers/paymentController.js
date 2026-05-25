// @desc    Get Stripe payment configuration / publishable key
// @route   GET /api/payments/config
// @access  Private
export const getPaymentConfig = async (req, res, next) => {
  try {
    // Return Stripe sandbox configuration or mock status
    res.json({
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_mock_horizon_cart_stripe_key_51P0',
      status: 'simulated'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Process simulated payment transaction
// @route   POST /api/payments/process
// @access  Private
export const processPayment = async (req, res, next) => {
  const { amount, currency } = req.body;

  try {
    if (!amount) {
      res.status(400);
      throw new Error('Payment amount is required');
    }

    // Return a successful simulated checkout intent response
    res.status(200).json({
      success: true,
      transactionId: 'TXN_' + Math.random().toString(36).substring(2, 12).toUpperCase(),
      amount: amount,
      currency: currency || 'usd',
      status: 'succeeded',
      message: 'Simulated payment succeeded through Horizon Gateways.'
    });
  } catch (error) {
    next(error);
  }
};
