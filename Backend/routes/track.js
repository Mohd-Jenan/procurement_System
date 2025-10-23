const express = require('express');
const { protect } = require('../middleware/auth');
const { getOrdersByClient,getOrdersForAdmin } = require('../controller/trackController');

const router = express.Router();

router.get('/tracking/:clientId', protect, getOrdersByClient);
router.get('/admin/order',protect,getOrdersForAdmin)

module.exports = router;
