const Order = require('../models/order');
const Answer = require('../models/answer');
const User = require("../models/Users")

exports.confirmOrderByProcurement = async (req, res) => {
  try {
    const  orderId  = parseInt(req.params.orderId);

    const loggedInUser = req.user;
    if (loggedInUser.role !== 'procurement_manager') {
      return res.status(403).json({ message: 'Only procurement managers can confirm orders' });
    }

    const order = await Order.findOne({ id: orderId });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const answer = await Answer.findOne({ orderId: order.id });
    if (!answer) {
      return res.status(400).json({ message: 'Checklist not completed by inspection manager yet' });
    }
     const userDoc = await User.findOne({ id: loggedInUser.id });
    if (!userDoc) {
      return res.status(404).json({ message: 'User not found in database' });
    }
    order.status = 'Completed';
    order.procurementConfirmedBy=userDoc._id
    order.updatedAt = new Date();
    await order.save();

    res.status(200).json({ message: 'Order confirmed by procurement manager', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
