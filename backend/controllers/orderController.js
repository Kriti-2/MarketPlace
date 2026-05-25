import { dataService } from '../config/dataService.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res, next) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  try {
    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items specified');
    }

    const order = await dataService.orders.create({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await dataService.orders.findById(req.params.id);

    if (order) {
      // Allow only the owner or an admin to access the order details
      if (req.user.isAdmin || order.user._id.toString() === req.user._id.toString()) {
        res.json(order);
      } else {
        res.status(401);
        throw new Error('Not authorized to view this order');
      }
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await dataService.orders.findById(req.params.id);

    if (order) {
      const updatedOrder = await dataService.orders.findByIdAndUpdate(req.params.id, {
        isPaid: true,
        paidAt: new Date().toISOString(),
        paymentResult: {
          id: req.body.id || 'PAYMENT_MOCK_SUCCESS_' + Math.random().toString(36).substring(2, 9).toUpperCase(),
          status: req.body.status || 'COMPLETED',
          update_time: req.body.update_time || new Date().toISOString(),
          email_address: req.body.email_address || req.user.email,
        },
      });

      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = async (req, res, next) => {
  try {
    const order = await dataService.orders.findById(req.params.id);

    if (order) {
      const updatedOrder = await dataService.orders.findByIdAndUpdate(req.params.id, {
        isDelivered: true,
        deliveredAt: new Date().toISOString(),
      });

      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await dataService.orders.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res, next) => {
  try {
    const orders = await dataService.orders.find({});
    res.json(orders);
  } catch (error) {
    next(error);
  }
};
