const express = require('express');
const router = express.Router();
const {protect}=require("../middleware/auth")
const {createChecklist,getAllChecklists,getChecklistById} = require('../controller/checklistController');

router.post('/create',protect, createChecklist);
router.get('/getAll', getAllChecklists);
router.get('/getBy/:id',getChecklistById);

module.exports = router;
