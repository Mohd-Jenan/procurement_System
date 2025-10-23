const express = require('express')
const router = express.Router()
const {protect}=require("../middleware/auth")
const { createUser, loginUser,getInspectionManagers } = require('../controller/authController');

router.post('/register',protect, createUser); 
router.post('/login', loginUser);

router.get('/inspection', protect, getInspectionManagers);



module.exports = router;
