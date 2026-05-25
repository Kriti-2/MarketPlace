import express from 'express';
import { getPaymentConfig, processPayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/config', protect, getPaymentConfig);
router.post('/process', protect, processPayment);

export default router;
