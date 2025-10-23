const Answer = require("../models/answer") 
const Checklist = require('../models/checklist');
 const User = require('../models/Users');
 const Order = require("../models/order")
exports.submitAnswers = async (req, res) => {
  try {
    const { orderId, checklistId} = req.body;
    let { answers } = req.body;

    const loggedInUser = req.user;
    const filledByID = loggedInUser.id;
    if (loggedInUser.role!== 'inspection_manager') {
      return res.status(403).json({ message: 'Only inspection manager can submit checklist' });
    }
    // Validate numeric fields before using them
    if (!orderId || isNaN(Number(orderId))) {
      return res.status(400).json({ message: "Invalid or missing orderId" });
    }
    if (!checklistId || isNaN(Number(checklistId))) {
      return res.status(400).json({ message: "Invalid or missing checklistId" });
    }
    
    if (typeof answers === 'string') answers = JSON.parse(answers);

    const orderID = Number(orderId);
    const checklistID = Number(checklistId);

    const checklist = await Checklist.findOne({ id: checklistID });
    if (!checklist) {
      return res.status(404).json({ message: 'Checklist not found' });
    }

    // for Validating required questions
    for (const section of checklist.sections) {
      for (const q of section.questions) {
        if (q.required) {
          const found = answers.find(a => a.questionId === q.id);
          if (!found) {
            return res.status(400).json({ message: `Missing answer for required question: ${q.questionText}` });
          }
        }
      }
    }

    // for handle image uploads ..........
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const match = file.fieldname.match(/question_(\d+)/);
        if (match) {
          const qid = Number(match[1]);
          const ans = answers.find(a => a.questionId === qid);
          if (ans) {
            ans.imageUrl = `/uploads/${file.filename}`;
          }
        }
      }
    }

    const last = await Answer.findOne().sort({ id: -1 });
    const newId = last ? last.id + 1 : 1;

    const newAnswer = new Answer({
      id: newId,
      orderId: orderID,
      checklistId: checklistID,
      filledBy: filledByID,
      answers
    });

    await newAnswer.save();
    const order = await Order.findOne({ id: orderID });
    if (order) {
        const userDoc = await User.findOne({ id: loggedInUser.id });
      if (!userDoc) {
    return res.status(404).json({ message: 'User not found' });
    }
      order.status = 'Inspection Done';
      order.inspectionConfirmedBy = userDoc._id;
      order.updatedAt = new Date();
      await order.save();
    }
    res.json({ message: 'Checklist answers submitted successfully', newAnswer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllAnswers = async (req, res) => {
  const user = await User.findOne({ id: req.user.id });
  if (user.role !== 'admin')
    return res.status(403).json({ message: 'Only admin can view all answers' });

  const allAnswers = await Answer.find().populate('checklistId orderId filledBy');
  res.json(allAnswers);
};

