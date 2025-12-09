const mongoose = require('mongoose');

const answerItemSchema = new mongoose.Schema({
  questionId: Number,
  questionText: String,
  value: mongoose.Schema.Types.Mixed, // value can be string, boolean, array, or image URL
  imageUrl: String 
}, { _id: false }); 

const answerSchema = new mongoose.Schema({
  id: Number,
  orderId: { type: Number, required: true },
  checklistId: { type: Number, required: true },
  filledBy: { type: Number, required: true }, // inspection manager id
  answers: [answerItemSchema],
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Answer', answerSchema);
