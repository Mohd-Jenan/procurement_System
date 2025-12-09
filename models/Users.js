const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String, required: true },
  email: { type: String,required:true },
  mobile: { type: String,required:true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'procurement_manager', 'inspection_manager', 'client'],
    required: true
  },
  assignedTo: { type: Number, default: null }, // for inspection_manager under procurement_manager
  createdBy: { type: Number }, 
});

module.exports = mongoose.model('User', userSchema);
