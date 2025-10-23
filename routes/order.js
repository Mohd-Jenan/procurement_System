const express = require('express');
const {protect} = require("../middleware/auth")
const router = express.Router();
const {createOrder,getOrders,updateOrderStatus,linkChecklistToOrder} = require('../controller/orderController');

router.post('/create',protect, createOrder);
router.get('/getOrder',protect, getOrders);
router.put('/updateOrderStatus',protect, updateOrderStatus);
router.post('/link-checklist',protect, linkChecklistToOrder);


module.exports = router;
