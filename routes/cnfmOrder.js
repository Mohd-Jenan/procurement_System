const express = require('express');
const {protect} = require("../middleware/auth")
const router = express.Router();
const {confirmOrderByProcurement} = require('../controller/confirmOrderController');

router.put('/:orderId',protect, confirmOrderByProcurement);



module.exports = router;
