const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  questionText: { type: String, required: true },
  type: {
    type: String,
    enum: ['boolean', 'single_choice', 'multiple_choice', 'dropdown', 'text', 'image'],
    required: true
  },
  options: [String], // for dropdown, single_choice, multiple_choice
  required: { type: Boolean, default: false } 
});

const SectionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  sectionTitle: { type: String, required: true },
  questions: [QuestionSchema]
});

const ChecklistSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  createdBy: { type: Number, required: true }, // procurement id
  sections: [SectionSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CheckList', ChecklistSchema);
