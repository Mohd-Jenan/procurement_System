const Order = require('../models/order');
const Checklist = require('../models/checklist'); // assume you have a checklist model
const User = require('../models/Users');

// for new orderId
const getNextOrderId = async () => {
  const lastOrder = await Order.findOne().sort({ id: -1 });
  return lastOrder ? lastOrder.id + 1 : 1;
};

exports.createOrder = async (req, res) => {
  try {
    const {clientId, productName, quantity} = req.body;

    const loggedInUser= req.user
    if(!loggedInUser){
      return res. status(401).json({message:"Unauthorized. Please login again"})
    }
    if (loggedInUser.role !== 'procurement_manager') {
      return res.status(403).json({ message: 'Only procurement managers can create orders' });
    }
    const client = await User.findOne({id:clientId});
    if (!client || client.role !== 'client') {
      return res.status(400).json({ message: 'Invalid client ID. Must belong to a client user.' });
    }
    const userDoc = await User.findOne({ id: loggedInUser.id });
        if (!userDoc) {
          return res.status(404).json({ message: 'User not found in database' });
        }

    const newId = await getNextOrderId();

    const order = new Order({
      id: newId,
      clientId,
      productName,
      quantity,
      checklistId: null,
      status: 'Pending',
      createdBy:userDoc._id
     
    });

    
    await order.save();

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    
    const user = req.user;
    if (!user) return res.status(403).json({ message: 'Unauthorized' });

    let orders = [];

    if (user.role === 'admin') {
      orders = await Order.find();
    } 
    else if (user.role === 'procurement_manager') {
      orders = await Order.find();
    } 
    else if (user.role === 'inspection_manager') {
      orders = await Order.find();
    } 
    else if (user.role === 'client') {
      orders = await Order.find({ clientId: user.id });
    } 
    else {
      return res.status(403).json({ message: 'You are not authorized to view orders' });
    }
    const formattedOrders = orders.map(order => ({
      id: order.id,
      productName: order.productName,
      quantity: order.quantity,
      status: order.status,
      checklistId: order.checklistId
    }));

    res.json({ orders: formattedOrders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, newStatus } = req.body;

    const user = req.user
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!['inspection_manager', 'procurement_manager', 'admin'].includes(user.role))
      return res.status(403).json({ message: 'You are not allowed to update order status' });

    const order = await Order.findOneAndUpdate({ id: orderId });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    order.status = newStatus;
   
    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.linkChecklistToOrder = async (req, res) => {
  try {
    const { orderId, checklistId } = req.body;
    const user = req.user;
    if (user.role !== 'procurement_manager')
      return res.status(403).json({ message: 'Only procurement manager can link checklist' });

    const order = await Order.findOne({ id: orderId });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const checklist = await Checklist.findOne({ id: checklistId });
    if (!checklist) return res.status(404).json({ message: 'Checklist not found' });

    order.checklistId = checklistId;
    order.updatedAt = new Date();
    await order.save();

    res.json({ message: 'Checklist linked to order successfully', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};