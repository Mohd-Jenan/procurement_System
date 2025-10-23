const {protect}=require("../middleware/auth")
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); 
const {submitAnswers,getAllAnswers} = require('../controller/answerController');

router.post('/submit', upload.any(),protect,submitAnswers);
router.get("/getAll",protect,getAllAnswers)
module.exports = router;
